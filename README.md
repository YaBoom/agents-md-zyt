# agents-md-zyt

> ⚠️ **实验性项目** - 这只是我学习AGENTS.md标准时的探索代码，不保证生产可用

[![GitHub](https://img.shields.io/badge/GitHub-YaBoom%2Fagents--md--zyt-blue)](https://github.com/YaBoom/agents-md-zyt)

一个简单的AGENTS.md解析器和验证工具，支持解析、验证和查找AGENTS.md文件。

## 什么是AGENTS.md?

AGENTS.md是一个开放标准，用于给AI编码工具提供项目上下文。它解决了这个问题：

> "每个AI工具都有自己的配置文件：.cursorrules、CLAUDE.md、.github/copilot-instructions.md..."

AGENTS.md提供一个统一的格式，被Cursor、Windsurf、GitHub Copilot、Zed、Pulumi Neo等工具支持。

参考: [agents.md](https://agents.md/)

## 快速开始

```bash
# 克隆项目
git clone https://github.com/YaBoom/agents-md-zyt.git
cd agents-md-zyt

# 安装依赖
npm install

# 编译
npm run build

# 运行
npm run dev

# 测试
npm test
```

## 功能

- ✅ 解析AGENTS.md文件，提取sections
- ✅ 查找最近的AGENTS.md（支持嵌套）
- ✅ 验证是否符合常见约定
- ⚠️ 实验性功能：YAML frontmatter解析（SKILL.md格式）

## 使用示例

```typescript
import { parseAgentsMd, findNearestAgentsMd, validateAgentsMd } from './src/index.js';

// 解析文件
const parsed = parseAgentsMd('./AGENTS.md');
console.log(parsed.sections);

// 查找最近的AGENTS.md
const file = findNearestAgentsMd('./src/components');

// 验证
const result = validateAgentsMd(parsed);
```

## CLI用法

```bash
# 解析当前目录的AGENTS.md
node dist/index.js

# 解析指定目录
node dist/index.js ./my-project
```

## 实验记录

### 尝试1: 用正则表达式解析
- ❌ 失败了，因为代码块里的#会被误认为是标题
- 教训：Markdown解析比想象中复杂

### 尝试2: 逐行解析
- ✅ 基本能用，但不够健壮
- 以后会考虑用marked或者markdown-it

### 尝试3: 支持嵌套AGENTS.md
- 🚧 进行中，需要实现真正的向上递归查找

## TODO

- [ ] 支持YAML frontmatter（SKILL.md格式）
- [ ] 完整的嵌套AGENTS.md优先级处理
- [ ] 更多的验证规则
- [ ] 实际集成测试（用真实项目的AGENTS.md）

## 已知问题

1. 解析器比较简单，可能处理不了复杂的Markdown
2. findNearestAgentsMd还没实现真正的递归
3. 错误处理比较粗糙
4. 没有处理SKILL.md的YAML frontmatter

## 相关文章

- [AGENTS.md：我试图统一AI编码工具的配置，然后...](https://github.com/YaBoom/agents-md-zyt/blob/master/ARTICLE.md)

## 参考

- [AGENTS.md 官方规范](https://agents.md/)
- [Pulumi Neo AGENTS.md支持](https://www.pulumi.com/blog/pulumi-neo-now-supports-agentsmd/)
- [Agent Skills标准](https://agentskills.io/)

## License

MIT
