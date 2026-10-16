<template>
  <article class="page">
    <h1>☕ 打赏支持</h1>
    <p>这个网站完全免费、开源，没有广告。如果这些提示词帮你省了时间，欢迎请我喝杯咖啡，也欢迎去 <a href="https://github.com/MsNan/prompt-hub-cn" target="_blank" rel="noopener">GitHub</a> 点个 ⭐ Star。</p>
    <div class="qrs">
      <figure><img :src="base + 'wechat.jpg'" alt="微信赞赏码" loading="lazy" /><figcaption>微信</figcaption></figure>
      <figure><img :src="base + 'alipay.jpg'" alt="支付宝收款码" loading="lazy" /><figcaption>支付宝</figcaption></figure>
    </div>
    <p class="muted">也可以关注公众号「程序员项目库」，或者访问 <a href="https://msnan.github.io" target="_blank" rel="noopener">涛哥的技术博客</a>。</p>
  </article>
</template>
<script setup>
const base = import.meta.env.BASE_URL
</script>
<style scoped>
.page { max-width: 820px; margin: 0 auto; padding: 24px 0; text-align: center; }
.qrs { display: flex; justify-content: center; gap: 24px; flex-wrap: wrap; margin: 24px 0; }
figure { margin: 0; }
img { width: 220px; max-width: 70vw; border-radius: 12px; border: 1px solid var(--border); }
figcaption { color: var(--muted); margin-top: 6px; }
.muted { color: var(--muted); }
</style>
