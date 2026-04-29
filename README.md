# 个人静态博客（Astro）

基于 [Astro 官方 Blog 模板](https://github.com/withastro/astro/tree/main/examples/blog)，静态输出，可部署到 GitHub Pages。

## 本地开发

在项目根目录执行：

```sh
npm install
npm run dev
```

浏览器访问 `http://localhost:4321`。

若本机 `~/.npm` 缓存目录权限异常，可改用项目内缓存：

```sh
npm install --cache ./.npm-cache
```

## 构建

```sh
npm run build
npm run preview
```

产物目录为 `dist/`。

## 部署到 GitHub Pages

1. 在 GitHub 上使用仓库名 **`luxiaohanger.github.io`**（用户/组织站点根路径为 `/`）。
2. 打开仓库 **Settings → Pages**，**Build and deployment** 里将 **Source** 选为 **GitHub Actions**（不要选「Deploy from a branch」）。
3. 将代码推送到 **`main`** 分支，在 **Actions** 中确认工作流成功；随后访问 `https://luxiaohanger.github.io`。

站点绝对地址（RSS、sitemap、canonical）在 [`astro.config.mjs`](astro.config.mjs) 的 `site` 字段，当前为 `https://luxiaohanger.github.io`；若日后改名，请同步修改该字段。

文章默认放在 [`src/content/blog/`](src/content/blog/)，详见 [Content Collections](https://docs.astro.build/en/guides/content-collections/)。

## 技术说明

- Markdown / MDX、RSS、sitemap、SEO 相关能力由模板与集成提供。
- CI 使用 Node 22，与 [`package.json`](package.json) 中 `engines.node` 一致。
