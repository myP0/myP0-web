<script>
	import { page } from '$app/state';
	let { title, date, description, tag, children } = $props();
	const isoDate = new Date(date).toISOString();
	const site = 'https://myp0.com';
	const slug = $derived(page.params?.slug || '');
	const canonicalUrl = $derived(`${site}/blog/${slug}`);
</script>

<svelte:head>
	<title>{title} - myP0 Blog</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonicalUrl} />

	<!-- Open Graph -->
	<meta property="og:type" content="article" />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:site_name" content="myP0" />
	<meta property="og:image" content="{site}/og-image.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="article:published_time" content={isoDate} />
	<meta property="article:author" content="{site}" />
	{#if tag}
		<meta property="article:tag" content={tag} />
		<meta property="article:section" content={tag} />
	{/if}

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content="{site}/og-image.png" />

	<!-- JSON-LD Article + Breadcrumb -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "BlogPosting",
				"headline": title,
				"description": description,
				"datePublished": isoDate,
				"dateModified": isoDate,
				"url": canonicalUrl,
				"author": {
					"@type": "Organization",
					"name": "myP0",
					"url": site
				},
				"publisher": {
					"@type": "Organization",
					"name": "myP0",
					"url": site
				},
				"mainEntityOfPage": {
					"@type": "WebPage",
					"@id": canonicalUrl
				},
				"isPartOf": {
					"@type": "Blog",
					"@id": `${site}/blog`,
					"name": "myP0 Blog"
				},
				...(tag ? { "keywords": tag, "articleSection": tag } : {})
			},
			{
				"@type": "BreadcrumbList",
				"itemListElement": [
					{
						"@type": "ListItem",
						"position": 1,
						"name": "Home",
						"item": site
					},
					{
						"@type": "ListItem",
						"position": 2,
						"name": "Blog",
						"item": `${site}/blog`
					},
					{
						"@type": "ListItem",
						"position": 3,
						"name": title
					}
				]
			}
		]
	})}</script>`}

	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
</svelte:head>

<div class="font-[Inter,system-ui,sans-serif]">
	<!-- Nav -->
	<nav class="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-950/80">
		<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
			<a href="/" class="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
				my<span class="text-zinc-400">P0</span>
			</a>
			<div class="hidden items-center gap-8 md:flex">
				<a href="/blog" class="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">Blog</a>
				<a href="/#features" class="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">Features</a>
				<a href="/#how-it-works" class="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">How it works</a>
			</div>
			<div class="flex items-center gap-3">
				<a
					href="https://github.com/myP0/myP0-web"
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
				>
					<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
					GitHub
				</a>
				<a
					href="/app"
					class="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
				>
					Get started
				</a>
			</div>
		</div>
	</nav>

	<!-- Article -->
	<article class="pt-32 pb-24 md:pt-40">
		<div class="mx-auto max-w-3xl px-6">
			<!-- Header -->
			<header class="mb-12">
				<a href="/blog" class="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-700 dark:hover:text-zinc-300">
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
					Back to blog
				</a>
				<div class="mb-4 flex items-center gap-3">
					<time class="text-sm text-zinc-500">{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
					{#if tag}
						<span class="rounded-full bg-zinc-200 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">{tag}</span>
					{/if}
				</div>
				<h1 class="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl dark:text-white">{title}</h1>
				<p class="mt-4 text-lg text-zinc-500 dark:text-zinc-400">{description}</p>
			</header>

			<!-- Content -->
			<div class="prose prose-zinc max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-h2:mt-12 prose-h2:text-2xl prose-h3:mt-8 prose-h3:text-xl prose-p:leading-relaxed prose-p:text-zinc-600 prose-a:text-zinc-900 prose-a:underline prose-a:decoration-zinc-300 hover:prose-a:decoration-zinc-500 prose-strong:text-zinc-800 prose-ul:text-zinc-600 prose-ol:text-zinc-600 prose-li:marker:text-zinc-400 prose-blockquote:border-zinc-200 prose-blockquote:text-zinc-600 prose-hr:border-zinc-200 dark:prose-invert dark:prose-p:text-zinc-400 dark:prose-a:text-white dark:prose-a:decoration-zinc-700 dark:hover:prose-a:decoration-zinc-400 dark:prose-strong:text-zinc-200 dark:prose-ul:text-zinc-400 dark:prose-ol:text-zinc-400 dark:prose-li:marker:text-zinc-600 dark:prose-blockquote:border-zinc-800 dark:prose-blockquote:text-zinc-400 dark:prose-hr:border-zinc-800">
				{@render children()}
			</div>
		</div>
	</article>

	<!-- Footer -->
	<footer class="border-t border-zinc-200 py-12 dark:border-zinc-800/50">
		<div class="mx-auto max-w-6xl px-6">
			<div class="flex flex-col items-center justify-between gap-6 md:flex-row">
				<div>
					<a href="/" class="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
						my<span class="text-zinc-400">P0</span>
					</a>
					<p class="mt-1 text-sm text-zinc-400 dark:text-zinc-600">Your productivity, your way.</p>
				</div>
				<div class="flex items-center gap-8">
					<a href="/blog" class="text-sm text-zinc-500 transition-colors hover:text-zinc-700 dark:hover:text-zinc-300">Blog</a>
					<a href="/#features" class="text-sm text-zinc-500 transition-colors hover:text-zinc-700 dark:hover:text-zinc-300">Features</a>
					<a
						href="https://github.com/myP0/myP0-web"
						target="_blank"
						rel="noopener noreferrer"
						class="text-sm text-zinc-500 transition-colors hover:text-zinc-700 dark:hover:text-zinc-300"
					>
						GitHub
					</a>
				</div>
			</div>
			<div class="mt-8 border-t border-zinc-200 pt-8 text-center dark:border-zinc-800/50">
				<p class="text-xs text-zinc-400 dark:text-zinc-700">&copy; {new Date().getFullYear()} myP0. Open source under the MIT License.</p>
			</div>
		</div>
	</footer>
</div>
