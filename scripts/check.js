// 校验提示词数据：id 唯一、分类合法、变量声明与 {{}} 占位一致
import { PROMPTS, CATS } from '../src/data/index.js'
import { fileFor, parseFrontmatter } from '../src/files.js'
let bad = 0
const ids = new Set(), paths = new Set()
for (const p of PROMPTS) {
  const err = []
  if (!/^[a-z0-9-]+$/.test(p.id)) err.push('id 只能用小写字母、数字、-')
  if (ids.has(p.id)) err.push('id 重复'); ids.add(p.id)
  if (!CATS.includes(p.cat)) err.push('未知分类 ' + p.cat)
  for (const k of ['title', 'scene', 'prompt', 'example']) if (!p[k]) err.push('缺少 ' + k)
  const used = [...new Set([...p.prompt.matchAll(/{{(.+?)}}/g)].map((m) => m[1]))]
  const miss = p.vars.filter((v) => !used.includes(v)), extra = used.filter((u) => !p.vars.includes(u))
  if (miss.length) err.push('vars 未在 prompt 中使用：' + miss)
  if (extra.length) err.push('prompt 中的变量未声明：' + extra)
  if (p.cat === 'Cursor rules' || p.cat === 'Claude skills') {
    const fm = parseFrontmatter(p.prompt || '')
    if (!fm) err.push('缺少开头的 --- frontmatter ---')
    else {
      if (!fm.description) err.push('frontmatter 缺少 description')
      if (p.cat === 'Claude skills' && !/^[a-z0-9-]+$/.test(fm.name || '')) err.push('skill 的 name 必须是小写字母、数字、-')
      if (p.cat === 'Cursor rules' && !fm.globs && fm.alwaysApply !== 'true') err.push('rule 需要 globs，或者 alwaysApply: true')
    }
    if (p.cat === 'Cursor rules' && !p.id.startsWith('rule-')) err.push('Cursor rules 的 id 需以 rule- 开头（决定导出的文件名）')
    const f = fileFor(p)
    if (f) { if (paths.has(f.path)) err.push('导出路径重复 ' + f.path); paths.add(f.path) }
  }
  if (err.length) { bad++; console.error(`❌ ${p.id}: ${err.join('；')}`) }
}
console.log(bad ? `${bad} 条有问题` : `✅ ${PROMPTS.length} 条提示词校验通过`)
process.exit(bad ? 1 : 0)
