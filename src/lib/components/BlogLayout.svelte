<script lang="ts">
	import { page } from '$app/state';
	import V2Nav from './V2Nav.svelte';
	import V2Footer from './V2Footer.svelte';

	type LayoutProps = {
		title: string;
		date: string;
		description: string;
		tag?: string;
		author?: string;
		read?: string;
		words?: string;
		accentTail?: string;
		children: import('svelte').Snippet;
	};

	let {
		title,
		date,
		description,
		tag,
		author = 'MyP0 Team',
		read,
		words,
		accentTail,
		children
	}: LayoutProps = $props();

	const isoDate = $derived(new Date(date).toISOString());
	const site = 'https://myp0.com';
	const slug = $derived(page.params?.slug || '');
	const canonicalUrl = $derived(`${site}/blog/${slug}`);

	function fmtDate(d: string): string {
		return new Date(d).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function initials(name: string): string {
		return name
			.split(' ')
			.map((s) => s[0])
			.join('')
			.slice(0, 2)
			.toUpperCase();
	}

	// Split title into "head" and "tail" for the italic-rust accent.
	// If `accentTail` is set in frontmatter, use it; otherwise pull the
	// last word so the design's signature treatment still appears.
	const titleHead = $derived.by(() => {
		if (!accentTail) {
			const parts = title.trim().split(/\s+/);
			if (parts.length < 2) return '';
			return parts.slice(0, -1).join(' ') + ' ';
		}
		const idx = title.lastIndexOf(accentTail);
		if (idx === -1) return title + ' ';
		return title.slice(0, idx);
	});
	const titleTail = $derived(accentTail ?? title.trim().split(/\s+/).slice(-1)[0]);

	// Pull the related-post list at module scope so this layout doesn't
	// depend on the route-level loader.
	type PostMeta = {
		title: string;
		description: string;
		date: string;
		tag?: string;
		author?: string;
	};
	const allPosts = (() => {
		const modules = import.meta.glob('/src/content/blog/*.md', { eager: true });
		const out: Array<{ slug: string } & PostMeta> = [];
		for (const [path, mod] of Object.entries(modules)) {
			const s = path.split('/').pop()!.replace('.md', '');
			const m = (mod as { metadata: PostMeta }).metadata;
			out.push({ slug: s, ...m });
		}
		return out.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	})();
	const related = $derived(allPosts.filter((p) => p.slug !== slug).slice(0, 3));

	// Wire the reading-progress bar and TOC active-state to scroll.
	let progress = $state(0);
	let toc = $state<Array<{ id: string; label: string }>>([]);
	let activeIdx = $state(0);
	let articleEl: HTMLElement | null = $state(null);

	$effect(() => {
		if (!articleEl) return;
		const headings = Array.from(articleEl.querySelectorAll('h2')) as HTMLElement[];
		toc = headings.map((h, i) => {
			if (!h.id) h.id = `s${i + 1}`;
			return { id: h.id, label: h.textContent?.trim() ?? '' };
		});

		const onScroll = () => {
			const max = document.documentElement.scrollHeight - window.innerHeight;
			progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
			let nearest = 0;
			for (let i = 0; i < headings.length; i++) {
				if (headings[i].getBoundingClientRect().top - 80 < 0) nearest = i;
				else break;
			}
			activeIdx = nearest;
		};
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});
</script>

<svelte:head>
	<title>{title} — myP0 Blog</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonicalUrl} />

	<meta property="og:type" content="article" />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:site_name" content="myP0" />
	<meta property="og:image" content="{site}/og-image.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="article:published_time" content={isoDate} />
	<meta property="article:author" content={site} />
	{#if tag}
		<meta property="article:tag" content={tag} />
		<meta property="article:section" content={tag} />
	{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content="{site}/og-image.png" />

	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'BlogPosting',
				headline: title,
				description,
				datePublished: isoDate,
				dateModified: isoDate,
				url: canonicalUrl,
				author: { '@type': 'Organization', name: 'myP0', url: site },
				publisher: { '@type': 'Organization', name: 'myP0', url: site },
				mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
				isPartOf: { '@type': 'Blog', '@id': `${site}/blog`, name: 'The myP0 blog' },
				...(tag ? { keywords: tag, articleSection: tag } : {})
			},
			{
				'@type': 'BreadcrumbList',
				itemListElement: [
					{ '@type': 'ListItem', position: 1, name: 'Home', item: site },
					{ '@type': 'ListItem', position: 2, name: 'Blog', item: `${site}/blog` },
					{ '@type': 'ListItem', position: 3, name: title }
				]
			}
		]
	})}</script>`}
</svelte:head>

<div class="min-h-screen bg-bg text-ink">
	<V2Nav active="Blog" />

	<!-- Post header -->
	<header class="grid grid-cols-12 gap-6 border-b border-rule px-14 pb-12 pt-16">
		<div class="col-span-10 col-start-2">
			<div class="mb-7 text-[12px] uppercase tracking-[0.08em] text-dim">
				<a href="/blog" class="text-dim no-underline">Blog</a>
			</div>
			<h1 class="m-0 mb-7 text-[84px] font-semibold leading-[0.98] tracking-[-0.045em]">
				{titleHead}<span class="font-serif font-normal italic text-accent">{titleTail}.</span>
			</h1>
			<p
				class="m-0 mb-9 max-w-[880px] font-serif text-[26px] font-normal leading-[1.45] text-dim"
			>
				{description}
			</p>
			<div class="flex items-center gap-5 border-t border-rule pt-7">
				<span
					class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-[13px] font-semibold text-accent"
				>
					{initials(author)}
				</span>
				<div class="flex-1">
					<div class="text-[15px] font-medium">{author}</div>
				</div>
				<div class="flex gap-6 text-[13px] text-dim">
					{#if read}<span>{read} read</span>{/if}
					{#if words}<span>·</span><span>{words} words</span>{/if}
				</div>
			</div>
		</div>
	</header>

	<!-- Body: TOC sidebar + article -->
	<div class="grid grid-cols-12 gap-6 px-14 pb-24 pt-[72px]">
		<aside class="col-span-2 col-start-2 sticky top-6 self-start">
			<div
				class="mb-4 border-b border-rule pb-3 text-[11px] uppercase tracking-[0.08em] text-dim"
			>
				Contents
			</div>
			<ol class="m-0 flex list-none flex-col gap-3 p-0">
				{#each toc as s, i}
					<li class="flex gap-2.5 text-[13px] leading-[1.4]">
						<span
							class="min-w-4 font-serif italic tabular-nums text-faint"
						>
							{i + 1}
						</span>
						<a
							href="#{s.id}"
							class="no-underline {i === activeIdx
								? 'font-medium text-ink'
								: 'text-dim hover:text-ink'}"
						>
							{s.label}
						</a>
					</li>
				{/each}
				{#if toc.length === 0}
					<li class="text-[13px] text-dim">—</li>
				{/if}
			</ol>
			<div class="mt-7 border-t border-rule pt-4 text-[12px] text-dim">
				<div class="mb-1.5">Reading progress</div>
				<div class="h-[3px] overflow-hidden rounded-full bg-rule">
					<div class="h-full bg-accent" style="width:{(progress * 100).toFixed(1)}%"></div>
				</div>
			</div>
		</aside>

		<article
			bind:this={articleEl}
			class="col-span-7 col-start-5 max-w-[720px] prose prose-neutral
				prose-p:text-[18px] prose-p:leading-[1.65] prose-p:text-ink
				prose-headings:font-sans prose-headings:tracking-[-0.025em]
				prose-h2:text-[36px] prose-h2:font-semibold prose-h2:leading-[1.15] prose-h2:mt-14 prose-h2:mb-5
				prose-h3:text-[24px] prose-h3:font-semibold prose-h3:mt-10 prose-h3:mb-4
				prose-a:text-ink prose-a:underline prose-a:decoration-accent hover:prose-a:decoration-ink
				prose-strong:text-ink
				prose-ul:text-ink prose-ol:text-ink prose-li:marker:text-accent
				prose-blockquote:border-l-[3px] prose-blockquote:border-accent prose-blockquote:not-italic
				prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:text-[28px] prose-blockquote:text-ink prose-blockquote:font-normal
				prose-blockquote:px-0 prose-blockquote:pl-8 prose-blockquote:my-10 prose-blockquote:[quotes:none]
				prose-img:rounded-md prose-img:border prose-img:border-rule
				prose-hr:border-rule
				prose-code:bg-bg prose-code:text-ink prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:font-mono prose-code:text-[0.9em]
				prose-code:before:content-none prose-code:after:content-none
				prose-pre:bg-panel prose-pre:border prose-pre:border-rule prose-pre:text-ink
				[&>p:first-of-type]:font-serif [&>p:first-of-type]:text-[22px] [&>p:first-of-type]:leading-[1.55]
				[&>p:first-of-type::first-letter]:font-serif [&>p:first-of-type::first-letter]:text-[88px]
				[&>p:first-of-type::first-letter]:leading-[0.85] [&>p:first-of-type::first-letter]:float-left
				[&>p:first-of-type::first-letter]:mr-3.5 [&>p:first-of-type::first-letter]:mt-1.5
				[&>p:first-of-type::first-letter]:italic [&>p:first-of-type::first-letter]:text-accent
				max-w-none"
		>
			{@render children()}
		</article>
	</div>

	<!-- Related posts -->
	{#if related.length}
		<div class="border-t border-rule bg-panel px-14 py-16">
			<div class="mb-8 flex items-baseline justify-between">
				<h3
					class="m-0 font-serif text-[36px] font-normal italic tracking-[-0.02em]"
				>
					Read next
				</h3>
				<a href="/blog" class="text-[13px] text-dim no-underline">All posts →</a>
			</div>
			<div class="grid grid-cols-3 gap-6">
				{#each related as p}
					<a
						href="/blog/{p.slug}"
						class="cursor-pointer rounded-lg border border-rule bg-bg p-6 text-ink no-underline"
					>
						{#if p.tag}
							<div
								class="mb-3 font-serif text-[11px] uppercase italic tracking-[0.08em] text-accent"
							>
								{p.tag}
							</div>
						{/if}
						<h4
							class="m-0 mb-3 text-[22px] font-semibold leading-[1.2] tracking-[-0.02em]"
						>
							{p.title}
						</h4>
						<p
							class="m-0 mb-[18px] font-serif text-[15px] leading-[1.5] text-dim"
						>
							{p.description}
						</p>
						<div class="flex justify-between text-[12px] text-dim">
							<span>{p.author ?? 'MyP0 Team'}</span>
							<span>{fmtDate(p.date)}</span>
						</div>
					</a>
				{/each}
			</div>
		</div>
	{/if}

	<V2Footer />
</div>
