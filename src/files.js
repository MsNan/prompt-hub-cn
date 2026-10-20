// 把「Cursor rules」「Claude skills」两类提示词映射为可以直接放进项目的文件
// 纯函数，浏览器（详情页下载）和 Node（scripts/export.js、check.js）共用

// 解析开头的 --- frontmatter ---，只支持本项目用到的 key: value 单行写法
export function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/)
  if (!m) return null
  const data = {}
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([\w-]+):\s*(.*)$/)
    if (kv) data[kv[1]] = kv[2].replace(/^"(.*)"$/, '$1')
  }
  return data
}

// 返回 { path, filename } ；不是文件型提示词时返回 null
export function fileFor(p) {
  if (p.cat === 'Cursor rules') {
    const slug = p.id.replace(/^rule-/, '')
    return { path: `.cursor/rules/${slug}.mdc`, filename: `${slug}.mdc` }
  }
  if (p.cat === 'Claude skills') {
    const name = parseFrontmatter(p.prompt)?.name
    if (!name) return null
    return { path: `.claude/skills/${name}/SKILL.md`, filename: 'SKILL.md' }
  }
  return null
}

// 用 values 替换 {{变量}}，没填的保留原样
export function fillVars(text, values = {}) {
  return text.replace(/{{(.+?)}}/g, (m, k) => (values[k]?.trim() ? values[k] : m))
}

// 列出文本中仍未替换的变量
export function leftVars(text) {
  return [...new Set([...text.matchAll(/{{(.+?)}}/g)].map((m) => m[1]))]
}
