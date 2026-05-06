<script lang="ts">
	import { onMount } from 'svelte';
	import V2Nav from '$lib/components/V2Nav.svelte';
	import V2Footer from '$lib/components/V2Footer.svelte';

	const REPO = 'MyP0/MyP0-web';
	const STATS_CACHE_KEY = 'myp0-repo-stats-v1';
	const STATS_CACHE_TTL_MS = 10 * 60 * 1000;

	type RepoStats = { commits: number; prs: number; issues: number };

	let repoStats = $state<Partial<RepoStats>>({});

	async function ghSearchCount(kind: 'commits' | 'issues', query: string): Promise<number> {
		const url = `https://api.github.com/search/${kind}?q=${encodeURIComponent(query)}`;
		const res = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
		if (!res.ok) throw new Error(`GitHub ${kind} ${res.status}`);
		const data = await res.json();
		return data.total_count ?? 0;
	}

	onMount(async () => {
		try {
			const cached = sessionStorage.getItem(STATS_CACHE_KEY);
			if (cached) {
				const { at, value } = JSON.parse(cached) as { at: number; value: RepoStats };
				if (Date.now() - at < STATS_CACHE_TTL_MS) {
					repoStats = value;
					return;
				}
			}
		} catch {}

		try {
			const [commits, prs, issues] = await Promise.all([
				ghSearchCount('commits', `repo:${REPO}`),
				ghSearchCount('issues', `repo:${REPO} is:pr`),
				ghSearchCount('issues', `repo:${REPO} is:issue is:open`)
			]);
			const value: RepoStats = { commits, prs, issues };
			repoStats = value;
			try {
				sessionStorage.setItem(STATS_CACHE_KEY, JSON.stringify({ at: Date.now(), value }));
			} catch {}
		} catch {
			// Rate-limited or offline — leave repoStats empty so cells render "—".
		}
	});

	function fmtCount(n: number | undefined): string {
		return n === undefined ? '—' : n.toLocaleString('en-US');
	}

	const pillars = [
		{
			n: 'I',
			title: 'Calendar',
			lede: 'A schedule that reads like a page.',
			body: 'Your week, set in body copy. Drag with the keyboard. Search instead of scrolling. Reads from your existing Google Calendar — never a parallel copy.',
			bullets: ['Google Calendar two-way', 'Keyboard-first navigation', 'Reading-grid weekly view']
		},
		{
			n: 'II',
			title: 'Notes',
			lede: 'Plain markdown, in a place you already trust.',
			body: 'Each note is an .md file in /MyP0/notes. Open it on your laptop. Edit it on your phone. Back it up the same way you back up everything else.',
			bullets: ['Markdown on Drive', 'Backlinks & memos', 'Versioned by Drive itself']
		},
		{
			n: 'III',
			title: 'Tasks',
			lede: 'A short list, taken seriously.',
			body: 'Tasks are lines in a file. Comments are threads next to them. Done items move out of the way. There is no project management to learn.',
			bullets: ['Text-first task model', 'Anchored conversations', 'Date views, no boards']
		}
	];

	const ledger: [string, string][] = [
		['Open in Finder', 'Every note is a real file. Open with anything.'],
		['Export is a no-op', "There's nothing to export — it's already plain text on your disk."],
		['Backup is a no-op', 'Your existing Drive backup covers it.'],
		['Delete is a no-op', 'Drag the folder to Trash. We never see it leave.']
	];

	const stats = [
		{ k: 'Storage', v: 'Google Drive' },
		{ k: 'Servers', v: 'Zero' },
		{ k: 'Trackers', v: 'Zero' },
		{ k: 'Source', v: 'Open' }
	];

	const faqs: [string, string][] = [
		[
			'What happens to my data if you go away?',
			'Nothing. Your Drive folder stays where it is. The app is open source, so somebody — including you — can keep building on it. There is no "going away" event for your data.'
		],
		[
			'Why Google Drive?',
			'Most of our early users already have it, and it has a stable file API with good cross-platform sync. Dropbox and iCloud Drive are on the roadmap; the app is storage-agnostic underneath.'
		],
		[
			'Can I use this with my team?',
			"No. It's MyP0, not ourP0 — a tool for one person, sized for one person's working memory. There's no shared workspace, no permissions model, no presence. If your team needs that, you need a different app."
		],
		[
			'Is it really free?',
			'Really. Hosting nothing is cheap. We may add a paid team tier later for shared workspaces, but the personal app is free permanently.'
		],
		[
			'Where do I file a bug?',
			'GitHub Issues, or hit reply on any email from us. We read everything.'
		]
	];
</script>

<svelte:head>
	<title>MyP0 — Calendar. Notes. Tasks. Yours.</title>
	<meta
		name="description"
		content="A personal productivity app that keeps your data in your Google account. Calendar, notes, and tasks in one quiet, privacy-first interface. No servers, no tracking, fully open source."
	/>
	<link rel="canonical" href="https://myp0.com" />

	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://myp0.com" />
	<meta property="og:title" content="MyP0 — Calendar. Notes. Tasks. Yours." />
	<meta
		property="og:description"
		content="A personal productivity app that keeps your data in your Google account. No servers, no tracking, fully open source."
	/>
	<meta property="og:site_name" content="MyP0" />
	<meta property="og:image" content="https://myp0.com/og-image.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:locale" content="en_US" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="MyP0 — Calendar. Notes. Tasks. Yours." />
	<meta
		name="twitter:description"
		content="A personal productivity app that keeps your data in your Google account. No servers, no tracking, fully open source."
	/>
	<meta name="twitter:image" content="https://myp0.com/og-image.png" />

	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebSite',
				'@id': 'https://myp0.com/#website',
				url: 'https://myp0.com',
				name: 'MyP0',
				description:
					'A personal productivity app that keeps your data in your Google account. No servers, no tracking, fully open source.',
				publisher: { '@id': 'https://myp0.com/#organization' }
			},
			{
				'@type': 'Organization',
				'@id': 'https://myp0.com/#organization',
				name: 'MyP0',
				url: 'https://myp0.com',
				logo: { '@type': 'ImageObject', url: 'https://myp0.com/icon-512.png' },
				sameAs: ['https://github.com/MyP0/MyP0-web']
			},
			{
				'@type': 'SoftwareApplication',
				name: 'MyP0',
				url: 'https://myp0.com',
				applicationCategory: 'ProductivityApplication',
				operatingSystem: 'Web, Android, iOS',
				offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
				description:
					'A personal productivity app that stores everything in your Google account. Tasks, notes, and calendar unified in one privacy-first interface.',
				featureList: [
					'Google Calendar integration',
					'Google Tasks management',
					'Block editor with Google Drive sync',
					'Offline-first with IndexedDB',
					'PKCE OAuth - no backend needed',
					'Open source under AGPL-3.0'
				],
				author: { '@id': 'https://myp0.com/#organization' }
			},
			{
				'@type': 'FAQPage',
				mainEntity: faqs.map(([q, a]) => ({
					'@type': 'Question',
					name: q,
					acceptedAnswer: { '@type': 'Answer', text: a }
				}))
			}
		]
	})}</script>`}
</svelte:head>

<div class="min-h-screen bg-bg text-ink">
	<V2Nav showSignIn />

	<!-- §01 — HERO -->
	<section class="mx-auto max-w-[1280px] px-14 pb-24 pt-16">
		<div class="grid grid-cols-12 items-start gap-8">
			<div class="col-span-7">
				<div class="mb-7 flex items-center gap-3 text-[12px] uppercase tracking-[0.08em] text-dim">
					<span class="font-serif text-[13px] italic normal-case tracking-normal text-accent">§ 01</span>
					<span class="block h-px w-7 bg-dim"></span>
					A productivity app, simplified
				</div>
				<h1 class="mb-8 text-[96px] font-semibold leading-[0.98] tracking-[-0.045em]">
					Calendar.<br />
					Notes.<br />
					Tasks.<br />
					<span class="font-serif font-normal italic text-accent">Yours.</span>
				</h1>
				<p class="mb-8 max-w-[560px] text-[19px] leading-[1.5] text-dim">
					Everything stored in your Google account. No servers. No tracking. No compromises — just three
					tools that work in the place you already keep your life.
				</p>
				<div class="mb-7 flex items-center gap-3">
					<a
						href="/app"
						class="rounded-full bg-accent px-[22px] py-3.5 text-[15px] font-medium text-white no-underline"
					>
						Continue with Google
					</a>
					<a
						href="#how"
						class="rounded-full border border-rule bg-transparent px-[22px] py-3.5 text-[15px] font-medium text-ink no-underline"
					>
						How it works →
					</a>
				</div>
			</div>

			<!-- Right: stacked rotated preview cards -->
			<div class="relative col-span-5 h-[480px]">
				<div
					class="absolute left-0 right-4 top-3 rounded-[14px] border border-rule bg-panel p-[22px]"
					style="transform:rotate(-1.5deg)"
				>
					<div class="mb-2.5 text-[11px] tracking-[0.06em] text-dim">WEDNESDAY · APR 29</div>
					<div class="text-[13px] leading-[1.7] text-ink">
						<div class="flex justify-between"><span>Design sync</span><span class="text-dim">10:30</span></div>
						<div class="flex justify-between"><span>Lunch</span><span class="text-dim">12:00</span></div>
						<div class="flex justify-between font-medium text-accent"><span>1:1 Marta</span><span>14:00</span></div>
						<div class="flex justify-between"><span>Inbox zero</span><span class="text-dim">16:00</span></div>
					</div>
				</div>

				<div
					class="absolute left-8 right-0 top-[160px] rounded-[14px] border border-rule bg-panel p-[22px]"
					style="box-shadow:0 12px 40px -16px rgba(0,0,0,0.12)"
				>
					<div class="mb-2.5 text-[11px] tracking-[0.06em] text-dim">NOTE · MEMO 0421</div>
					<div class="mb-2.5 font-serif text-[19px] leading-[1.4] text-ink">
						The file is the database.
					</div>
					<div class="text-[13px] leading-[1.6] text-dim">
						Removed the server. There's nothing to migrate — it's already on Drive. We treat your Drive
						folder as the source of truth, and sync from there.
					</div>
				</div>

				<div
					class="absolute left-2 right-7 top-[340px] rounded-[14px] bg-ink p-[18px] text-bg"
					style="transform:rotate(1deg)"
				>
					<div class="mb-2.5 text-[11px] tracking-[0.06em]" style="color:rgba(255,255,255,0.5)">
						TASKS · 4 OPEN
					</div>
					<div class="text-[13px] leading-[1.9]">
						<div>○ Ship redesign RFC</div>
						<div>○ Reply to Ben re: API keys</div>
						<div style="color:rgba(255,255,255,0.4);text-decoration:line-through">● Review PR #482</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- STAT BAND -->
	<div class="grid grid-cols-4 border-y border-rule bg-panel">
		{#each stats as c, i}
			<div class="px-8 py-7 {i ? 'border-l border-rule' : ''}">
				<div class="mb-2 text-[11px] uppercase tracking-[0.08em] text-dim">{c.k}</div>
				<div class="font-serif text-[32px] font-normal leading-none">{c.v}</div>
			</div>
		{/each}
	</div>

	<!-- §02 — PREMISE -->
	<section id="privacy" class="border-t border-rule px-14 py-[88px]">
		<div class="mx-auto max-w-[1280px]">
			<div class="mb-9 flex items-center gap-3 text-[12px] uppercase tracking-[0.08em] text-dim">
				<span class="font-serif text-[13px] italic normal-case tracking-normal text-accent">§ 02</span>
				<span class="block h-px w-7 bg-dim"></span>
				The premise
			</div>
			<div class="grid grid-cols-12 items-start gap-8">
				<h2 class="col-span-7 m-0 font-serif text-[56px] font-normal leading-[1.05] tracking-[-0.02em]">
					Most apps treat your data <span class="italic text-accent">like inventory</span>. We treat it
					like correspondence — yours to keep, fold, mark up, and file.
				</h2>
				<div class="col-span-4 col-start-9 text-[16px] leading-[1.6] text-dim">
					<p class="mb-4">
						MyP0 is a calendar, a notes app, and a task list — sharing one quiet idea: software shouldn't
						keep what isn't its own.
					</p>
					<p>
						Everything you write, schedule, or check off lives as plain files on your Drive. No private
						database. No vendor copy. If we vanish tomorrow, you still have everything.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- §03 — PILLARS -->
	<section id="how-it-works" class="border-t border-rule px-14 py-[88px]">
		<div class="mx-auto max-w-[1280px]">
			<div class="mb-9 flex items-center gap-3 text-[12px] uppercase tracking-[0.08em] text-dim">
				<span class="font-serif text-[13px] italic normal-case tracking-normal text-accent">§ 03</span>
				<span class="block h-px w-7 bg-dim"></span>
				Three tools, one folder
			</div>
			<div class="grid grid-cols-3 gap-8">
				{#each pillars as p}
					<div class="flex min-h-[360px] flex-col gap-4 rounded border border-rule bg-panel p-7">
						<div class="flex items-baseline justify-between">
							<span class="font-serif text-[22px] italic text-accent">{p.n}.</span>
							<span class="text-[11px] tracking-[0.08em] text-dim">TOOL</span>
						</div>
						<h3 class="m-0 font-serif text-[36px] font-normal tracking-[-0.02em]">{p.title}</h3>
						<div class="font-serif text-[17px] italic text-ink">{p.lede}</div>
						<div class="flex-1 text-[14px] leading-[1.6] text-dim">{p.body}</div>
						<ul class="m-0 flex list-none flex-col gap-1.5 border-t border-rule p-0 pt-4">
							{#each p.bullets as b}
								<li class="flex gap-2.5 text-[13px] text-ink">
									<span class="text-accent">—</span>{b}
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- §04 — FILE IS DATABASE -->
	<section id="how" class="border-t border-rule px-14 py-[88px]">
		<div class="mx-auto max-w-[1280px]">
			<div class="mb-9 flex items-center gap-3 text-[12px] uppercase tracking-[0.08em] text-dim">
				<span class="font-serif text-[13px] italic normal-case tracking-normal text-accent">§ 04</span>
				<span class="block h-px w-7 bg-dim"></span>
				The file is the database
			</div>
			<div class="grid grid-cols-12 items-start gap-8">
				<div class="col-span-5">
					<h2 class="mb-6 text-[48px] font-semibold leading-[1.05] tracking-[-0.035em]">
						We removed the server.
					</h2>
					<p class="mb-4 text-[16px] leading-[1.6] text-dim">
						Most productivity apps own a copy of your data. They sync, they backup, they "respect privacy"
						— but the canonical version lives on their machines. Yours is the cache.
					</p>
					<p class="mb-6 text-[16px] leading-[1.6] text-dim">
						MyP0 inverts that. Your Drive folder <em class="font-serif">is</em> the canonical version.
						The app is a window onto it.
					</p>
					<ul class="m-0 flex list-none flex-col gap-3.5 p-0">
						{#each ledger as [k, v]}
							<li class="grid grid-cols-[160px_1fr] gap-4 border-b border-rule pb-3.5">
								<span class="font-serif text-[16px] italic text-accent">{k}</span>
								<span class="text-[14px] leading-[1.5] text-ink">{v}</span>
							</li>
						{/each}
					</ul>
				</div>

				<div class="col-span-6 col-start-7">
					<div class="overflow-hidden rounded-md border border-rule bg-panel">
						<div class="flex items-center gap-2 border-b border-rule px-4 py-3 text-[12px] text-dim">
							<span class="block h-2.5 w-2.5 rounded-full bg-rule"></span>
							<span class="block h-2.5 w-2.5 rounded-full bg-rule"></span>
							<span class="block h-2.5 w-2.5 rounded-full bg-rule"></span>
							<span class="ml-3">~/Drive/MyP0</span>
						</div>
						<div
							class="px-6 py-5 text-[13px] leading-[1.85] text-ink"
							style="font-family:ui-monospace, SFMono-Regular, monospace"
						>
							<div class="text-dim">📁 MyP0/</div>
							<div class="pl-5">📁 calendar/</div>
							<div class="pl-10 text-dim">2026-04-29.ics</div>
							<div class="pl-10 text-dim">2026-04-30.ics</div>
							<div class="pl-5">📁 notes/</div>
							<div class="pl-10">memo-0421.md <span class="text-accent">← editing</span></div>
							<div class="pl-10 text-dim">weekly-review.md</div>
							<div class="pl-10 text-dim">q2-okrs.md</div>
							<div class="pl-5">📁 tasks/</div>
							<div class="pl-10 text-dim">open.md</div>
							<div class="pl-10 text-dim">archive/</div>
							<div class="pl-5 text-dim">config.json</div>
						</div>
					</div>
					<div class="mt-4 rounded-md border border-accent bg-accent-soft px-[18px] py-3.5 text-[13px] leading-[1.5] text-ink">
						<span class="font-serif italic text-accent">Tip — </span>
						Open <code style="font-family:ui-monospace, monospace">memo-0421.md</code> in any editor.
						Save. The change shows up in MyP0 within a beat.
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- §05 — TRANSPARENCY -->
	<section id="transparency" class="border-t border-rule px-14 py-[88px]">
		<div class="mx-auto max-w-[1280px]">
			<div class="mb-9 flex items-center gap-3 text-[12px] uppercase tracking-[0.08em] text-dim">
				<span class="font-serif text-[13px] italic normal-case tracking-normal text-accent">§ 05</span>
				<span class="block h-px w-7 bg-dim"></span>
				Transparency
			</div>
			<div class="grid grid-cols-12 items-start gap-8">
				<div class="col-span-5">
					<h2 class="mb-6 text-[48px] font-semibold leading-[1.05] tracking-[-0.035em]">
						Open.<br />
						<span class="font-serif text-[44px] font-normal italic text-accent">Yours to fork.</span>
					</h2>
					<p class="mb-4 max-w-[460px] text-[16px] leading-[1.6] text-dim">
						MyP0 is AGPL-licensed and lives on GitHub. Audit the code, run it yourself, fork it the day
						we lose interest — the app belongs to whoever is willing to maintain the folder.
					</p>
					<p class="mb-7 max-w-[460px] text-[16px] leading-[1.6] text-dim">
						We don't host your data, so we don't charge for hosting. The price is whatever your
						conscience tells you to send by postcard.
					</p>
					<div class="flex items-center gap-3">
						<a
							href="https://github.com/MyP0/MyP0-web"
							target="_blank"
							rel="noopener noreferrer"
							class="rounded-full bg-ink px-[18px] py-3 text-[14px] font-medium text-bg no-underline"
						>
							View on GitHub →
						</a>
						<a
							href="https://github.com/MyP0/MyP0-web/blob/main/LICENSE"
							target="_blank"
							rel="noopener noreferrer"
							class="rounded-full border border-rule bg-transparent px-[18px] py-3 text-[14px] font-medium text-ink no-underline"
						>
							Read the licence
						</a>
					</div>
				</div>

				<div class="col-span-6 col-start-7">
					<!-- Repo card, in the style of the §04 file-tree window -->
					<div class="overflow-hidden rounded-md border border-rule bg-panel">
						<div
							class="flex items-center gap-2 border-b border-rule px-4 py-3 text-[12px] text-dim"
						>
							<span class="block h-2.5 w-2.5 rounded-full bg-rule"></span>
							<span class="block h-2.5 w-2.5 rounded-full bg-rule"></span>
							<span class="block h-2.5 w-2.5 rounded-full bg-rule"></span>
							<span class="ml-3">github.com/MyP0/MyP0-web</span>
							<span class="ml-auto font-serif italic text-accent">AGPL-3.0</span>
						</div>

						<div
							class="grid grid-cols-3 border-b border-rule"
						>
							{#each [{ k: 'Commits', v: fmtCount(repoStats.commits) }, { k: 'Pull requests', v: fmtCount(repoStats.prs) }, { k: 'Open issues', v: fmtCount(repoStats.issues) }] as s, i}
								<div class="px-5 py-4 {i ? 'border-l border-rule' : ''}">
									<div class="mb-1 text-[11px] uppercase tracking-[0.08em] text-dim">{s.k}</div>
									<div class="font-serif text-[22px] font-normal leading-none">{s.v}</div>
								</div>
							{/each}
						</div>

						<div
							class="px-6 py-5 text-[13px] leading-[1.85] text-ink"
							style="font-family:ui-monospace, SFMono-Regular, monospace"
						>
							<div class="text-dim">$ git clone https://github.com/MyP0/MyP0-web</div>
							<div class="text-dim">$ cd MyP0-web &amp;&amp; npm install &amp;&amp; npm run dev</div>
							<div class="text-accent">→ http://localhost:5173</div>
						</div>

						<div class="border-t border-rule px-6 py-4 text-[12px] leading-[1.6] text-dim">
							Latest commit ·
							<span class="font-serif italic text-accent">add anchored conversation cards</span>
							· 2 days ago
						</div>
					</div>

					<div
						class="mt-4 rounded-md border border-accent bg-accent-soft px-[18px] py-3.5 text-[13px] leading-[1.5] text-ink"
					>
						<span class="font-serif italic text-accent">Why open — </span>
						An app that holds your calendar, notes, and tasks should be auditable. If we go quiet, you
						(or anyone) can keep the folder useful.
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- §06 — FAQ -->
	<section id="faq" class="border-t border-rule px-14 py-[88px]">
		<div class="mx-auto max-w-[1280px]">
			<div class="mb-9 flex items-center gap-3 text-[12px] uppercase tracking-[0.08em] text-dim">
				<span class="font-serif text-[13px] italic normal-case tracking-normal text-accent">§ 06</span>
				<span class="block h-px w-7 bg-dim"></span>
				Things people ask
			</div>
			<div class="grid grid-cols-12 items-start gap-8">
				<h2 class="col-span-4 m-0 font-serif text-[44px] font-normal leading-[1.1] tracking-[-0.02em]">
					A few <span class="italic text-accent">predictable</span> questions.
				</h2>
				<div class="col-span-7 col-start-6">
					{#each faqs as [q, a], i}
						<details
							open={i === 0}
							class="border-rule py-5 [&>summary::-webkit-details-marker]:hidden {i === 0
								? 'border-t border-ink'
								: 'border-t'}"
						>
							<summary
								class="flex cursor-pointer items-center justify-between text-[18px] font-medium text-ink [list-style:none]"
							>
								<span>{q}</span>
								<span class="font-serif text-[22px] italic text-accent">+</span>
							</summary>
							<p class="m-0 mt-3 max-w-[620px] text-[15px] leading-[1.6] text-dim">{a}</p>
						</details>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- FINAL CTA -->
	<section class="bg-ink px-14 py-[120px] text-bg">
		<div class="mx-auto max-w-[880px] text-center">
			<div class="mb-7 text-[12px] uppercase tracking-[0.08em]" style="color:rgba(255,255,255,0.5)">
				⎯⎯⎯ Coda
			</div>
			<h2 class="mb-6 text-[80px] font-semibold leading-[1] tracking-[-0.04em]">
				Three tools.<br />
				<span class="font-serif font-normal italic text-accent">One folder.</span>
			</h2>
			<p
				class="mx-auto mb-9 max-w-[520px] text-[18px] leading-[1.5]"
				style="color:rgba(255,255,255,0.7)"
			>
				Sign in with Google. Pick a folder. Start writing things down.
			</p>
			<div class="flex justify-center gap-3">
				<a
					href="/app"
					class="rounded-full bg-accent px-7 py-4 text-[16px] font-medium text-white no-underline"
				>
					Continue with Google
				</a>
				<a
					href="/blog"
					class="rounded-full border bg-transparent px-7 py-4 text-[16px] font-medium text-bg no-underline"
					style="border-color:rgba(255,255,255,0.3)"
				>
					Read the blog
				</a>
			</div>
		</div>
	</section>

	<V2Footer />
</div>
