/**
 * 第一次尝试 - 用正则解析，失败了
 * 
 * 当时的想法：直接用正则匹配 /^#{1,6}\s+(.+)$/m
 * 问题：代码块里的#也会被匹配到
 * 
 * 比如：
 * ```bash
 * # 这是注释，不是标题
 * echo "hello"
 * ```
 * 
 * 教训：Markdown解析要考虑代码块
 */

export function parseWithRegex(content: string) {
  // 这是错误的实现，留作纪念
  const headerRegex = /^#{1,6}\s+(.+)$/gm;
  const matches = content.matchAll(headerRegex);
  return Array.from(matches);
}
