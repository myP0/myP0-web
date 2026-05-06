<script lang="ts">
	import V2Logo from '$lib/components/V2Logo.svelte';

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

	const events: Event[] = [
		{ t: '09:00', dur: '30m', label: 'Morning review' },
		{ t: '10:30', dur: '1h', label: 'Design sync — Figma deep-dive' },
		{ t: '12:00', dur: '1h', label: 'Lunch / walk', dim: true },
		{ t: '14:00', dur: '1h', label: '1:1 Marta', accent: true },
		{ t: '16:00', dur: '30m', label: 'Inbox zero' }
	];

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
</script>

<svelte:head>
	<title>Today · MyP0</title>
</svelte:head>

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
			<span
				class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent-soft text-[11px] font-semibold text-accent"
			>
				EM
			</span>
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
				{#each events as e}
					<div class="grid grid-cols-[52px_1fr] gap-3.5 border-b border-rule py-3">
						<div class="pt-0.5 text-[12px] tabular-nums text-dim">{e.t}</div>
						{#if e.accent}
							<div class="rounded-md border-l-2 border-accent bg-accent-soft px-3 py-2">
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
						<div
							class="flex cursor-pointer items-center gap-2.5 px-[22px] {r.task.active
								? 'border-l-2 border-accent bg-accent-soft'
								: 'border-l-2 border-transparent'}"
							style="height:{ROW_H_TASK}px"
						>
							<span
								class="h-3.5 w-3.5 flex-shrink-0 rounded-full border {r.task.done
									? 'border-accent bg-accent'
									: 'border-rule bg-transparent'}"
							></span>
							<span
								class="flex-1 text-[14px] {r.task.done
									? 'text-dim line-through'
									: 'text-ink'} {r.task.active ? 'font-medium' : ''}"
							>
								{r.task.l}
							</span>
							<span
								class="rounded-full border border-rule bg-bg px-2 py-0.5 text-[11px] text-dim"
							>
								{r.task.tag}
							</span>
							{#if r.task.comments.length > 0}
								<span class="text-[11px] text-accent">● {r.task.comments.length}</span>
							{/if}
						</div>
					{/if}
				{/each}
			</div>

			<!-- Comment cards anchored to their tasks -->
			<div class="relative overflow-hidden bg-bg">
				<div class="relative" style="min-height:{minColHeight}px">
					{#each rows as r}
						{#if r.kind === 'task' && r.task.comments.length}
							<div
								class="absolute left-[18px] right-[18px] flex flex-col gap-1.5"
								style="top:{taskY[r.task.id] - 6}px"
							>
								{#each r.task.comments as c}
									<div
										class="flex gap-2.5 rounded-lg border border-rule bg-panel px-3 py-2"
										style="box-shadow:0 1px 2px rgba(0,0,0,0.03)"
									>
										<span
											class="inline-flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full border border-rule text-[10px] font-semibold {c.self
												? 'bg-accent text-white'
												: 'bg-bg text-ink'}"
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
				<div
					class="absolute bottom-2 right-1.5 top-2 flex w-1 flex-col gap-0.5 opacity-50"
				>
					{#each ticks as _}
						<div class="h-[3px] bg-rule"></div>
					{/each}
				</div>
			</div>
		</section>
	</div>
</div>
