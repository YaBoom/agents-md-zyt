/**
 * AGENTS.md Parser - 实验性实现
 * 
 * 这个项目是我学习AGENTS.md标准时做的实验代码
 * 参考: https://agents.md/
 * 
 * TODO:
 * - [ ] 支持更复杂的Markdown解析
 * - [ ] 添加AGENT Skills解析支持
 * - [ ] 实现嵌套AGENTS.md的优先级处理
 * - [ ] 添加更多测试用例
 * 
 * 已知问题:
 * - 目前只支持基本的Markdown header解析
 * - 没有处理YAML frontmatter（SKILL.md格式）
 * - 错误处理比较粗糙
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';

export interface AgentSection {
  title: string;
  content: string;
  level: number;
}

export interface ParsedAgentsMd {
  filePath: string;
  sections: AgentSection[];
  raw: string;
}

/**
 * 解析AGENTS.md文件
 * 
 * 说实话，一开始我想直接用正则表达式解析
 * 后来发现Markdown比想象中复杂，特别是代码块里的#符号
 * 这个版本先用简单的逐行解析，以后可能要用marked之类的库
 */
export function parseAgentsMd(filePath: string): ParsedAgentsMd {
  if (!existsSync(filePath)) {
    throw new Error(`AGENTS.md not found: ${filePath}`);
  }

  const raw = readFileSync(filePath, 'utf-8');
  const sections: AgentSection[] = [];
  
  // 简单的逐行解析，其实不太健壮
  // 更好的做法是用markdown-it或者marked
  const lines = raw.split('\n');
  let currentSection: AgentSection | null = null;
  let currentContent: string[] = [];

  for (const line of lines) {
    // 匹配Markdown标题: # ## ###
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    
    if (headerMatch) {
      // 保存之前的section
      if (currentSection) {
        currentSection.content = currentContent.join('\n').trim();
        sections.push(currentSection);
      }
      
      // 开始新的section
      currentSection = {
        title: headerMatch[2].trim(),
        content: '',
        level: headerMatch[1].length
      };
      currentContent = [];
    } else if (currentSection) {
      currentContent.push(line);
    }
  }

  // 别忘了最后一个section
  if (currentSection) {
    currentSection.content = currentContent.join('\n').trim();
    sections.push(currentSection);
  }

  return {
    filePath,
    sections,
    raw
  };
}

/**
 * 查找最近的AGENTS.md
 * 
 * 根据规范，agent应该使用离工作目录最近的AGENTS.md
 * 这个是模拟那种行为，但实际上应该用递归查找parent directory
 * 
 * 我的理解：
 * /project/AGENTS.md <- 根目录
 * /project/packages/api/AGENTS.md <- 子项目
 * 在api目录工作时，应该优先用api下面的AGENTS.md
 */
export function findNearestAgentsMd(startPath: string): string | null {
  // TODO: 实现真正的向上递归查找
  // 现在这样只是占位，演示概念
  const candidates = [
    resolve(startPath, 'AGENTS.md'),
    resolve(startPath, '..', 'AGENTS.md'),
    resolve(startPath, '..', '..', 'AGENTS.md')
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

/**
 * 验证AGENTS.md是否符合常见约定
 * 
 * 基于我收集的examples，常见的sections包括:
 * - Setup commands
 * - Code style
 * - Testing instructions
 * - Security considerations
 */
export function validateAgentsMd(parsed: ParsedAgentsMd): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  const sectionTitles = parsed.sections.map(s => s.title.toLowerCase());

  // 检查推荐sections（非强制，只是建议）
  const recommendedSections = [
    { name: 'setup', keywords: ['setup', 'install', 'commands'] },
    { name: 'style', keywords: ['style', 'convention', 'format'] },
    { name: 'test', keywords: ['test', 'testing'] }
  ];

  for (const rec of recommendedSections) {
    const hasMatch = sectionTitles.some(title => 
      rec.keywords.some(kw => title.includes(kw))
    );
    
    if (!hasMatch) {
      issues.push(`建议添加 ${rec.name} 相关内容`);
    }
  }

  // 检查是否为空文件
  if (parsed.sections.length === 0) {
    issues.push('文件似乎没有有效的Markdown标题');
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

// CLI入口
if (import.meta.url === `file://${process.argv[1]}`) {
  const targetPath = process.argv[2] || '.';
  
  console.log('🔍 AGENTS.md Parser - 实验版本\n');
  
  const agentsFile = findNearestAgentsMd(targetPath);
  
  if (!agentsFile) {
    console.error('❌ 没找到AGENTS.md文件');
    console.log('提示: 在当前目录创建AGENTS.md试试？');
    process.exit(1);
  }

  console.log(`📄 找到: ${agentsFile}\n`);
  
  try {
    const parsed = parseAgentsMd(agentsFile);
    
    console.log(`📊 解析结果:`);
    console.log(`   - 共 ${parsed.sections.length} 个section\n`);
    
    parsed.sections.forEach((section, i) => {
      const prefix = '  '.repeat(section.level - 1);
      console.log(`${prefix}${i + 1}. ${section.title}`);
      
      // 只显示内容的前100字符，避免刷屏
      const preview = section.content.slice(0, 100).replace(/\n/g, ' ');
      if (preview) {
        console.log(`${prefix}   ${preview}${section.content.length > 100 ? '...' : ''}`);
      }
      console.log();
    });

    // 验证
    const validation = validateAgentsMd(parsed);
    console.log('🔍 验证结果:');
    if (validation.valid) {
      console.log('   ✅ 符合常见约定');
    } else {
      console.log('   ⚠️  建议:');
      validation.issues.forEach(issue => console.log(`      - ${issue}`));
    }

  } catch (err) {
    console.error('❌ 解析失败:', err);
    process.exit(1);
  }
}
