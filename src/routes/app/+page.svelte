<script lang="ts">
	import { onMount } from 'svelte';
	import V2Logo from '$lib/components/V2Logo.svelte';
	import { authStore, signIn, signOut } from '$lib/google/auth';
	import { fetchCalendarEvents } from '$lib/google/calendar';

	type Event = {
		t: string;
		dur: string;
		label: string;
		dim?: boolean;
		accent?: boolean;
	};

	type Comment = {
		who: string;
		initials: string;
		when: string;
		body: string;
		self?: boolean;
	};

	type Task = {
		id: string;
		l: string;
		tag: string;
		active?: boolean;
		done?: boolean;
		comments: Comment[];
	};

	type Group = { date: string; tasks: Task[] };
	type Row = { kind: 'date'; label: string } | { kind: 'task'; task: Task };

	// Notion-style pastel tag palette — extremely desaturated, low-contrast.
	type TagSwatch = { bg: string; text: string };
	const tagColors: Record<string, TagSwatch> = {
		P0: { bg: '#fbe4e4', text: '#a82828' },
		Inbox: { bg: '#ebf3f8', text: '#0b6e99' },
		Mgmt: { bg: '#eee5f4', text: '#6940a5' }
	};
	const tagDefault: TagSwatch = { bg: '#f1f0ed', text: '#6b6962' };
	const tagOf = (t: string): TagSwatch => tagColors[t] ?? tagDefault;

	// Pastel "selected" surface — lifted from Notion's row-hover treatment.
	const selBg = '#f1f0ed';
	const selBorder = '#cfcdc7';
	const accentBlueBg = '#ebf3f8';
	const accentBlueText = '#0b6e99';
	const accentBlueBorder = '#bcd6e6';

	const sampleEvents: Event[] = [
		{ t: '09:00', dur: '30m', label: 'Morning review' },
		{ t: '10:30', dur: '1h', label: 'Design sync — Figma deep-dive' },
		{ t: '12:00', dur: '1h', label: 'Lunch / walk', dim: true },
		{ t: '14:00', dur: '1h', label: '1:1 Marta', accent: true },
		{ t: '16:00', dur: '30m', label: 'Inbox zero' }
	];

	let auth = $state($authStore);
	let events = $state<Event[]>(sampleEvents);
	let showMenu = $state(false);

	function formatHM(d: Date): string {
		return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
	}

	function formatDuration(start: Date, end: Date): string {
		const mins = Math.round((end.getTime() - start.getTime()) / 60000);
		if (mins < 60) return `${mins}m`;
		const h = Math.floor(mins / 60);
		const m = mins % 60;
		return m === 0 ? `${h}h` : `${h}h ${m}m`;
	}

	onMount(() => {
		const unsub = authStore.subscribe(async (v) => {
			auth = v;
			if (v.isSignedIn) {
				const today = new Date();
				const fetched = await fetchCalendarEvents(today);
				const timed = fetched.filter((e) => !e.allDay);
				if (timed.length > 0) {
					events = timed.map((e) => ({
						t: formatHM(e.start),
						dur: formatDuration(e.start, e.end),
						label: e.title
					}));
				} else {
					events = [];
				}
			} else if (!v.loading) {
				events = sampleEvents;
			}
		});
		return unsub;
	});

	function closeMenu() {
		if (showMenu) showMenu = false;
	}

	const groups: Group[] = [
		{
			date: 'Wednesday, April 29',
			tasks: [
				{
					id: 't1',
					l: 'Ship redesign RFC draft',
					tag: 'P0',
					active: true,
					comments: [
						{
							who: 'Marta',
							initials: 'MA',
							when: '11:42',
							body: 'Pushed the new auth flow to staging — give it a spin?'
						},
						{
							who: 'You',
							initials: 'EM',
							when: '11:08',
							body: '@marta does this also cover the offline state?',
							self: true
						},
						{
							who: 'Ben',
							initials: 'BD',
							when: '09:31',
							body: 'I can grab the keys after the design sync. Blocking?'
						}
					]
				},
				{
					id: 't2',
					l: 'Reply to Ben re: API keys',
					tag: 'Inbox',
					comments: [
						{ who: 'Ben', initials: 'BD', when: '08:14', body: "Keys are in 1pw under 'p0/staging'." }
					]
				},
				{ id: 't3', l: 'Audit Drive permissions', tag: 'P0', comments: [] }
			]
		},
		{
			date: 'Tuesday, April 28',
			tasks: [
				{
					id: 't4',
					l: 'Review PR #482',
					tag: 'P0',
					done: true,
					comments: [
						{
							who: 'Marta',
							initials: 'MA',
							when: 'Mon',
							body: 'LGTM — small nit on the boundary, otherwise ship.'
						}
					]
				},
				{ id: 't5', l: 'Outline Q2 review', tag: 'Mgmt', comments: [] }
			]
		}
	];

	const ROW_H_TASK = 44;
	const ROW_H_DATE = 44;

	const rows: Row[] = [];
	for (const g of groups) {
		rows.push({ kind: 'date', label: g.date });
		for (const t of g.tasks) rows.push({ kind: 'task', task: t });
	}

	const taskY: Record<string, number> = {};
	{
		let y = 16;
		for (const r of rows) {
			if (r.kind === 'date') {
				y += ROW_H_DATE;
			} else {
				taskY[r.task.id] = y;
				y += ROW_H_TASK;
			}
		}
	}

	const minColHeight = (() => {
		let y = 16;
		for (const r of rows) y += r.kind === 'date' ? ROW_H_DATE : ROW_H_TASK;
		return y + 60;
	})();

	const ticks = Array.from({ length: 28 });

	// Hover/click pinning: comment stacks belonging to different tasks
	// overlap each other — bring the focused task's stack to the front.
	const initialActive =
		rows.find((r): r is Extract<Row, { kind: 'task' }> => r.kind === 'task' && !!r.task.active)
			?.task.id ?? null;
	let pinnedId: string | null = $state(initialActive);
	let hoveredId: string | null = $state(null);
	const activeId = $derived(hoveredId ?? pinnedId);
</script>

<svelte:head>
	<title>Today · MyP0</title>
</svelte:head>

<svelte:window onclick={closeMenu} />

<div class="flex h-screen flex-col bg-bg text-ink">
	<!-- Top bar -->
	<div class="flex items-center justify-between border-b border-rule px-[22px] py-3.5">
		<div class="flex items-center gap-2.5">
			<V2Logo wordmark={false} />
			<span class="text-[15px] font-semibold tracking-[-0.02em]">MyP0</span>
			<span class="ml-3 text-[13px] text-dim">Wednesday · April 29, 2026</span>
		</div>
		<div class="flex items-center gap-3">
			<div
				class="w-[220px] rounded-full border border-rule bg-panel px-3 py-1.5 text-[12px] text-dim"
			>
				Search… <span class="float-right">⌘K</span>
			</div>
			<button
				class="rounded-full bg-ink px-3.5 py-1.5 text-[13px] text-bg transition-opacity hover:opacity-90"
			>
				+ New
			</button>
			{#if auth.loading}
				<span
					class="inline-flex h-7 w-7 animate-pulse items-center justify-center rounded-full"
					style="background:{accentBlueBg}"
				></span>
			{:else if auth.isSignedIn && auth.user}
				<div class="relative">
					<button
						class="inline-flex h-7 w-7 items-center justify-center overflow-hidden rounded-full text-[11px] font-semibold"
						aria-label="Account menu"
						onclick={(e) => { e.stopPropagation(); showMenu = !showMenu; }}
					>
						{#if auth.user.picture}
							<img
								src={auth.user.picture}
								alt={auth.user.name}
								class="h-7 w-7 rounded-full"
								referrerpolicy="no-referrer"
							/>
						{:else}
							<span
								class="inline-flex h-7 w-7 items-center justify-center"
								style="background:{accentBlueBg};color:{accentBlueText}"
							>
								{auth.user.name.slice(0, 2).toUpperCase()}
							</span>
						{/if}
					</button>
					{#if showMenu}
						<div
							class="absolute right-0 top-full z-50 mt-1 w-56 rounded-lg border border-rule bg-panel py-1 shadow-lg"
							onclick={(e) => e.stopPropagation()}
							role="menu"
							tabindex="-1"
						>
							<div class="border-b border-rule px-3 py-2">
								<p class="text-[13px] font-medium text-ink">{auth.user.name}</p>
								<p class="text-[11px] text-dim">{auth.user.email}</p>
							</div>
							<button
								class="w-full px-3 py-2 text-left text-[13px] text-ink hover:bg-bg"
								onclick={() => { showMenu = false; signOut(); }}
							>
								Sign out
							</button>
						</div>
					{/if}
				</div>
			{:else}
				<button
					class="flex items-center gap-2 rounded-full border border-rule px-3 py-1.5 text-[13px] text-ink transition-colors hover:bg-panel"
					onclick={() => signIn()}
				>
					<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
						<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
						<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
						<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
						<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
					</svg>
					Sign in
				</button>
			{/if}
		</div>
	</div>

	<!-- Body grid: calendar | (tasks + comments) -->
	<div class="grid min-h-0 flex-1 grid-cols-[320px_1fr]">
		<!-- Schedule -->
		<section class="flex min-h-0 flex-col border-r border-rule bg-bg">
			<div
				class="border-b border-rule px-[22px] py-3.5 text-[11px] uppercase tracking-[0.06em] text-dim"
			>
				Schedule · Today
			</div>
			<div class="flex-1 overflow-auto px-[22px] py-2">
				{#if events.length === 0}
					<div class="py-8 text-center text-[12px] text-dim">No events today.</div>
				{/if}
				{#each events as e}
					<div class="grid grid-cols-[52px_1fr] gap-3.5 border-b border-rule py-3">
						<div class="pt-0.5 text-[12px] tabular-nums text-dim">{e.t}</div>
						{#if e.accent}
							<div
								class="rounded-md border-l-2 px-3 py-2"
								style="background:{accentBlueBg};border-color:{accentBlueText}"
							>
								<div class="text-[14px] font-medium text-ink">{e.label}</div>
								<div class="mt-0.5 text-[12px] text-dim">{e.dur}</div>
							</div>
						{:else}
							<div class="border-l-2 border-rule pl-3">
								<div class="text-[14px] {e.dim ? 'text-dim' : 'text-ink'}">{e.label}</div>
								<div class="mt-0.5 text-[12px] text-dim">{e.dur}</div>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</section>

		<!-- Tasks + anchored comments — shared bg, no separator -->
		<section class="relative grid min-h-0 grid-cols-[1.05fr_1fr] bg-bg">
			<!-- Tasks column -->
			<div class="relative overflow-auto">
				<div
					class="sticky top-0 z-10 flex justify-between border-b border-rule bg-bg px-[22px] py-3.5 text-[11px] uppercase tracking-[0.06em] text-dim"
				>
					<span>Tasks</span><span>5 open · 1 done</span>
				</div>
				{#each rows as r}
					{#if r.kind === 'date'}
						<div
							class="px-[22px] pb-1.5 pt-5 font-serif text-[16px] italic text-dim"
							style="height:{ROW_H_DATE}px"
						>
							@{r.label}
						</div>
					{:else}
						{@const isActive = activeId === r.task.id}
						{@const swatch = tagOf(r.task.tag)}
						<button
							type="button"
							class="flex w-full cursor-pointer items-center gap-2.5 border-l-2 px-[22px] text-left transition-colors"
							style="height:{ROW_H_TASK}px;background:{isActive
								? selBg
								: 'transparent'};border-left-color:{isActive ? selBorder : 'transparent'}"
							onmouseenter={() => (hoveredId = r.task.id)}
							onmouseleave={() => (hoveredId = null)}
							onfocus={() => (hoveredId = r.task.id)}
							onblur={() => (hoveredId = null)}
							onclick={() => (pinnedId = r.task.id)}
						>
							<span
								class="h-3.5 w-3.5 flex-shrink-0 rounded-full border {r.task.done
									? 'border-faint bg-faint'
									: 'border-rule bg-transparent'}"
							></span>
							<span
								class="flex-1 text-[14px] {r.task.done
									? 'text-dim line-through'
									: 'text-ink'} {isActive ? 'font-medium' : ''}"
							>
								{r.task.l}
							</span>
							<span
								class="rounded-md px-2 py-0.5 text-[11px]"
								style="background:{swatch.bg};color:{swatch.text}"
							>
								{r.task.tag}
							</span>
							{#if r.task.comments.length > 0}
								<span class="text-[11px] text-faint">● {r.task.comments.length}</span>
							{/if}
						</button>
					{/if}
				{/each}
			</div>

			<!-- Comment cards anchored to their tasks -->
			<div class="relative overflow-hidden bg-bg">
				<div class="relative" style="min-height:{minColHeight}px">
					{#each rows as r}
						{#if r.kind === 'task' && r.task.comments.length}
							{@const isActive = activeId === r.task.id}
							<div
								class="absolute left-[18px] right-[18px] flex flex-col gap-1.5 transition-all duration-150"
								style="top:{taskY[r.task.id] - 6}px;z-index:{isActive ? 30 : 1}"
								onmouseenter={() => (hoveredId = r.task.id)}
								onmouseleave={() => (hoveredId = null)}
								role="presentation"
							>
								{#each r.task.comments as c}
									<div
										class="flex gap-2.5 rounded-lg border bg-panel px-3 py-2 transition-shadow"
										style="border-color:{isActive
											? selBorder
											: 'var(--rule)'};box-shadow:{isActive
											? '0 8px 24px -10px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.05)'
											: '0 1px 2px rgba(0,0,0,0.03)'}"
									>
										<span
											class="inline-flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full border border-rule text-[10px] font-semibold"
											style={c.self
												? `background:${accentBlueBg};color:${accentBlueText};border-color:${accentBlueBorder}`
												: 'background:#f1f0ed;color:#1d1c19'}
										>
											{c.initials}
										</span>
										<div class="min-w-0 flex-1">
											<div class="mb-px flex items-baseline gap-2">
												<span class="text-[12px] font-semibold">{c.who}</span>
												<span class="text-[11px] text-dim">{c.when}</span>
											</div>
											<div class="text-[12.5px] leading-[1.4] text-ink">{c.body}</div>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					{/each}
				</div>

				<!-- Mini ticks rail -->
				<div class="absolute bottom-2 right-1.5 top-2 flex w-1 flex-col gap-0.5 opacity-50">
					{#each ticks as _}
						<div class="h-[3px] bg-rule"></div>
					{/each}
				</div>
			</div>
		</section>
	</div>
</div>

<style>
	:global(:root) {
		--rule: #dfdcd2;
	}
</style>
