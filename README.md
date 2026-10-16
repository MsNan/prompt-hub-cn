<div align="center">

# 🧰 提示词百宝箱 · prompt-hub-cn

**66 条原创中文提示词与 AI Agent 模板：填好变量，一键复制**

[在线使用](https://msnan.github.io/prompt-hub-cn/) · [贡献一条](CONTRIBUTING.md)

![license](https://img.shields.io/badge/license-MIT-green) ![prompts](https://img.shields.io/badge/prompts-66-blue) ![categories](https://img.shields.io/badge/categories-11-orange)

</div>

![](docs/screenshot-desktop.png)

## 特点

- **全部原创**：每条都包含适用场景、提示词、变量和示例，可以直接拿来用
- **填变量**：详情页里填好变量，复制出来就是可以直接发给 AI 的完整提示词
- **搜索、分类、标签**：支持多关键词搜索，覆盖标题、场景、标签和提示词正文
- **收藏**：收藏只保存在你的浏览器本地（localStorage），不需要登录
- **深色模式**、适配手机，纯静态网站，部署在 GitHub Pages

## 分类

| 分类 | 数量 | 示例 |
| --- | --- | --- |
| 💻 编程 | 6 | 根据报错定位 Bug、自然语言转 SQL、补单元测试 |
| 🎨 前端 | 6 | Vue3 组件 API 设计、首屏性能诊断、uni-app 跨端检查 |
| 🔍 代码审查 | 6 | PR 分级审查、安全漏洞排查、老代码风险评估 |
| 📝 文档 | 6 | README、接口文档、技术方案、周报 |
| 🧭 产品 | 6 | 一句话需求扩写 PRD、MVP 裁剪、指标体系 |
| 📣 运营文案 | 6 | 技术文章标题、小红书笔记、开源发布文案 |
| 📚 学习 | 6 | 学习路线、费曼自测、读论文 |
| 💼 求职 | 6 | STAR 简历、模拟面试、薪资谈判 |
| 🤖 AI Agent 工作流 | 6 | 先规划再执行、TDD Agent、安全护栏、会话交接 |
| 📐 Cursor rules | 6 | Vue3 / Node 接口 / 提交信息 / uni-app 规则（.mdc） |
| 🧩 Claude skills | 6 | 代码审查、发版、Bug 排查、数据库迁移 SKILL.md |

## 手机端

<img src="docs/screenshot-mobile.png" width="300">

## 本地开发

```bash
git clone https://github.com/MsNan/prompt-hub-cn.git
cd prompt-hub-cn
npm install
npm run dev      # 本地预览
npm run check    # 校验数据格式
npm run build    # 构建静态站点
```

推送到 `main` 分支后，GitHub Actions 会自动部署到 GitHub Pages。

## 贡献

欢迎提交原创提示词，详见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 相关项目

- [vue-uniapp-skills](https://github.com/MsNan/vue-uniapp-skills)：Vue3 + uni-app 中文 AI 技能包，一行命令装进 Cursor、Claude Code、Trae
- [cn-dev-mcp](https://github.com/MsNan/cn-dev-mcp)：中国开发者离线 MCP 工具集
- [bishe-kit](https://github.com/MsNan/bishe-kit)：Vue3 + uni-app + Express 全栈毕设/接单脚手架
- [涛哥的技术博客](https://msnan.github.io)

## License

[MIT](LICENSE) © Theo（涛哥）

## ☕ 打赏支持

如果这些提示词帮你省了时间，欢迎请我喝杯咖啡，也欢迎点个 ⭐ Star。也可以在网站的[打赏页](https://msnan.github.io/prompt-hub-cn/#/donate)扫码。

<table>
  <tr>
    <td align="center"><img src="docs/wechat.jpg" width="220" alt="微信赞赏"><br>微信</td>
    <td align="center"><img src="docs/alipay.jpg" width="220" alt="支付宝"><br>支付宝</td>
  </tr>
</table>
