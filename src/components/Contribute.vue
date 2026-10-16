<template>
  <article class="page">
    <h1>🤝 贡献一条提示词</h1>
    <p>欢迎你分享自己常用、而且真正好用的提示词。所有内容都必须是<strong>原创</strong>，或者你有权按 MIT 协议分享的内容；请不要搬运付费课程、书籍或其他合集里的内容。</p>
    <h2>方式一：提交 Issue（最简单）</h2>
    <p>打开 <a href="https://github.com/MsNan/prompt-hub-cn/issues/new" target="_blank" rel="noopener">新建 Issue</a>，按下面的格式填写，维护者会帮你整理收录。</p>
    <h2>方式二：提交 PR</h2>
    <ol>
      <li>Fork 仓库，在 <code>src/data/p1.js</code> ~ <code>p3.js</code> 中按分类添加一条</li>
      <li>运行 <code>npm run check</code> 校验格式</li>
      <li>运行 <code>npm run dev</code> 本地预览，确认没问题后提交 PR</li>
    </ol>
    <h2>数据格式</h2>
    <pre class="prompt">{{ sample }}</pre>
    <h2>质量要求</h2>
    <ul>
      <li>写清楚使用场景：在什么情况下用、能解决什么问题</li>
      <li>需要用户替换的内容用 <code v-pre>{{变量名}}</code> 标注，并写进 <code>vars</code></li>
      <li>给出明确的输出格式要求，让 AI「不确定时先问」，而不是瞎编</li>
      <li>不写违法、侵权、绕过平台规则（刷量、爬取、反检测）的提示词</li>
    </ul>
  </article>
</template>
<script setup>
const sample = `{ id: 'code-explain',            // 小写字母、数字、-，全站唯一
  cat: '编程',                      // 已有的分类之一
  title: '逐段讲解陌生代码',
  tags: ['阅读源码', '入门'],
  scene: '接手老项目或读开源源码，看不懂一段代码时。',
  prompt: \`请讲解下面这段 {{语言}} 代码：……\`,
  vars: ['语言'],                   // 与 prompt 中的 {{}} 一一对应
  example: '语言=TypeScript' }`
</script>
<style scoped>
.page { max-width: 820px; margin: 0 auto; padding: 24px 0; }
h2 { font-size: 18px; margin-top: 28px; }
code { background: var(--code); padding: 1px 6px; border-radius: 4px; }
li { margin: 6px 0; }
</style>
