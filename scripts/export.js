#!/usr/bin/env node
// 把 Cursor rules / Claude skills 导出成文件，直接放进你的项目
// 用法：node scripts/export.js <项目目录> [--only rules|skills] [--set 变量=值]... [--force]
import { existsSync, mkdirSync, realpathSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { PROMPTS } from '../src/data/index.js'
import { fileFor, fillVars, leftVars } from '../src/files.js'

const HELP = `用法：node scripts/export.js <项目目录> [选项]
  --only rules|skills   只导出 Cursor rules 或 Claude skills
  --set 变量=值          替换 {{变量}}，可以写多次，例如 --set "UI 库=Element Plus"
  --force               覆盖已存在的文件（默认跳过）
  -h, --help            显示帮助`

export function parseArgs(argv) {
  const opts = { dir: '', only: '', values: {}, force: false, help: false }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '-h' || a === '--help') opts.help = true
    else if (a === '--force') opts.force = true
    else if (a === '--only') opts.only = argv[++i] ?? ''
    else if (a === '--set') {
      const kv = argv[++i] ?? '', eq = kv.indexOf('=')
      if (eq < 1) throw new Error(`--set 格式应为 变量=值，收到：${kv}`)
      opts.values[kv.slice(0, eq).trim()] = kv.slice(eq + 1)
    } else if (a.startsWith('-')) throw new Error(`未知选项：${a}`)
    else if (!opts.dir) opts.dir = a
    else throw new Error(`多余的参数：${a}`)
  }
  if (opts.only && !['rules', 'skills'].includes(opts.only)) throw new Error('--only 只能是 rules 或 skills')
  return opts
}

export function exportFiles({ dir, only = '', values = {}, force = false }, prompts = PROMPTS) {
  const want = { rules: 'Cursor rules', skills: 'Claude skills' }[only]
  const result = []
  for (const p of prompts) {
    if (want && p.cat !== want) continue
    const f = fileFor(p)
    if (!f) continue
    const target = join(dir, f.path)
    const content = fillVars(p.prompt, values)
    if (existsSync(target) && !force) { result.push({ path: f.path, status: 'skipped' }); continue }
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, content.endsWith('\n') ? content : content + '\n')
    result.push({ path: f.path, status: 'written', left: leftVars(content) })
  }
  return result
}

const isMain = () => { try { return import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href } catch { return false } }
if (process.argv[1] && isMain()) {
  try {
    const opts = parseArgs(process.argv.slice(2))
    if (opts.help || !opts.dir) { console.log(HELP); process.exit(opts.help ? 0 : 1) }
    const dir = resolve(opts.dir)
    const res = exportFiles({ ...opts, dir })
    for (const r of res) {
      if (r.status === 'skipped') console.log(`⏭  ${r.path}（已存在，加 --force 覆盖）`)
      else console.log(`✅ ${r.path}${r.left.length ? `  ← 还需要填写：${r.left.join('、')}` : ''}`)
    }
    console.log(`\n共写入 ${res.filter((r) => r.status === 'written').length} 个文件到 ${dir}`)
  } catch (e) { console.error('❌ ' + e.message); process.exit(1) }
}
