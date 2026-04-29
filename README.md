# 个人静态主页（Astro）

基于 Astro 的静态站点，部署在 GitHub Pages。

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

站点绝对地址（RSS、sitemap、canonical）在 [`astro.config.mjs`](astro.config.mjs) 的 `site` 字段；若日后改名，请同步修改该字段。

## 个人主页与笔记

- 首页文案、头像、外链：编辑 [`src/data/profile.ts`](src/data/profile.ts)（文件内有中文说明）。
- 笔记源文件：仓库根目录 [`notebook/`](notebook/) 下任意层级的 `.md` / `.mdx`；构建后访问 **`/notes/`** 按**子文件夹**分组浏览。

## 技术说明

- Markdown / MDX（笔记）、RSS、sitemap、SEO 由 Astro 与集成提供；RSS 条目对应笔记列表。
- CI 使用 Node 22，与 [`package.json`](package.json) 中 `engines.node` 一致。
