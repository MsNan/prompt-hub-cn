<template>
  <header class="top">
    <div class="wrap bar">
      <a href="#/" class="logo">🧰 提示词百宝箱</a>
      <nav class="nav">
        <a href="#/" :class="{ on: route.name === 'home' }">提示词</a>
        <a href="#/contribute" :class="{ on: route.name === 'contribute' }">贡献</a>
        <a href="#/donate" :class="{ on: route.name === 'donate' }">☕ 打赏</a>
        <a href="https://github.com/MsNan/prompt-hub-cn" target="_blank" rel="noopener" aria-label="GitHub">GitHub</a>
        <button class="icon-btn" :aria-label="dark ? '切换到浅色模式' : '切换到深色模式'" @click="toggleDark">{{ dark ? '🌞' : '🌙' }}</button>
      </nav>
    </div>
  </header>

  <main class="wrap">
    <template v-if="route.name === 'home'">
      <section class="hero">
        <h1>中文提示词 & AI Agent 模板</h1>
        <p>{{ PROMPTS.length }} 条原创模板，覆盖 {{ CATS.length }} 个场景。填好变量，一键复制给 ChatGPT、Claude、Cursor、Trae 等工具使用。</p>
        <input v-model.trim="q" class="search" type="search" placeholder="搜索标题、场景、标签或提示词内容…" aria-label="搜索提示词" />
      </section>
      <div class="chips" role="tablist" aria-label="分类">
        <button class="chip" :class="{ on: cat === '' && !favOnly }" @click="setCat('')">全部 {{ PROMPTS.length }}</button>
        <button class="chip" :class="{ on: favOnly }" @click="favOnly = !favOnly; cat = ''">⭐ 收藏 {{ favs.size }}</button>
        <button v-for="c in CATS" :key="c" class="chip" :class="{ on: cat === c }" @click="setCat(c)">{{ CAT_ICON[c] }} {{ c }} {{ counts[c] }}</button>
      </div>
      <div v-if="tag" class="active-tag">标签：<span class="tag">#{{ tag }}</span> <button class="link" @click="tag = ''">清除</button></div>
      <p class="result-count">共 {{ list.length }} 条</p>
      <div class="grid">
        <article v-for="p in list" :key="p.id" class="card" @click="open(p.id)">
          <div class="card-head">
            <span class="cat">{{ CAT_ICON[p.cat] }} {{ p.cat }}</span>
            <button class="star" :aria-label="favs.has(p.id) ? '取消收藏' : '收藏'" @click.stop="toggleFav(p.id)">{{ favs.has(p.id) ? '⭐' : '☆' }}</button>
          </div>
          <h3>{{ p.title }}</h3>
          <p class="scene">{{ p.scene }}</p>
          <div class="tags"><button v-for="t in p.tags" :key="t" class="tag" @click.stop="tag = t">#{{ t }}</button></div>
          <div class="card-actions">
            <button class="btn" @click.stop="copy(p.prompt, p.id)">{{ copied === p.id ? '✅ 已复制' : '📋 复制' }}</button>
            <span class="muted">{{ p.vars.length ? p.vars.length + ' 个变量' : '无变量' }}</span>
          </div>
        </article>
      </div>
      <div v-if="!list.length" class="empty">没有找到相关的提示词，换个关键词试试，或者 <a href="#/contribute">来贡献一条</a>。</div>
    </template>

    <PromptDetail v-else-if="route.name === 'detail' && current" :p="current" :fav="favs.has(current.id)" @fav="toggleFav(current.id)" @tag="(t) => { tag = t; go('#/') }" />
    <Contribute v-else-if="route.name === 'contribute'" />
    <Donate v-else-if="route.name === 'donate'" />
    <div v-else class="empty">页面不存在，<a href="#/">返回首页</a></div>
  </main>

  <footer class="foot wrap">
    <p>相关项目：
      <a href="https://github.com/MsNan/vue-uniapp-skills" target="_blank" rel="noopener">vue-uniapp-skills</a> ·
      <a href="https://github.com/MsNan/cn-dev-mcp" target="_blank" rel="noopener">cn-dev-mcp</a> ·
      <a href="https://github.com/MsNan/bishe-kit" target="_blank" rel="noopener">bishe-kit</a> ·
      <a href="https://msnan.github.io" target="_blank" rel="noopener">涛哥的技术博客</a>
    </p>
    <p class="muted">内容原创，MIT 协议 · 由 Theo（涛哥）维护 · 收藏只保存在你的浏览器本地</p>
  </footer>
</template>
<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { PROMPTS, CATS, CAT_ICON } from './data/index.js'
import { copyText } from './copy.js'
import PromptDetail from './components/PromptDetail.vue'
import Contribute from './components/Contribute.vue'
import Donate from './components/Donate.vue'

const route = reactive({ name: 'home', id: '' })
function parse() {
  const h = location.hash.replace(/^#/, '') || '/'
  const m = h.match(/^\/p\/([\w-]+)/)
  if (m) Object.assign(route, { name: 'detail', id: m[1] })
  else Object.assign(route, { name: h === '/' || h.startsWith('/?') ? 'home' : h.slice(1), id: '' })
  window.scrollTo(0, 0)
}
const go = (h) => { location.hash = h }
onMounted(() => { parse(); window.addEventListener('hashchange', parse) })
const current = computed(() => PROMPTS.find((p) => p.id === route.id))
watch(() => [route.name, current.value], () => {
  document.title = route.name === 'detail' && current.value ? `${current.value.title} · 提示词百宝箱` : '提示词百宝箱 · 中文 Prompt 与 Agent 模板'
})

const q = ref(''), cat = ref(''), tag = ref(''), favOnly = ref(false)
const setCat = (c) => { cat.value = c; favOnly.value = false }
const favs = ref(new Set(JSON.parse(localStorage.getItem('ph-favs') || '[]')))
function toggleFav(id) { const s = new Set(favs.value); s.has(id) ? s.delete(id) : s.add(id); favs.value = s; localStorage.setItem('ph-favs', JSON.stringify([...s])) }
const counts = computed(() => Object.fromEntries(CATS.map((c) => [c, PROMPTS.filter((p) => p.cat === c).length])))
const list = computed(() => {
  const words = q.value.toLowerCase().split(/\s+/).filter(Boolean)
  return PROMPTS.filter((p) => (!cat.value || p.cat === cat.value) && (!favOnly.value || favs.value.has(p.id)) && (!tag.value || p.tags.includes(tag.value)) &&
    words.every((w) => [p.title, p.scene, p.cat, p.prompt, ...p.tags].join(' ').toLowerCase().includes(w)))
})
const open = (id) => go(`#/p/${id}`)
const copied = ref('')
async function copy(text, id) { if (await copyText(text)) { copied.value = id; setTimeout(() => copied.value === id && (copied.value = ''), 1500) } }

const dark = ref(document.documentElement.classList.contains('dark'))
function toggleDark() { dark.value = !dark.value; document.documentElement.classList.toggle('dark', dark.value); localStorage.setItem('ph-theme', dark.value ? 'dark' : 'light') }
</script>
<style scoped>
.wrap { max-width: 1180px; margin: 0 auto; padding: 0 16px; }
.top { position: sticky; top: 0; z-index: 10; background: color-mix(in srgb, var(--bg) 85%, transparent); backdrop-filter: blur(8px); border-bottom: 1px solid var(--border); }
.bar { display: flex; align-items: center; justify-content: space-between; height: 56px; gap: 12px; }
.logo { font-weight: 700; font-size: 18px; color: var(--text); white-space: nowrap; }
.nav { display: flex; align-items: center; gap: 4px; }
.nav a { color: var(--muted); padding: 8px 10px; border-radius: 8px; }
.nav a.on, .nav a:hover { color: var(--brand); }
.icon-btn { border: none; background: none; font-size: 18px; padding: 8px; min-width: 40px; min-height: 40px; }
.hero { text-align: center; padding: 40px 0 20px; }
.hero h1 { font-size: clamp(24px, 5vw, 38px); margin: 0 0 8px; }
.hero p { color: var(--muted); margin: 0 auto 20px; max-width: 640px; }
.search { max-width: 640px; height: 48px; font-size: 16px; border-radius: 14px; box-shadow: var(--shadow); }
.chips { display: flex; gap: 8px; overflow-x: auto; padding: 8px 0 4px; scrollbar-width: none; }
.chips::-webkit-scrollbar { display: none; }
.active-tag { margin-top: 8px; }
.link { border: none; background: none; color: var(--brand); }
.result-count { color: var(--muted); font-size: 13px; margin: 10px 0; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px; }
.card { background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 16px; cursor: pointer; display: flex; flex-direction: column; gap: 8px; box-shadow: var(--shadow); transition: transform .15s, border-color .15s; }
.card:hover { border-color: var(--brand); transform: translateY(-2px); }
.card-head { display: flex; justify-content: space-between; align-items: center; }
.cat { font-size: 13px; color: var(--muted); }
.star { border: none; background: none; font-size: 20px; min-width: 40px; min-height: 40px; color: #f59e0b; }
.card h3 { margin: 0; font-size: 17px; }
.scene { margin: 0; color: var(--muted); font-size: 14px; flex: 1; }
.tags { display: flex; flex-wrap: wrap; gap: 6px; }
.tags .tag { border: none; cursor: pointer; }
.card-actions { display: flex; justify-content: space-between; align-items: center; margin-top: 4px; }
.muted { color: var(--muted); font-size: 13px; }
.empty { text-align: center; color: var(--muted); padding: 60px 0; }
.foot { padding: 40px 16px; text-align: center; font-size: 14px; border-top: 1px solid var(--border); margin-top: 40px; }
@media (max-width: 640px) {
  .grid { grid-template-columns: 1fr; }
  .logo { font-size: 16px; }
  .nav a { padding: 8px 6px; font-size: 14px; }
  .nav a[aria-label="GitHub"] { display: none; }
  .hero { padding: 24px 0 12px; }
}
</style>
