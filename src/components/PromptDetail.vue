<template>
  <article class="detail">
    <a href="#/" class="back">← 返回列表</a>
    <div class="head">
      <span class="cat">{{ CAT_ICON[p.cat] }} {{ p.cat }}</span>
      <button class="btn" @click="$emit('fav')">{{ fav ? '⭐ 已收藏' : '☆ 收藏' }}</button>
    </div>
    <h1>{{ p.title }}</h1>
    <div class="tags"><button v-for="t in p.tags" :key="t" class="tag" @click="$emit('tag', t)">#{{ t }}</button></div>
    <section><h2>适用场景</h2><p>{{ p.scene }}</p></section>
    <section v-if="p.vars.length">
      <h2>填写变量 <small>（选填，复制时自动替换）</small></h2>
      <div class="vars">
        <label v-for="v in p.vars" :key="v">
          <span>{{ v }}</span>
          <textarea v-model="values[v]" :rows="isLong(v) ? 4 : 1" :placeholder="`{{${v}}}`" />
        </label>
      </div>
    </section>
    <section>
      <div class="prompt-head">
        <h2>提示词</h2>
        <button class="btn primary" @click="doCopy">{{ copied ? '✅ 已复制' : '📋 一键复制' }}</button>
      </div>
      <pre class="prompt" v-html="highlighted" />
    </section>
    <section><h2>示例</h2><p class="example">{{ p.example }}</p></section>
  </article>
</template>
<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { CAT_ICON } from '../data/index.js'
import { copyText } from '../copy.js'
const props = defineProps({ p: { type: Object, required: true }, fav: Boolean })
defineEmits(['fav', 'tag'])
const values = reactive({})
watch(() => props.p.id, () => { for (const k of Object.keys(values)) delete values[k] }, { immediate: true })
const isLong = (v) => /代码|diff|报错|记录|内容|反馈|简历|JD|原文|方案|大纲|log|评论|全文|问答|表结构|指标|体积/.test(v)
const filled = computed(() => props.p.prompt.replace(/{{(.+?)}}/g, (m, k) => (values[k]?.trim() ? values[k] : m)))
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
const highlighted = computed(() => esc(filled.value).replace(/{{(.+?)}}/g, '<span class="var">{{$1}}</span>'))
const copied = ref(false)
async function doCopy() { if (await copyText(filled.value)) { copied.value = true; setTimeout(() => (copied.value = false), 1500) } }
</script>
<style scoped>
.detail { max-width: 820px; margin: 0 auto; padding: 24px 0; }
.back { display: inline-block; margin-bottom: 12px; }
.head { display: flex; justify-content: space-between; align-items: center; }
.cat { color: var(--muted); }
h1 { margin: 8px 0; font-size: clamp(22px, 4vw, 30px); }
h2 { font-size: 16px; margin: 24px 0 10px; }
h2 small { font-weight: normal; color: var(--muted); font-size: 13px; }
.tags { display: flex; gap: 6px; flex-wrap: wrap; }
.tags .tag { border: none; cursor: pointer; }
.vars { display: grid; gap: 12px; }
.vars label { display: grid; gap: 4px; font-size: 14px; }
.vars textarea { resize: vertical; }
.prompt-head { display: flex; justify-content: space-between; align-items: center; margin-top: 24px; }
.prompt-head h2 { margin: 0; }
.prompt-head + .prompt { margin-top: 10px; }
.example { background: var(--brand-soft); border-radius: 10px; padding: 12px 14px; margin: 0; }
</style>
