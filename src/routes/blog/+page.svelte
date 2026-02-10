<script>
	let { data } = $props();
</script>

<svelte:head>
	<title>Blog - myP0</title>
	<meta name="description" content="Thoughts on productivity, data ownership, and building tools that respect your privacy." />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
</svelte:head>

<div class="font-[Inter,system-ui,sans-serif]">
	<!-- Nav -->
	<nav class="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
		<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
			<a href="/" class="text-xl font-bold tracking-tight text-white">
				my<span class="text-zinc-400">P0</span>
			</a>
			<div class="hidden items-center gap-8 md:flex">
				<a href="/blog" class="text-sm text-white transition-colors hover:text-white">Blog</a>
				<a href="/#features" class="text-sm text-zinc-400 transition-colors hover:text-white">Features</a>
				<a href="/#how-it-works" class="text-sm text-zinc-400 transition-colors hover:text-white">How it works</a>
			</div>
			<div class="flex items-center gap-3">
				<a
					href="https://github.com/myP0/myP0-web"
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:text-white"
				>
					<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
					GitHub
				</a>
				<a
					href="/dashboard"
					class="rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
				>
					Get started
				</a>
			</div>
		</div>
	</nav>

	<!-- Blog header -->
	<section class="pt-32 pb-12 md:pt-40 md:pb-16">
		<div class="mx-auto max-w-3xl px-6">
			<h1 class="text-3xl font-bold tracking-tight text-white md:text-4xl">Blog</h1>
			<p class="mt-3 text-lg text-zinc-400">
				Thoughts on productivity, data ownership, and building tools that respect your privacy.
			</p>
		</div>
	</section>

	<!-- Post list -->
	<section class="pb-24">
		<div class="mx-auto max-w-3xl px-6">
			<div class="space-y-8">
				{#each data.posts as post}
					<a
						href="/blog/{post.slug}"
						class="group block rounded-2xl border border-zinc-800/50 bg-zinc-900/30 p-6 transition-colors hover:border-zinc-700/50 hover:bg-zinc-900/50"
					>
						<div class="mb-3 flex items-center gap-3">
							<time class="text-sm text-zinc-500">{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
							{#if post.tag}
								<span class="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-400">{post.tag}</span>
							{/if}
						</div>
						<h2 class="text-xl font-semibold text-white group-hover:text-zinc-200">{post.title}</h2>
						<p class="mt-2 text-sm leading-relaxed text-zinc-500">{post.description}</p>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="border-t border-zinc-800/50 py-12">
		<div class="mx-auto max-w-6xl px-6">
			<div class="flex flex-col items-center justify-between gap-6 md:flex-row">
				<div>
					<a href="/" class="text-lg font-bold tracking-tight text-white">
						my<span class="text-zinc-400">P0</span>
					</a>
					<p class="mt-1 text-sm text-zinc-600">Your productivity, your way.</p>
				</div>
				<div class="flex items-center gap-8">
					<a href="/blog" class="text-sm text-zinc-500 transition-colors hover:text-zinc-300">Blog</a>
					<a href="/#features" class="text-sm text-zinc-500 transition-colors hover:text-zinc-300">Features</a>
					<a
						href="https://github.com/myP0/myP0-web"
						target="_blank"
						rel="noopener noreferrer"
						class="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
					>
						GitHub
					</a>
				</div>
			</div>
			<div class="mt-8 border-t border-zinc-800/50 pt-8 text-center">
				<p class="text-xs text-zinc-700">&copy; {new Date().getFullYear()} myP0. Open source under the MIT License.</p>
			</div>
		</div>
	</footer>
</div>
