# 凌霄花的个人主页

这是一个基于 Astro 的个人静态站点，用于展示个人简介、学习笔记和 GitHub 仓库链接。站点部署在 GitHub Pages：`https://luxiaohanger.github.io`。

## 技术栈

- Astro：静态站点生成、路由和内容集合。
- React：主页 Bento 卡片等交互组件。
- Tailwind CSS：页面样式与响应式布局。
- Markdown / MDX：`notebook/` 笔记内容。
- KaTeX：Markdown 中 LaTeX 公式渲染。
- GitHub Actions：自动构建并部署到 GitHub Pages。

## 目录结构

```text
.
├── .github/workflows/deploy.yml  # GitHub Pages 自动部署流程
├── notebook/                     # 学习笔记源文件，按文件夹组织学科和主题
├── public/                       # 静态资源，构建后原样复制到站点根路径
│   └── avatar.png                # 首页头像和浏览器标签页图标
├── src/
│   ├── components/               # Header、Footer、主题切换、笔记树、主页组件
│   ├── components/home/          # 首页 Bento 卡片和主页主体
│   ├── data/profile.ts           # 个人资料、简介、邮箱、社交链接和 GitHub 仓库链接
│   ├── layouts/                  # 通用页面布局和笔记正文布局
│   ├── pages/                    # Astro 页面路由
│   │   ├── index.astro           # 首页
│   │   └── notes/                # 笔记首页、学科页、单篇笔记页
│   ├── styles/global.css         # 全局样式、亮暗色主题、Markdown 正文样式
│   └── utils/                    # 笔记目录树、标题、路径等工具函数
├── astro.config.mjs              # Astro、React、Tailwind、KaTeX、站点地址配置
├── package.json                  # npm 脚本和依赖
└── README.md
```

## 页面架构

首页由 `src/pages/index.astro` 读取 `src/data/profile.ts`，再交给 `src/components/home/HomePage.tsx` 渲染。主页包含简介、头像联系方式、技术入口、笔记入口和 GitHub 仓库卡片。

笔记系统由 Astro Content Collection 读取 `notebook/**/*.{md,mdx}`。`src/utils/notes.ts` 会根据文件路径生成目录树：

- `/notes/`：展示一级文件夹，也就是学科卡片。
- `/notes/[subject]/`：展示某个学科下的原始目录层级。
- `/notes/[...slug]/`：渲染单篇笔记，侧边栏只显示当前学科目录树。

`notebook/README.md` 作为笔记目录说明文件保留，不会生成站点笔记页面，也不会进入 RSS。

## 内容维护

修改个人信息：

```text
src/data/profile.ts
```

主页 GitHub 仓库卡片也在 `src/data/profile.ts` 中维护：

```ts
repositoryLinks: [
	{
		name: 'mini_web_server',
		description: '基于 epoll 的高性能 Web Server',
		href: 'https://github.com/luxiaohanger/mini_web_server',
	},
];
```

继续添加仓库时，在 `repositoryLinks` 数组中追加 `{ name, description, href }` 即可。

添加或修改笔记：

```text
notebook/<学科>/<主题>.md
```

笔记标题优先使用 Markdown frontmatter 的 `title` 字段；如果没有，则使用文件名。公式推荐使用标准 Markdown 数学写法：

```md
行内公式：$E = mc^2$

块级公式：
$$
E = mc^2
$$
```

## 本地开发

安装依赖：

```sh
npm install
```

如果本机 `~/.npm` 缓存权限异常，可以使用项目内缓存：

```sh
npm install --cache ./.npm-cache
```

启动本地开发服务：

```sh
npm run dev -- --host 127.0.0.1
```

访问：

```text
http://127.0.0.1:4321/
```

构建和预览：

```sh
npm run build
npm run preview
```

构建产物输出到 `dist/`。

## 部署

仓库名为 `luxiaohanger.github.io`，对应 GitHub Pages 用户站点根路径。部署流程在 `.github/workflows/deploy.yml` 中：

1. push 到 `main`。
2. GitHub Actions 使用 Node 22 执行 `npm ci`。
3. 执行 `npm run build` 生成 `dist/`。
4. 上传并部署到 GitHub Pages。

如果更换 GitHub 用户名或域名，需要同步修改 `astro.config.mjs` 中的 `site` 字段。

## Git 忽略规则

`.gitignore` 已忽略构建产物、依赖、本地 npm 缓存、环境变量、系统文件以及 IDE 配置：

- `dist/`
- `.astro/`
- `node_modules/`
- `.npm-cache/`
- `notebook` 内各类构建产物与临时文件
- `.env*`
- `.DS_Store`
- `.vscode/`
- `.idea/`
