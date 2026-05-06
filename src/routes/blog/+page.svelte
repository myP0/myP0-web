<script lang="ts">
	import V2Nav from '$lib/components/V2Nav.svelte';
	import V2Footer from '$lib/components/V2Footer.svelte';
	import V2NewsletterStrip from '$lib/components/V2NewsletterStrip.svelte';

	let { data } = $props();

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

	const featured = $derived(data.posts[0]);
	const rest = $derived(data.posts.slice(1));
</script>

<svelte:head>
	<title>The myP0 manual — Notes, essays, field reports.</title>
	<meta
		name="description"
		content="A working journal from the people building myP0 — on data ownership, software restraint, and the file as the source of truth."
	/>
	<link rel="canonical" href="https://myp0.com/blog" />

	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://myp0.com/blog" />
	<meta property="og:title" content="The myP0 manual" />
	<meta
		property="og:description"
		content="A working journal from the people building myP0 — on data ownership, software restraint, and the file as the source of truth."
	/>
	<meta property="og:site_name" content="myP0" />
	<meta property="og:image" content="https://myp0.com/og-image.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:locale" content="en_US" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="The myP0 manual" />
	<meta
		name="twitter:description"
		content="A working journal from the people building myP0 — on data ownership, software restraint, and the file as the source of truth."
	/>
	<meta name="twitter:image" content="https://myp0.com/og-image.png" />

	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Blog',
				'@id': 'https://myp0.com/blog',
				name: 'The myP0 manual',
				description:
					'A working journal from the people building myP0 — on data ownership, software restraint, and the file as the source of truth.',
				url: 'https://myp0.com/blog',
				publisher: { '@type': 'Organization', name: 'myP0', url: 'https://myp0.com' }
			},
			{
				'@type': 'BreadcrumbList',
				itemListElement: [
					{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myp0.com' },
					{ '@type': 'ListItem', position: 2, name: 'Manual' }
				]
			}
		]
	})}</script>`}
</svelte:head>

<div class="min-h-screen bg-bg text-ink">
	<V2Nav active="Manual" />

	<!-- Header -->
	<div class="grid grid-cols-12 items-end gap-6 border-b border-rule px-14 pb-12 pt-16">
		<div class="col-span-8">
			<div class="mb-5 flex items-center gap-3 text-[12px] uppercase tracking-[0.08em] text-dim">
				<span class="block h-px w-7 bg-dim"></span>
				The myP0 manual
			</div>
			<h1 class="m-0 text-[88px] font-semibold leading-[0.96] tracking-[-0.045em]">
				Notes,<br />
				essays,<br />
				<span class="font-serif font-normal italic text-accent">field reports.</span>
			</h1>
		</div>
		<div class="col-span-3 col-start-10 pb-2">
			<p class="m-0 text-[15px] leading-[1.55] text-dim">
				A working journal from the people building myP0 — on data ownership, software restraint, and
				the file as the source of truth.
			</p>
		</div>
	</div>

	<!-- Featured -->
	{#if featured}
		<a
			href="/blog/{featured.slug}"
			class="grid cursor-pointer grid-cols-12 gap-6 border-b border-rule p-14 text-ink no-underline"
		>
			<div class="relative col-span-5">
				<div
					class="flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-lg bg-ink p-8 text-bg"
				>
					<div class="text-[11px] tracking-[0.1em]" style="color:rgba(255,255,255,0.5)">
						FEATURED · ESSAY № 14
					</div>
					<div
						class="font-serif text-[96px] font-normal italic leading-[0.92] tracking-[-0.03em]"
					>
						<span class="block text-accent">Trapped</span>
						<span class="block" style="opacity:0.85">data is</span>
						<span class="block" style="opacity:0.6">useless</span>
						<span class="block" style="opacity:0.4">data.</span>
					</div>
					<div
						class="flex justify-between text-[11px] tracking-[0.08em]"
						style="color:rgba(255,255,255,0.5)"
					>
						<span>{fmtDate(featured.date).toUpperCase()}</span>
						<span>{featured.read.toUpperCase()}</span>
					</div>
				</div>
			</div>
			<div class="col-span-6 col-start-7 flex flex-col justify-center">
				<div
					class="mb-[18px] font-serif text-[12px] uppercase italic tracking-[0.08em] text-accent"
				>
					Featured essay
				</div>
				<h2 class="m-0 mb-5 text-[52px] font-semibold leading-[1.02] tracking-[-0.035em]">
					{featured.title}
				</h2>
				<p class="m-0 mb-7 font-serif text-[22px] font-normal leading-[1.5] text-dim">
					{featured.description}
				</p>
				<div class="flex items-center gap-4 text-[13px] text-dim">
					<span
						class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent-soft text-[11px] font-semibold text-accent"
					>
						{initials(featured.author)}
					</span>
					<span class="text-ink">{featured.author}</span>
					<span>·</span>
					<span>{fmtDate(featured.date)}</span>
					<span>·</span>
					<span>{featured.read} read</span>
				</div>
				<div
					class="mt-7 self-start rounded-full bg-ink px-[18px] py-2.5 text-[14px] font-medium text-bg"
				>
					Read the essay →
				</div>
			</div>
		</a>
	{/if}

	<!-- Post rows -->
	<div>
		{#each rest as post, i}
			<a
				href="/blog/{post.slug}"
				class="grid cursor-pointer grid-cols-[60px_1fr_200px_120px] items-baseline gap-6 border-b border-rule px-14 py-8 text-ink no-underline"
			>
				<div
					class="font-serif text-[18px] italic tabular-nums text-faint"
				>
					{String(i + 2).padStart(2, '0')}
				</div>
				<div>
					{#if post.tag}
						<div
							class="mb-2 inline-block font-serif text-[11px] uppercase italic tracking-[0.08em] text-accent"
						>
							{post.tag}
						</div>
					{/if}
					<h3 class="m-0 mb-2 text-[28px] font-semibold leading-[1.15] tracking-[-0.02em]">
						{post.title}
					</h3>
					<p
						class="m-0 max-w-[620px] font-serif text-[17px] leading-[1.5] text-dim"
					>
						{post.description}
					</p>
				</div>
				<div class="flex flex-col gap-1 text-[13px] text-dim">
					<span class="text-ink">{post.author}</span>
					<span>{fmtDate(post.date)}</span>
				</div>
				<div class="text-right text-[13px] text-dim">{post.read} →</div>
			</a>
		{/each}
	</div>

	<V2NewsletterStrip />
	<V2Footer variant="minimal" />
</div>
