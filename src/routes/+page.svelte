<svelte:head>
	<title>myP0 - Your productivity. Your data. Your rules.</title>
	<meta name="description" content="A personal productivity app that keeps your data in your Google account. No servers, no tracking, fully open source. Tasks, notes, and calendar in one privacy-first interface." />
	<link rel="canonical" href="https://myp0.com" />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://myp0.com" />
	<meta property="og:title" content="myP0 - Your productivity. Your data. Your rules." />
	<meta property="og:description" content="A personal productivity app that keeps your data in your Google account. No servers, no tracking, fully open source. Tasks, notes, and calendar in one privacy-first interface." />
	<meta property="og:site_name" content="myP0" />
	<meta property="og:image" content="https://myp0.com/og-image.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:locale" content="en_US" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="myP0 - Your productivity. Your data. Your rules." />
	<meta name="twitter:description" content="A personal productivity app that keeps your data in your Google account. No servers, no tracking, fully open source." />
	<meta name="twitter:image" content="https://myp0.com/og-image.png" />

	<!-- JSON-LD Structured Data -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "WebSite",
				"@id": "https://myp0.com/#website",
				"url": "https://myp0.com",
				"name": "myP0",
				"description": "A personal productivity app that keeps your data in your Google account. No servers, no tracking, fully open source.",
				"publisher": { "@id": "https://myp0.com/#organization" },
				"potentialAction": {
					"@type": "SearchAction",
					"target": "https://myp0.com/blog?q={search_term_string}",
					"query-input": "required name=search_term_string"
				}
			},
			{
				"@type": "Organization",
				"@id": "https://myp0.com/#organization",
				"name": "myP0",
				"url": "https://myp0.com",
				"logo": {
					"@type": "ImageObject",
					"url": "https://myp0.com/icon-512.png"
				},
				"sameAs": ["https://github.com/myP0/myP0-web"]
			},
			{
				"@type": "SoftwareApplication",
				"name": "myP0",
				"url": "https://myp0.com",
				"applicationCategory": "ProductivityApplication",
				"operatingSystem": "Web, Android, iOS",
				"offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
				"description": "A personal productivity app that stores everything in your Google account. Tasks, notes, and calendar unified in one privacy-first interface.",
				"featureList": [
					"Google Calendar integration",
					"Google Tasks management",
					"Block editor with Google Drive sync",
					"Offline-first with IndexedDB",
					"PKCE OAuth - no backend needed",
					"Open source under MIT License"
				],
				"screenshot": "https://myp0.com/og-image.png",
				"softwareVersion": "1.0",
				"author": { "@id": "https://myp0.com/#organization" }
			},
			{
				"@type": "FAQPage",
				"mainEntity": [
					{
						"@type": "Question",
						"name": "Is myP0 really free?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "Yes, myP0 is completely free and open source under the MIT License. There are no paid tiers, no premium features, and no ads. The app runs entirely in your browser using your existing Google account."
						}
					},
					{
						"@type": "Question",
						"name": "Where is my data stored?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "All your data stays in your Google account. Tasks sync with Google Tasks, notes are stored in Google Drive's hidden app folder, and calendar events use Google Calendar. myP0 never stores your data on any server."
						}
					},
					{
						"@type": "Question",
						"name": "Does myP0 work offline?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "Yes, myP0 is offline-first. All changes save instantly to your browser's IndexedDB storage. When you're back online, changes automatically sync to your Google account. The app works as a PWA and can be installed on any device."
						}
					},
					{
						"@type": "Question",
						"name": "What happens to my data if I stop using myP0?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "Nothing changes. Your tasks remain in Google Tasks, your calendar events stay in Google Calendar, and your notes persist in Google Drive. Since myP0 uses standard Google APIs, your data is always accessible through Google's own apps."
						}
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
				my<span class="text-zinc-400 dark:text-zinc-400">P0</span>
			</a>
			<div class="hidden items-center gap-8 md:flex">
				<a href="/blog" class="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">Blog</a>
				<a href="#features" class="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">Features</a>
				<a href="#how-it-works" class="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">How it works</a>
				<a href="#open-source" class="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">Open source</a>
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
					href="/dashboard"
					class="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
				>
					Get started
				</a>
			</div>
		</div>
	</nav>

	<!-- Hero -->
	<section class="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-32">
		<!-- Subtle radial glow -->
		<div class="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-zinc-200/50 blur-[120px] dark:bg-zinc-800/20"></div>

		<div class="relative mx-auto max-w-4xl px-6 text-center">
			<!-- Badge -->
			<div class="mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-1.5 dark:border-zinc-800 dark:bg-zinc-900/50">
				<div class="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
				<span class="text-xs font-medium text-zinc-500 dark:text-zinc-400">Open source & privacy-first</span>
			</div>

			<h1 class="text-4xl font-extrabold leading-[1.1] tracking-tight text-zinc-900 sm:text-5xl md:text-7xl dark:text-white">
				Your productivity.<br />
				<span class="text-zinc-400 dark:text-zinc-500">Your data. Your rules.</span>
			</h1>

			<p class="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-500 md:text-xl dark:text-zinc-400">
				A personal productivity app that stores everything in your Google account.
				No servers. No tracking. No compromises.
			</p>

			<div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
				<a
					href="/dashboard"
					class="group flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-700 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
				>
					Start for free
					<svg class="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
				</a>
				<a
					href="https://github.com/myP0/myP0-web"
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center gap-2 rounded-xl border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition-all hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
				>
					<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
					View on GitHub
				</a>
			</div>
		</div>

		<!-- App preview mockup (always dark themed as product screenshot) -->
		<div class="relative mx-auto mt-20 max-w-5xl px-6">
			<div class="rounded-2xl border border-zinc-200 bg-zinc-100 p-1.5 shadow-2xl shadow-black/10 dark:border-zinc-800 dark:bg-zinc-900/50 dark:shadow-black/50">
				<!-- Window chrome -->
				<div class="flex items-center gap-2 rounded-t-xl bg-zinc-900 px-4 py-3">
					<div class="flex gap-1.5">
						<div class="h-3 w-3 rounded-full bg-zinc-700"></div>
						<div class="h-3 w-3 rounded-full bg-zinc-700"></div>
						<div class="h-3 w-3 rounded-full bg-zinc-700"></div>
					</div>
					<div class="mx-auto rounded-md bg-zinc-800 px-4 py-1 text-xs text-zinc-500">app.myp0.com</div>
				</div>
				<!-- Mock dashboard (always dark - it's the app preview) -->
				<div class="rounded-b-xl bg-zinc-900 p-6">
					<div class="grid grid-cols-12 gap-4">
						<!-- Sidebar -->
						<div class="col-span-3 space-y-3">
							<div class="rounded-lg bg-zinc-800/50 px-3 py-2 text-sm text-zinc-300">Dashboard</div>
							<div class="rounded-lg px-3 py-2 text-sm text-zinc-500">Tasks</div>
							<div class="rounded-lg px-3 py-2 text-sm text-zinc-500">Notes</div>
							<div class="rounded-lg px-3 py-2 text-sm text-zinc-500">Calendar</div>
						</div>
						<!-- Main content -->
						<div class="col-span-9 space-y-4">
							<div class="flex items-center justify-between">
								<div class="text-lg font-semibold text-zinc-200">Good morning</div>
								<div class="text-sm text-zinc-500">Mon, Jan 15</div>
							</div>
							<!-- Stats row -->
							<div class="grid grid-cols-3 gap-3">
								<div class="rounded-lg border border-zinc-800 bg-zinc-800/30 p-4">
									<div class="text-2xl font-bold text-white">12</div>
									<div class="text-xs text-zinc-500">Tasks today</div>
								</div>
								<div class="rounded-lg border border-zinc-800 bg-zinc-800/30 p-4">
									<div class="text-2xl font-bold text-white">3</div>
									<div class="text-xs text-zinc-500">Events</div>
								</div>
								<div class="rounded-lg border border-zinc-800 bg-zinc-800/30 p-4">
									<div class="text-2xl font-bold text-white">7</div>
									<div class="text-xs text-zinc-500">Notes</div>
								</div>
							</div>
							<!-- Task list -->
							<div class="space-y-2">
								<div class="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-800/20 px-4 py-3">
									<div class="h-4 w-4 rounded border border-zinc-600"></div>
									<span class="text-sm text-zinc-300">Review Q1 planning doc</span>
									<span class="ml-auto rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">Work</span>
								</div>
								<div class="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-800/20 px-4 py-3">
									<div class="h-4 w-4 rounded border border-zinc-600"></div>
									<span class="text-sm text-zinc-300">Prepare meeting notes</span>
									<span class="ml-auto rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">Work</span>
								</div>
								<div class="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-800/20 px-4 py-3">
									<div class="h-4 w-4 rounded border border-emerald-900/50 bg-emerald-500/20">
										<svg class="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
									</div>
									<span class="text-sm text-zinc-500 line-through">Set up project repo</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- Gradient fade at bottom -->
			<div class="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent dark:from-zinc-950"></div>
		</div>
	</section>

	<!-- Integrations strip -->
	<section class="border-y border-zinc-200 py-12 dark:border-zinc-800/50">
		<div class="mx-auto max-w-4xl px-6 text-center">
			<p class="mb-8 text-sm font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Powered by your Google account</p>
			<div class="flex flex-wrap items-center justify-center gap-10 md:gap-16">
				<!-- Google Calendar -->
				<div class="flex items-center gap-2 text-zinc-500">
					<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /><path d="M8 14h2v2H8z" fill="currentColor" /></svg>
					<span class="text-sm font-medium">Calendar</span>
				</div>
				<!-- Google Tasks -->
				<div class="flex items-center gap-2 text-zinc-500">
					<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>
					<span class="text-sm font-medium">Tasks</span>
				</div>
				<!-- Google Drive -->
				<div class="flex items-center gap-2 text-zinc-500">
					<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 19.5h20L12 2z" /><path d="M2 19.5l5-8.5h14" /><path d="M15.5 11L22 19.5" /></svg>
					<span class="text-sm font-medium">Drive</span>
				</div>
				<!-- IndexedDB -->
				<div class="flex items-center gap-2 text-zinc-500">
					<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" /><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" /></svg>
					<span class="text-sm font-medium">Offline storage</span>
				</div>
			</div>
		</div>
	</section>

	<!-- Features -->
	<section id="features" class="py-24 md:py-32">
		<div class="mx-auto max-w-6xl px-6">
			<div class="mx-auto max-w-2xl text-center">
				<h2 class="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl dark:text-white">
					Everything you need,<br />nothing you don't
				</h2>
				<p class="mt-4 text-lg text-zinc-500 dark:text-zinc-400">
					Built for people who care about where their data lives.
				</p>
			</div>

			<div class="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<!-- Feature 1 -->
				<div class="group rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800/50 dark:bg-zinc-900/30 dark:hover:border-zinc-700/50 dark:hover:bg-zinc-900/50">
					<div class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-800">
						<svg class="h-5 w-5 text-zinc-700 dark:text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
					</div>
					<h3 class="text-base font-semibold text-zinc-900 dark:text-white">You own your data</h3>
					<p class="mt-2 text-sm leading-relaxed text-zinc-500">
						All data stays in your Google account. We never store, see, or touch your information. Delete the app, keep your data.
					</p>
				</div>

				<!-- Feature 2 -->
				<div class="group rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800/50 dark:bg-zinc-900/30 dark:hover:border-zinc-700/50 dark:hover:bg-zinc-900/50">
					<div class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-800">
						<svg class="h-5 w-5 text-zinc-700 dark:text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
					</div>
					<h3 class="text-base font-semibold text-zinc-900 dark:text-white">Offline first</h3>
					<p class="mt-2 text-sm leading-relaxed text-zinc-500">
						Works without internet. Changes sync to Google Drive when you're back online. No loading spinners, ever.
					</p>
				</div>

				<!-- Feature 3 -->
				<div class="group rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800/50 dark:bg-zinc-900/30 dark:hover:border-zinc-700/50 dark:hover:bg-zinc-900/50">
					<div class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-800">
						<svg class="h-5 w-5 text-zinc-700 dark:text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
					</div>
					<h3 class="text-base font-semibold text-zinc-900 dark:text-white">Tasks & notes</h3>
					<p class="mt-2 text-sm leading-relaxed text-zinc-500">
						Manage tasks with Google Tasks, write rich notes with a block editor. Everything syncs to your Drive automatically.
					</p>
				</div>

				<!-- Feature 4 -->
				<div class="group rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800/50 dark:bg-zinc-900/30 dark:hover:border-zinc-700/50 dark:hover:bg-zinc-900/50">
					<div class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-800">
						<svg class="h-5 w-5 text-zinc-700 dark:text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
					</div>
					<h3 class="text-base font-semibold text-zinc-900 dark:text-white">Calendar view</h3>
					<p class="mt-2 text-sm leading-relaxed text-zinc-500">
						See your Google Calendar events alongside tasks and notes. One unified view for your day.
					</p>
				</div>

				<!-- Feature 5 -->
				<div class="group rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800/50 dark:bg-zinc-900/30 dark:hover:border-zinc-700/50 dark:hover:bg-zinc-900/50">
					<div class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-800">
						<svg class="h-5 w-5 text-zinc-700 dark:text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
					</div>
					<h3 class="text-base font-semibold text-zinc-900 dark:text-white">Install anywhere</h3>
					<p class="mt-2 text-sm leading-relaxed text-zinc-500">
						PWA that installs on any device. Android app via Play Store. Works on desktop, tablet, and phone.
					</p>
				</div>

				<!-- Feature 6 -->
				<div class="group rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800/50 dark:bg-zinc-900/30 dark:hover:border-zinc-700/50 dark:hover:bg-zinc-900/50">
					<div class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-800">
						<svg class="h-5 w-5 text-zinc-700 dark:text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
					</div>
					<h3 class="text-base font-semibold text-zinc-900 dark:text-white">Smart reminders</h3>
					<p class="mt-2 text-sm leading-relaxed text-zinc-500">
						Push notifications powered by a single serverless function. The only server-side component, and it's open source too.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- How it works -->
	<section id="how-it-works" class="border-t border-zinc-200 py-24 md:py-32 dark:border-zinc-800/50">
		<div class="mx-auto max-w-6xl px-6">
			<div class="mx-auto max-w-2xl text-center">
				<h2 class="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl dark:text-white">How it works</h2>
				<p class="mt-4 text-lg text-zinc-500 dark:text-zinc-400">Three simple principles. No magic, no lock-in.</p>
			</div>

			<div class="mt-16 grid gap-8 md:grid-cols-3">
				<!-- Step 1 -->
				<div class="relative">
					<div class="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-100 text-lg font-bold text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900">1</div>
					<h3 class="text-lg font-semibold text-zinc-900 dark:text-white">Sign in with Google</h3>
					<p class="mt-3 text-sm leading-relaxed text-zinc-500">
						Authenticate directly in your browser using PKCE OAuth. No passwords stored, no backend involved. Your token stays in your browser.
					</p>
				</div>

				<!-- Step 2 -->
				<div class="relative">
					<div class="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-100 text-lg font-bold text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900">2</div>
					<h3 class="text-lg font-semibold text-zinc-900 dark:text-white">Work locally</h3>
					<p class="mt-3 text-sm leading-relaxed text-zinc-500">
						All changes save instantly to IndexedDB. The app feels native because it <em>is</em> local. No round trips, no latency.
					</p>
				</div>

				<!-- Step 3 -->
				<div class="relative">
					<div class="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-100 text-lg font-bold text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900">3</div>
					<h3 class="text-lg font-semibold text-zinc-900 dark:text-white">Sync to Drive</h3>
					<p class="mt-3 text-sm leading-relaxed text-zinc-500">
						Changes automatically sync to your Google Drive's hidden app folder. Your data, in your account, under your control.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Architecture / Code block section -->
	<section class="border-t border-zinc-200 py-24 md:py-32 dark:border-zinc-800/50">
		<div class="mx-auto max-w-6xl px-6">
			<div class="grid items-center gap-12 lg:grid-cols-2">
				<div>
					<h2 class="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl dark:text-white">
						No backend.<br />
						<span class="text-zinc-400 dark:text-zinc-500">Seriously.</span>
					</h2>
					<p class="mt-4 text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
						The entire app runs in your browser. Authentication uses PKCE (no server needed). Data goes directly to Google APIs. The only server component is a tiny Lambda for push notifications.
					</p>
					<div class="mt-8 space-y-3">
						<div class="flex items-center gap-3">
							<svg class="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
							<span class="text-sm text-zinc-700 dark:text-zinc-300">No database to maintain</span>
						</div>
						<div class="flex items-center gap-3">
							<svg class="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
							<span class="text-sm text-zinc-700 dark:text-zinc-300">No server costs</span>
						</div>
						<div class="flex items-center gap-3">
							<svg class="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
							<span class="text-sm text-zinc-700 dark:text-zinc-300">No data breaches possible</span>
						</div>
						<div class="flex items-center gap-3">
							<svg class="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
							<span class="text-sm text-zinc-700 dark:text-zinc-300">Deploy as static files</span>
						</div>
					</div>
				</div>

				<!-- Code block (always dark) -->
				<div class="rounded-2xl border border-zinc-200 bg-zinc-100 p-1.5 dark:border-zinc-800 dark:bg-zinc-900/50">
					<div class="flex items-center gap-2 px-4 py-3">
						<div class="flex gap-1.5">
							<div class="h-3 w-3 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
							<div class="h-3 w-3 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
							<div class="h-3 w-3 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
						</div>
						<span class="ml-2 text-xs text-zinc-500 dark:text-zinc-600">store.ts</span>
					</div>
					<pre class="overflow-x-auto rounded-b-xl bg-zinc-950 p-5 text-sm leading-relaxed"><code class="text-zinc-300"><span class="text-zinc-500">// Your data flow, simplified</span>
<span class="text-zinc-500">function</span> <span class="text-white">createStore</span>() &#123;
  <span class="text-zinc-500">return</span> &#123;
    <span class="text-white">save</span>(data) &#123;
      <span class="text-zinc-400">idb</span>.<span class="text-zinc-200">set</span>(data)      <span class="text-zinc-600">// instant, local</span>
      <span class="text-zinc-400">drive</span>.<span class="text-zinc-200">sync</span>(data)   <span class="text-zinc-600">// debounced, remote</span>
    &#125;,

    <span class="text-zinc-500">async</span> <span class="text-white">load</span>() &#123;
      <span class="text-zinc-500">const</span> local = <span class="text-zinc-500">await</span> <span class="text-zinc-400">idb</span>.<span class="text-zinc-200">get</span>()
      <span class="text-zinc-500">const</span> remote = <span class="text-zinc-500">await</span> <span class="text-zinc-400">drive</span>.<span class="text-zinc-200">fetch</span>()
      <span class="text-zinc-500">return</span> <span class="text-white">merge</span>(local, remote)
    &#125;
  &#125;
&#125;</code></pre>
				</div>
			</div>
		</div>
	</section>

	<!-- Open source CTA -->
	<section id="open-source" class="border-t border-zinc-200 py-24 md:py-32 dark:border-zinc-800/50">
		<div class="mx-auto max-w-4xl px-6 text-center">
			<div class="rounded-3xl border border-zinc-200 bg-gradient-to-b from-zinc-50 to-white p-12 md:p-16 dark:border-zinc-800/50 dark:from-zinc-900/80 dark:to-zinc-900/20">
				<div class="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 dark:border-zinc-800 dark:bg-zinc-950">
					<svg class="h-4 w-4 text-zinc-500 dark:text-zinc-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
					<span class="text-xs font-medium text-zinc-500 dark:text-zinc-400">MIT License</span>
				</div>

				<h2 class="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl dark:text-white">
					Fully open source
				</h2>
				<p class="mx-auto mt-4 max-w-xl text-lg text-zinc-500 dark:text-zinc-400">
					Every line of code is public. Fork it, audit it, self-host it.
					Your productivity tool should be as transparent as your data ownership.
				</p>

				<div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
					<a
						href="https://github.com/myP0/myP0-web"
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
					>
						<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
						Star on GitHub
					</a>
					<a
						href="/dashboard"
						class="rounded-xl border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition-all hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
					>
						Try the app
					</a>
				</div>
			</div>
		</div>
	</section>

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
					<a href="#features" class="text-sm text-zinc-500 transition-colors hover:text-zinc-700 dark:hover:text-zinc-300">Features</a>
					<a href="#how-it-works" class="text-sm text-zinc-500 transition-colors hover:text-zinc-700 dark:hover:text-zinc-300">How it works</a>
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
