import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// 仓库根目录的 notebook/：笔记多为无 frontmatter 的纯 Markdown，title/description 可选
const notes = defineCollection({
	loader: glob({ base: './notebook', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string().optional(),
		description: z.string().optional(),
	}),
});

export const collections = { notes };
