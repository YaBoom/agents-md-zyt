# AGENTS.md

## 项目概述

这是一个AGENTS.md解析器的实验项目，用于演示AGENTS.md的用法。

## 安装依赖

```bash
pnpm install
```

## 开发命令

- 启动开发: `pnpm dev`
- 运行测试: `pnpm test`
- 构建: `pnpm build`
- 代码检查: `pnpm lint`

## 代码风格

- TypeScript严格模式
- 单引号，不使用分号
- 优先使用函数式编程模式
- 注释要用中文（这个项目是中文的）

## 测试要求

- 提交前必须跑测试
- 新功能要有对应的测试
- 覆盖率不低于80%（理想情况，现在还做不到）

## 安全注意事项

- 不要把API key提交到仓库
- 用环境变量管理敏感信息
- 用户输入要验证

## 项目结构

```
├── src/          # 源代码
├── tests/        # 测试文件
├── experiments/  # 实验/试错代码
└── examples/     # 示例AGENTS.md
```
