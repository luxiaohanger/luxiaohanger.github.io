import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { getNoteHref, getNoteTitle, isRenderableNote } from '../utils/notes';

export async function GET(context) {
	const notes = (await getCollection('notes')).filter(isRenderableNote);
	const sorted = [...notes].sort((a, b) => getNoteTitle(a).localeCompare(getNoteTitle(b), 'zh-CN'));
	return rss({
		title: `${SITE_TITLE} — 笔记`,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: sorted.map((note) => ({
			title: getNoteTitle(note),
			description: note.data.description?.trim() || '',
			// 笔记文件无日期时，RSS 聚合器仍需要一个时间戳；可日后在 frontmatter 增加 pubDate
			pubDate: new Date(0),
			link: getNoteHref(note),
		})),
	});
}
