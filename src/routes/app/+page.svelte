<svelte:head>
	<title>Dashboard - myP0</title>
</svelte:head>

<script lang="ts">
	// Sample data — will be replaced by Google API data
	const today = new Date();
	const dayName = today.toLocaleDateString('en-US', { weekday: 'short' });
	const dayMonth = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

	let calendarEvents = $state([
		{ id: 1, title: 'Coffee with Carla', start: 9, duration: 1, color: 'amber', location: 'Blue Bottle Coffee' },
		{ id: 2, title: 'Review Q3 Budget', start: 10, duration: 1.5, color: 'blue', location: 'Room 4B' },
		{ id: 3, title: 'Lunch with Sales Team', start: 12, duration: 1, color: 'emerald', location: '' },
		{ id: 4, title: 'Design Review', start: 14, duration: 1, color: 'violet', location: 'Figma' },
		{ id: 5, title: 'Wrap-up & Planning', start: 16, duration: 0.5, color: 'zinc', location: '' }
	]);

	const hours = Array.from({ length: 12 }, (_, i) => i + 7); // 7 AM – 6 PM
	const HOUR_HEIGHT = 60; // px per hour
	const GRID_START = 7; // 7 AM

	const currentHour = today.getHours();
	const currentMinute = today.getMinutes();
	const currentTimeOffset = currentHour + currentMinute / 60;

	function getColorClasses(color: string) {
		const map: Record<string, string> = {
			amber: 'bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200',
			blue: 'bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200',
			emerald: 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200',
			violet: 'bg-violet-100 dark:bg-violet-900/40 border-violet-300 dark:border-violet-700 text-violet-900 dark:text-violet-200',
			zinc: 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 text-zinc-800 dark:text-zinc-200'
		};
		return map[color] || map.zinc;
	}

	// Overlap detection: group events into columns
	function getEventColumns(events: typeof calendarEvents) {
		const sorted = [...events].sort((a, b) => a.start - b.start || b.duration - a.duration);
		const columns: { event: typeof events[0]; col: number; totalCols: number }[] = [];
		const active: { event: typeof events[0]; col: number; end: number }[] = [];

		for (const event of sorted) {
			// Remove events that have ended
			const stillActive = active.filter(a => a.end > event.start);
			active.length = 0;
			active.push(...stillActive);

			// Find first available column
			const usedCols = new Set(active.map(a => a.col));
			let col = 0;
			while (usedCols.has(col)) col++;

			const entry = { event, col, end: event.start + event.duration };
			active.push(entry);
			columns.push({ event, col, totalCols: 0 });
		}

		// Second pass: calculate totalCols for each group of overlapping events
		for (let i = 0; i < columns.length; i++) {
			const ev = columns[i].event;
			const overlapping = columns.filter(c => {
				const cEnd = c.event.start + c.event.duration;
				const evEnd = ev.start + ev.duration;
				return c.event.start < evEnd && cEnd > ev.start;
			});
			const maxCol = Math.max(...overlapping.map(c => c.col)) + 1;
			for (const o of overlapping) {
				o.totalCols = Math.max(o.totalCols, maxCol);
			}
		}

		return columns;
	}

	// Drag state
	let dragType = $state<'move' | 'resize' | null>(null);
	let dragEventId = $state<number | null>(null);
	let dragStartY = $state(0);
	let dragOriginalStart = $state(0);
	let dragOriginalDuration = $state(0);

	function onEventMouseDown(e: MouseEvent, eventId: number, type: 'move' | 'resize') {
		e.preventDefault();
		e.stopPropagation();
		const event = calendarEvents.find(ev => ev.id === eventId);
		if (!event) return;

		dragType = type;
		dragEventId = eventId;
		dragStartY = e.clientY;
		dragOriginalStart = event.start;
		dragOriginalDuration = event.duration;

		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('mouseup', onMouseUp);
	}

	function onMouseMove(e: MouseEvent) {
		if (dragEventId === null || !dragType) return;
		const deltaY = e.clientY - dragStartY;
		const deltaHours = Math.round((deltaY / HOUR_HEIGHT) * 4) / 4; // snap to 15 min

		calendarEvents = calendarEvents.map(ev => {
			if (ev.id !== dragEventId) return ev;
			if (dragType === 'move') {
				const newStart = Math.max(GRID_START, Math.min(18.75, dragOriginalStart + deltaHours));
				return { ...ev, start: newStart };
			} else {
				// resize
				const newDuration = Math.max(0.25, dragOriginalDuration + deltaHours);
				return { ...ev, duration: newDuration };
			}
		});
	}

	function onMouseUp() {
		dragType = null;
		dragEventId = null;
		window.removeEventListener('mousemove', onMouseMove);
		window.removeEventListener('mouseup', onMouseUp);
	}

	function formatTime(hour: number) {
		const h = Math.floor(hour);
		const m = Math.round((hour - h) * 60);
		const period = h >= 12 ? 'PM' : 'AM';
		const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
		return m === 0 ? `${displayH} ${period}` : `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
	}

	// Tasks grouped by date
	let taskGroups = $state([
		{
			label: '@Last Tuesday',
			tasks: [
				{ id: 't1', title: 'Finalize Q3 report draft', done: true, comments: [{ author: 'Emma S.', date: '2d ago', avatar: 'ES', text: 'Looks good! Just one note on the revenue section — can we add the YoY comparison?' }] },
				{ id: 't2', title: 'Update team wiki with onboarding steps', done: false, comments: [] },
				{ id: 't3', title: 'Book travel for SF offsite', done: true, comments: [{ author: 'Travel Bot', date: '2d ago', avatar: 'TB', text: 'Confirmation #AF2849 — SFO arriving 10:32am. Hotel: The Proper.' }] }
			]
		},
		{
			label: '@Last Monday',
			tasks: [
				{ id: 't4', title: 'Review new design mockups from Lina', done: false, comments: [
					{ author: 'Lina K.', date: '3d ago', avatar: 'LK', text: 'Updated the sidebar nav and added the empty states you mentioned. Let me know what you think!' },
					{ author: 'You', date: '3d ago', avatar: 'ME', text: 'Looks great, just a couple tweaks on the spacing.' },
					{ author: 'Lina K.', date: '2d ago', avatar: 'LK', text: 'Done! Updated the Figma file.' }
				] },
				{ id: 't5', title: 'Set up staging environment for v2.1', done: true, comments: [] },
				{ id: 't6', title: 'Write tests for notification service', done: false, comments: [{ author: 'CI Bot', date: '3d ago', avatar: 'CI', text: '3 of 12 tests failing. See run #847 for details.' }] }
			]
		},
		{
			label: '@January 30, 2026',
			tasks: [
				{ id: 't7', title: 'Migrate user preferences to new schema', done: true, comments: [] },
				{ id: 't8', title: 'Draft blog post on data ownership', done: false, comments: [{ author: 'You', date: '2w ago', avatar: 'ME', text: 'Outline done. Need to flesh out the "why Google" section with concrete examples.' }] },
				{ id: 't9', title: 'Fix calendar timezone bug (#281)', done: true, comments: [
					{ author: 'Alex R.', date: '2w ago', avatar: 'AR', text: 'Confirmed fixed on staging. UTC+12 edge case also resolved.' },
					{ author: 'QA Bot', date: '2w ago', avatar: 'QA', text: 'All timezone tests passing.' },
					{ author: 'You', date: '2w ago', avatar: 'ME', text: 'Merged to main.' },
					{ author: 'Deploy Bot', date: '2w ago', avatar: 'DB', text: 'Deployed to production v2.0.14.' }
				] },
				{ id: 't10', title: 'Update dependencies and audit', done: false, comments: [] }
			]
		},
		{
			label: '@January 28, 2026',
			tasks: [
				{ id: 't11', title: 'Prepare sprint retrospective notes', done: true, comments: [] },
				{ id: 't12', title: 'Implement offline sync conflict resolution', done: false, comments: [{ author: 'You', date: '2w ago', avatar: 'ME', text: 'Went with last-write-wins for now. Revisit if users report issues.' }] },
				{ id: 't13', title: 'Send invoice to client', done: true, comments: [{ author: 'Accounting', date: '2w ago', avatar: 'AC', text: 'Payment received. Marked as settled.' }] }
			]
		}
	]);

	function toggleTask(groupIdx: number, taskIdx: number) {
		taskGroups = taskGroups.map((g, gi) => {
			if (gi !== groupIdx) return g;
			return {
				...g,
				tasks: g.tasks.map((t, ti) => {
					if (ti !== taskIdx) return t;
					return { ...t, done: !t.done };
				})
			};
		});
	}

	function updateTaskTitle(groupIdx: number, taskIdx: number, newTitle: string) {
		taskGroups = taskGroups.map((g, gi) => {
			if (gi !== groupIdx) return g;
			return {
				...g,
				tasks: g.tasks.map((t, ti) => {
					if (ti !== taskIdx) return t;
					return { ...t, title: newTitle };
				})
			};
		});
	}

	// Stack card view state
	let expandedStacks = $state<Set<string>>(new Set());

	function toggleStack(taskId: string) {
		const next = new Set(expandedStacks);
		if (next.has(taskId)) {
			next.delete(taskId);
		} else {
			next.add(taskId);
		}
		expandedStacks = next;
	}
</script>

<div class="flex h-full">
	<!-- Section 1: Calendar (independent scroll) -->
	<section class="flex w-[35%] min-w-0 flex-col border-r border-zinc-200 dark:border-zinc-800">
		<!-- Day header -->
		<div class="flex items-center justify-between border-b border-zinc-200 px-4 py-2.5 dark:border-zinc-800">
			<div class="flex items-center gap-3">
				<h2 class="text-sm font-semibold text-zinc-900 dark:text-white">{dayName}, {dayMonth}</h2>
			</div>
			<div class="flex items-center gap-1">
				<button aria-label="Previous day" class="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300">
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
				</button>
				<button aria-label="Next day" class="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300">
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
				</button>
			</div>
		</div>

		<div class="flex-1 overflow-y-auto">
			<!-- Time grid -->
			<div class="relative" style="padding-left: 3rem;">
				{#each hours as hour}
					{@const formatHour = hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
					<div class="relative" style="height: {HOUR_HEIGHT}px;">
						<span class="absolute -left-12 top-0 w-11 text-right text-[11px] text-zinc-400 -translate-y-1/2">{formatHour}</span>
						<div class="absolute inset-x-0 top-0 border-t border-zinc-100 dark:border-zinc-800/50"></div>
					</div>
				{/each}

				<!-- Events layer -->
				<div class="absolute inset-0" style="left: 0; right: 0.5rem;">
					{#each getEventColumns(calendarEvents) as { event, col, totalCols }}
						{@const top = (event.start - GRID_START) * HOUR_HEIGHT}
						{@const height = event.duration * HOUR_HEIGHT}
						{@const width = totalCols > 1 ? `calc(${100 / totalCols}% - 2px)` : 'calc(100% - 2px)'}
						{@const left = totalCols > 1 ? `${(col / totalCols) * 100}%` : '0'}
						<div
							class="absolute rounded-md border px-2 py-1 cursor-grab active:cursor-grabbing select-none {getColorClasses(event.color)} {dragEventId === event.id ? 'opacity-80 shadow-lg z-20' : 'z-10'}"
							style="top: {top}px; height: {height}px; width: {width}; left: {left};"
							role="button"
							tabindex="0"
							onmousedown={(e) => onEventMouseDown(e, event.id, 'move')}
						>
							<div class="text-xs font-medium leading-tight truncate">{event.title}</div>
							{#if event.location && height > 32}
								<div class="mt-0.5 text-[10px] opacity-70 truncate">{event.location}</div>
							{/if}
							{#if height > 20}
								<div class="text-[9px] opacity-50 mt-0.5">{formatTime(event.start)} – {formatTime(event.start + event.duration)}</div>
							{/if}
							<!-- Resize handle -->
							<div
								class="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize rounded-b-md hover:bg-black/5 dark:hover:bg-white/5"
								role="button"
								tabindex="0"
								onmousedown={(e) => onEventMouseDown(e, event.id, 'resize')}
							></div>
						</div>
					{/each}
				</div>

				<!-- Current time indicator -->
				{#if currentHour >= 7 && currentHour <= 18}
					<div
						class="pointer-events-none absolute left-0 right-2 z-30 flex items-center"
						style="top: {(currentTimeOffset - GRID_START) * HOUR_HEIGHT}px;"
					>
						<div class="h-2.5 w-2.5 rounded-full bg-red-500 -ml-1"></div>
						<div class="h-px flex-1 bg-red-500"></div>
					</div>
				{/if}
			</div>
		</div>
	</section>

	<!-- Sections 2+3: Tasks + Updates (co-scroll) -->
	<section class="flex min-w-0 flex-1 flex-col">
		<!-- Header -->
		<div class="flex border-b border-zinc-200 dark:border-zinc-800">
			<div class="flex-1 px-4 py-2.5">
				<h2 class="text-sm font-semibold text-zinc-900 dark:text-white">Tasks / Notes</h2>
			</div>
		</div>

		<!-- Scrollable content (tasks + updates scroll together) -->
		<div class="flex-1 overflow-y-auto">
			{#each taskGroups as group, groupIdx}
				<!-- Date group header -->
				<div class="flex bg-zinc-50/80 dark:bg-zinc-900/50 px-4 py-1.5">
					<span class="text-[11px] font-medium text-zinc-400">{group.label}</span>
				</div>

				<!-- Task rows -->
				{#each group.tasks as task, taskIdx}
					<div class="group flex hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
						<!-- Task cell: compact, no border, checkbox + inline editable text -->
						<div class="flex min-w-0 flex-1 items-center gap-2 px-4 py-1">
							<button
								class="shrink-0 flex items-center justify-center"
								onclick={() => toggleTask(groupIdx, taskIdx)}
							>
								{#if task.done}
									<div class="flex h-4 w-4 items-center justify-center rounded border border-blue-500 bg-blue-500">
										<svg class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
									</div>
								{:else}
									<div class="h-4 w-4 rounded border border-zinc-300 dark:border-zinc-600 hover:border-zinc-400 dark:hover:border-zinc-500"></div>
								{/if}
							</button>
							<input
								type="text"
								class="min-w-0 flex-1 bg-transparent text-sm outline-none {task.done ? 'text-zinc-400 line-through' : 'text-zinc-800 dark:text-zinc-200'}"
								value={task.title}
								oninput={(e) => updateTaskTitle(groupIdx, taskIdx, (e.target as HTMLInputElement).value)}
							/>
						</div>

						<!-- Update/comment cell (Section 3) -->
						<div class="w-72 shrink-0 px-3 py-1">
							{#if task.comments.length > 0}
								{#if task.comments.length <= 2 || expandedStacks.has(task.id)}
									<!-- Show all comments -->
									{#each task.comments as comment, ci}
										<div class="flex items-start gap-2 {ci > 0 ? 'mt-1' : ''}">
											<div class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[9px] font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
												{comment.avatar}
											</div>
											<div class="min-w-0 flex-1">
												<div class="flex items-baseline gap-1">
													<span class="text-[11px] font-medium text-zinc-600 dark:text-zinc-300">{comment.author}</span>
													<span class="text-[10px] text-zinc-400">{comment.date}</span>
												</div>
												<p class="line-clamp-1 text-[11px] leading-snug text-zinc-500 dark:text-zinc-400">{comment.text}</p>
											</div>
										</div>
									{/each}
									{#if task.comments.length > 2}
										<button
											class="mt-0.5 text-[10px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
											onclick={() => toggleStack(task.id)}
										>
											Collapse
										</button>
									{/if}
								{:else}
									<!-- Stack card view: show latest + stacked cards behind -->
									<button
										class="relative w-full text-left"
										onclick={() => toggleStack(task.id)}
									>
										<!-- Stacked cards behind -->
										<div class="absolute top-1 left-1 right-1 h-full rounded bg-zinc-100 dark:bg-zinc-800/60 opacity-40"></div>
										{#if task.comments.length > 2}
											<div class="absolute top-0.5 left-0.5 right-0.5 h-full rounded bg-zinc-100 dark:bg-zinc-800/40 opacity-60"></div>
										{/if}
										<!-- Latest comment on top -->
										<div class="relative rounded bg-zinc-50 dark:bg-zinc-800/80 p-1.5">
											<div class="flex items-start gap-2">
												<div class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[9px] font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
													{task.comments[task.comments.length - 1].avatar}
												</div>
												<div class="min-w-0 flex-1">
													<div class="flex items-baseline gap-1">
														<span class="text-[11px] font-medium text-zinc-600 dark:text-zinc-300">{task.comments[task.comments.length - 1].author}</span>
														<span class="text-[10px] text-zinc-400">{task.comments[task.comments.length - 1].date}</span>
													</div>
													<p class="line-clamp-1 text-[11px] leading-snug text-zinc-500 dark:text-zinc-400">{task.comments[task.comments.length - 1].text}</p>
												</div>
											</div>
											<div class="mt-0.5 text-[10px] text-zinc-400">{task.comments.length} updates</div>
										</div>
									</button>
								{/if}
							{/if}
						</div>
					</div>
				{/each}
			{/each}
		</div>
	</section>
</div>
