import { BentoCard } from './BentoCard';

type Profile = {
	displayName: string;
	headline: string;
	bioParagraphs: string[];
	avatarUrl: string;
	email?: string;
	socialLinks: {
		github?: string;
		mastodon?: string;
		twitter?: string;
	};
};

type HomePageProps = {
	profile: Profile;
};

export default function HomePage({ profile }: HomePageProps) {
	const name = profile.displayName || '个人主页';
	const headline = profile.headline || '写作、学习与长期主义的个人空间。';
	const intro = profile.bioParagraphs.filter(Boolean);
	const github = profile.socialLinks.github;
	const email = profile.email?.trim();

	return (
		<div className="space-y-5">
			<section className="grid gap-5 lg:grid-cols-12">
				<BentoCard className="flex flex-col justify-between lg:col-span-7 lg:row-span-2">
					<div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
					<div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
					<div className="relative">
						<p className="mb-5 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] text-zinc-400">
							Personal Portal
						</p>
						<h1 className="max-w-3xl text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl lg:text-4xl">
							{name}
							<span className="mt-3 block bg-gradient-to-r from-violet-200 via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent">
								{headline}
							</span>
						</h1>
					</div>
					<div className="relative mt-10 grid gap-6 text-sm text-zinc-400">
						<div className="max-w-3xl rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-base leading-8 text-zinc-300 backdrop-blur">
							{intro.length ? (
								intro.map((p) => <p key={p}>{p}</p>)
							) : (
								<p>在这里记录学习、工程实践与阶段性的思考。个人简介可在 src/data/profile.ts 中补充。</p>
							)}
						</div>
					</div>
				</BentoCard>

				<BentoCard className="flex min-h-72 flex-col items-center justify-center gap-6 lg:col-span-5">
					<div>
						{profile.avatarUrl ? (
							<img
								className="h-44 w-44 rounded-[2rem] border border-white/10 object-cover shadow-2xl shadow-black/30"
								src={profile.avatarUrl}
								alt=""
							/>
						) : (
							<AbstractPortrait />
						)}
					</div>
					<div className="flex flex-wrap justify-center gap-3">
						{github ? (
							<a
								className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-medium text-zinc-100 no-underline transition hover:border-white/20 hover:bg-white/[0.1] hover:text-white"
								href={github}
								target="_blank"
								rel="noreferrer"
							>
								<svg className="h-4 w-4 shrink-0" viewBox="0 0 16 16" aria-hidden="true">
									<path
										fill="currentColor"
										d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
									/>
								</svg>
								{github}
							</a>
						) : null}
						{email ? (
							<span
								className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-medium text-zinc-100"
							>
								<svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
									<path
										fill="currentColor"
										d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 3.2V18h16V7.2l-7.38 5.54a1 1 0 0 1-1.2 0L4 7.2Zm14.67-1.2H5.33L12 11l6.67-5Z"
									/>
								</svg>
								{email}
							</span>
						) : null}
					</div>
				</BentoCard>

				<BentoCard className="flex flex-col justify-between lg:col-span-5" id="projects">
					<div>
						<p className="text-sm uppercase tracking-[0.24em] text-zinc-500">Projects</p>
						<h2 className="mt-3 text-xl font-semibold tracking-tight text-white">个人项目</h2>
						<p className="mt-5 text-sm leading-7 text-zinc-400">
							这里会逐步整理个人项目、实验性作品和阶段性实践。目前先保留入口，方便后续继续补充。
						</p>
					</div>
					<a
						className="mt-8 inline-flex w-fit items-center justify-center rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-medium text-zinc-100 no-underline transition hover:border-white/20 hover:bg-white/[0.1] hover:text-white"
						href="#projects"
					>
						项目规划
					</a>
				</BentoCard>
			</section>

			<section className="grid gap-5 lg:grid-cols-12">
				<BentoCard className="flex flex-col justify-between lg:col-span-7" id="stack">
					<div className="mb-6 flex items-end justify-between gap-6">
						<div>
							<p className="text-sm uppercase tracking-[0.24em] text-zinc-500">Stack</p>
							<h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">技术栈 / 技能</h2>
						</div>
					</div>
					<p className="mt-6 max-w-2xl text-sm leading-7 text-zinc-400">
						这里用于介绍我的工程能力、技术偏好和长期学习方向。具体技术标签后续可以按需要再补充到独立内容中。
					</p>
					<a
						className="mt-8 inline-flex w-fit items-center justify-center rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-medium text-zinc-100 no-underline transition hover:border-white/20 hover:bg-white/[0.1] hover:text-white"
						href="#stack"
					>
						查看技术介绍
					</a>
				</BentoCard>

				<BentoCard className="flex flex-col justify-between lg:col-span-5">
					<div className="mb-5 flex items-center justify-between gap-4">
						<div>
							<p className="text-sm uppercase tracking-[0.24em] text-zinc-500">Notes</p>
							<h2 className="mt-3 text-xl font-semibold tracking-tight text-white">笔记</h2>
						</div>
					</div>
					<p className="text-sm leading-7 text-zinc-400">
						按学科和原始目录层级整理学习记录，适合慢慢检索、回看和扩展。
					</p>
					<a
						className="mt-8 inline-flex w-fit items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-950 no-underline transition hover:scale-[1.02] hover:text-zinc-950"
						href="/notes/"
					>
						进入笔记
					</a>
				</BentoCard>
			</section>

		</div>
	);
}

function AbstractPortrait() {
	return (
		<div className="relative h-56 w-56 overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950">
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,rgba(168,85,247,0.42),transparent_35%),radial-gradient(circle_at_70%_72%,rgba(34,211,238,0.28),transparent_35%)]" />
			<div className="absolute inset-6 rounded-[1.5rem] border border-white/10 bg-white/[0.03] backdrop-blur" />
			<svg className="absolute inset-0 h-full w-full text-white/35" viewBox="0 0 220 220" fill="none" aria-hidden="true">
				<path d="M42 142C66 86 94 62 132 72C171 82 183 125 160 157C138 187 86 185 42 142Z" stroke="currentColor" strokeWidth="1.2" />
				<path d="M66 76C87 45 130 39 157 64C185 90 184 134 151 162" stroke="currentColor" strokeWidth="1.2" />
				<circle cx="110" cy="110" r="52" stroke="currentColor" strokeDasharray="4 8" strokeWidth="1" />
			</svg>
		</div>
	);
}

