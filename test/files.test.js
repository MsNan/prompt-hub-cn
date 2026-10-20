import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'
import { PROMPTS } from '../src/data/index.js'
import { fileFor, fillVars, leftVars, parseFrontmatter } from '../src/files.js'
import { exportFiles, parseArgs } from '../scripts/export.js'

const byId = (id) => PROMPTS.find((p) => p.id === id)

test('Cursor rule 映射到 .cursor/rules/<slug>.mdc', () => {
  assert.deepEqual(fileFor(byId('rule-vue3')), { path: '.cursor/rules/vue3.mdc', filename: 'vue3.mdc' })
})

test('Claude skill 按 frontmatter 的 name 映射到 SKILL.md', () => {
  assert.deepEqual(fileFor(byId('skill-reviewer')), { path: '.claude/skills/code-review/SKILL.md', filename: 'SKILL.md' })
})

test('普通提示词不导出文件', () => {
  assert.equal(fileFor(byId('code-explain')), null)
})

test('12 条文件型提示词的导出路径互不重复', () => {
  const paths = PROMPTS.map(fileFor).filter(Boolean).map((f) => f.path)
  assert.equal(paths.length, 12)
  assert.equal(new Set(paths).size, 12)
})

test('parseFrontmatter 去掉引号，没有 frontmatter 时返回 null', () => {
  assert.equal(parseFrontmatter(byId('rule-vue3').prompt).globs, '**/*.vue')
  assert.equal(parseFrontmatter('hello'), null)
})

test('fillVars 只替换填了值的变量，leftVars 列出剩下的', () => {
  const out = fillVars('{{a}} 和 {{b}} 和 {{a}}', { a: 'X', b: '  ' })
  assert.equal(out, 'X 和 {{b}} 和 X')
  assert.deepEqual(leftVars(out), ['b'])
})

test('parseArgs 解析 --set / --only，并拒绝非法参数', () => {
  const o = parseArgs(['proj', '--only', 'skills', '--set', 'UI 库=Element Plus', '--set', 'k=a=b'])
  assert.equal(o.dir, 'proj')
  assert.equal(o.only, 'skills')
  assert.deepEqual(o.values, { 'UI 库': 'Element Plus', k: 'a=b' })
  assert.throws(() => parseArgs(['--only', 'x']), /rules 或 skills/)
  assert.throws(() => parseArgs(['--set', 'novalue']), /变量=值/)
  assert.throws(() => parseArgs(['--bad']), /未知选项/)
})

test('exportFiles 写入文件、替换变量、默认不覆盖已有文件', () => {
  const dir = mkdtempSync(join(tmpdir(), 'phc-'))
  try {
    mkdirSync(join(dir, '.cursor/rules'), { recursive: true })
    writeFileSync(join(dir, '.cursor/rules/api.mdc'), 'mine')
    const res = exportFiles({ dir, only: 'rules', values: { 'UI 库': 'Element Plus' } })
    assert.equal(res.length, 6)
    assert.equal(res.find((r) => r.path.endsWith('api.mdc')).status, 'skipped')
    assert.equal(readFileSync(join(dir, '.cursor/rules/api.mdc'), 'utf8'), 'mine')
    const vue = readFileSync(join(dir, '.cursor/rules/vue3.mdc'), 'utf8')
    assert.match(vue, /统一使用 Element Plus/)
    assert.ok(vue.startsWith('---\ndescription:'))
    assert.deepEqual(res.find((r) => r.path.endsWith('commit.mdc')).left, ['模块示例'])
    exportFiles({ dir, only: 'rules', force: true })
    assert.notEqual(readFileSync(join(dir, '.cursor/rules/api.mdc'), 'utf8'), 'mine')
  } finally { rmSync(dir, { recursive: true, force: true }) }
})

test('命令行可以直接运行', () => {
  const dir = mkdtempSync(join(tmpdir(), 'phc-cli-'))
  try {
    const out = execFileSync(process.execPath, ['scripts/export.js', dir, '--only', 'skills'], { encoding: 'utf8' })
    assert.match(out, /共写入 6 个文件/)
    assert.match(readFileSync(join(dir, '.claude/skills/release/SKILL.md'), 'utf8'), /^---\nname: release\n/)
  } finally { rmSync(dir, { recursive: true, force: true }) }
})
