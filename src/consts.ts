import { profile } from './data/profile';

/** 全站标题：默认取 profile.displayName，可在 src/data/profile.ts 填写 */
export const SITE_TITLE = profile.displayName.trim() || '我的个人主页';

/** 全站摘要：默认取 profile.headline */
export const SITE_DESCRIPTION = profile.headline.trim() || '个人主页与学习笔记';
