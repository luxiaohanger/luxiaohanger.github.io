// @ts-check

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import remarkLatexDelimiters from './src/utils/remark-latex-delimiters.mjs';

const rehypeKatexOptions = {
	strict: 'ignore',
	throwOnError: false,
};

function normalizeLatexDelimitersPlugin() {
	return {
		name: 'normalize-latex-delimiters',
		enforce: 'pre',
		transform(code, id) {
			if (!/\/notebook\/.*\.mdx?$/.test(id)) return null;

			const normalized = code
				.replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, (_match, math) => `\n$$\n${math.trim()}\n$$\n`)
				.replace(/\\\(([\s\S]*?)\\\)/g, (_match, math) => `$${math.trim()}$`);

			return normalized === code ? null : { code: normalized, map: null };
		},
	};
}

// https://astro.build/config
export default defineConfig({
	// 与 GitHub 用户名一致：仓库名为「用户名.github.io」时通常为 https://用户名.github.io
	site: 'https://luxiaohanger.github.io',
	markdown: {
		remarkPlugins: [remarkMath, remarkLatexDelimiters],
		rehypePlugins: [[rehypeKatex, rehypeKatexOptions]],
	},
	integrations: [
		mdx({
			remarkPlugins: [remarkMath, remarkLatexDelimiters],
			rehypePlugins: [[rehypeKatex, rehypeKatexOptions]],
		}),
		sitemap(),
		react(),
	],
	vite: {
		plugins: [normalizeLatexDelimitersPlugin(), tailwindcss()],
	},
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
