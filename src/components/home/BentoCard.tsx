import type { PropsWithChildren } from 'react';

type BentoCardProps = PropsWithChildren<{
	className?: string;
	href?: string;
	id?: string;
	title?: string;
}>;

const baseClass =
	'group relative overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-900/50 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:scale-[1.02] hover:border-white/20 hover:bg-zinc-900/70';

export function BentoCard({ children, className = '', href, id, title }: BentoCardProps) {
	const classes = `${baseClass} ${className}`;

	if (href) {
		return (
			<a className={`${classes} block no-underline`} href={href} id={id} aria-label={title}>
				{children}
			</a>
		);
	}

	return <section className={classes} id={id}>{children}</section>;
}

