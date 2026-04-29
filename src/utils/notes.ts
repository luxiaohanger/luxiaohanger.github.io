import type { CollectionEntry } from 'astro:content';

export type NoteTreeNode =
	| {
			type: 'dir';
			name: string;
			path: string;
			children: NoteTreeNode[];
	  }
	| {
			type: 'note';
			name: string;
			path: string;
			href: string;
	  };

/** 展示标题：优先用 frontmatter 的 title，否则用语种文件名（去掉 .md/.mdx） */
export function getNoteTitle(entry: CollectionEntry<'notes'>): string {
	const t = entry.data.title?.trim();
	if (t) return t;
	const id = stripExt(entry.id);
	return id.split('/').pop() ?? id;
}

/** 用于首页分组：取路径第一段目录名；顶层文件归为「其他」 */
export function getNoteCategory(entry: CollectionEntry<'notes'>): string {
	const id = stripExt(entry.id);
	const parts = id.split('/');
	if (parts.length <= 1) return '其他';
	return parts[0];
}

/** 站内链接，与 [...slug] 路由一致（使用未编码路径，由浏览器处理 UTF-8） */
export function getNoteHref(entry: CollectionEntry<'notes'>): string {
	const id = stripExt(entry.id);
	return `/notes/${id}/`;
}

/** 按 notebook 原始路径构建目录树，供笔记索引和单篇页侧边栏共用 */
export function buildNoteTree(entries: CollectionEntry<'notes'>[]): NoteTreeNode[] {
	const root: Extract<NoteTreeNode, { type: 'dir' }> = {
		type: 'dir',
		name: 'root',
		path: '',
		children: [],
	};

	for (const entry of entries) {
		const id = stripExt(entry.id);
		const parts = id.split('/');
		let current = root;

		for (const [index, part] of parts.entries()) {
			const isFile = index === parts.length - 1;
			const path = parts.slice(0, index + 1).join('/');

			if (isFile) {
				current.children.push({
					type: 'note',
					name: getNoteTitle(entry),
					path,
					href: getNoteHref(entry),
				});
				continue;
			}

			let next = current.children.find(
				(child): child is Extract<NoteTreeNode, { type: 'dir' }> =>
					child.type === 'dir' && child.path === path,
			);
			if (!next) {
				next = {
					type: 'dir',
					name: part,
					path,
					children: [],
				};
				current.children.push(next);
			}
			current = next;
		}
	}

	sortTree(root.children);
	return root.children;
}

export function countTreeNotes(nodes: NoteTreeNode[]): number {
	return nodes.reduce((sum, node) => {
		if (node.type === 'note') return sum + 1;
		return sum + countTreeNotes(node.children);
	}, 0);
}

export function getTopLevelDirs(nodes: NoteTreeNode[]) {
	return nodes.filter((node): node is Extract<NoteTreeNode, { type: 'dir' }> => node.type === 'dir');
}

export function getSubjectFromEntry(entry: CollectionEntry<'notes'>): string {
	const id = stripExt(entry.id);
	return id.split('/')[0] ?? '';
}

function sortTree(nodes: NoteTreeNode[]) {
	nodes.sort((a, b) => {
		if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
		return a.name.localeCompare(b.name, 'zh-CN');
	});
	for (const node of nodes) {
		if (node.type === 'dir') sortTree(node.children);
	}
}

function stripExt(p: string): string {
	return p.replace(/\.(md|mdx)$/i, '');
}
