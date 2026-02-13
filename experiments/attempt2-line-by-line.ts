/**
 * 第二次尝试 - 简单的逐行解析
 * 
 * 改进点：
 * - 逐行读取，可以跟踪是否在代码块内
 * - 更简单，更容易debug
 * 
 * 但还是有问题：
 * - 没有处理代码块里的内容
 * - 性能一般（大文件会慢）
 * - 没有处理YAML frontmatter
 */

export function parseLineByLine(content: string) {
  const lines = content.split('\n');
  const sections: Array<{title: string; level: number; content: string}> = [];
  
  let current: any = null;
  let buffer: string[] = [];
  let inCodeBlock = false;

  for (const line of lines) {
    // 切换代码块状态
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
    }

    // 只有在代码块外才解析标题
    if (!inCodeBlock) {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        if (current) {
          current.content = buffer.join('\n').trim();
          sections.push(current);
        }
        current = {
          title: match[2],
          level: match[1].length,
          content: ''
        };
        buffer = [];
        continue;
      }
    }

    if (current) {
      buffer.push(line);
    }
  }

  // 处理最后一个
  if (current) {
    current.content = buffer.join('\n').trim();
    sections.push(current);
  }

  return sections;
}
