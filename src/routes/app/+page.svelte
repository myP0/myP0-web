<svelte:head>
	<title>Dashboard - myP0</title>
</svelte:head>

<script lang="ts">
	// Sample data — will be replaced by Google API data
	const today = new Date();
	const dayName = today.toLocaleDateString('en-US', { weekday: 'short' });
	const dayMonth = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

	const calendarTasks = [
		{ title: 'Prepare presentation slides', done: false },
		{ title: 'Review PR #142', done: true }
	];

	const calendarEvents = [
		{ title: 'Coffee with Carla', start: 9, duration: 1, color: 'bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200', location: 'Blue Bottle Coffee' },
		{ title: 'Review Q3 Budget', start: 10, duration: 1.5, color: 'bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200', location: 'Room 4B' },
		{ title: 'Lunch with Sales Team', start: 12, duration: 1, color: 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200', location: '' },
		{ title: 'Design Review', start: 14, duration: 1, color: 'bg-violet-100 dark:bg-violet-900/40 border-violet-300 dark:border-violet-700 text-violet-900 dark:text-violet-200', location: 'Figma' },
		{ title: 'Wrap-up & Planning', start: 16, duration: 0.5, color: 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 text-zinc-800 dark:text-zinc-200', location: '' }
	];

	const hours = Array.from({ length: 12 }, (_, i) => i + 7); // 7 AM – 6 PM

	const currentHour = today.getHours();
	const currentMinute = today.getMinutes();
	const currentTimeOffset = currentHour + currentMinute / 60;

	// Tasks grouped by date
	const taskGroups = [
		{
			label: '@Last Tuesday',
			tasks: [
				{ title: 'Finalize Q3 report draft', done: true, hasSubtasks: false, comment: { author: 'Emma S.', date: '2d ago', avatar: 'ES', text: 'Looks good! Just one note on the revenue section — can we add the YoY comparison?' } },
				{ title: 'Update team wiki with onboarding steps', done: false, hasSubtasks: true, comment: null },
				{ title: 'Book travel for SF offsite', done: true, hasSubtasks: false, comment: { author: 'Travel Bot', date: '2d ago', avatar: 'TB', text: 'Confirmation #AF2849 — SFO arriving 10:32am. Hotel: The Proper.' } }
			]
		},
		{
			label: '@Last Monday',
			tasks: [
				{ title: 'Review new design mockups from Lina', done: false, hasSubtasks: false, comment: { author: 'Lina K.', date: '3d ago', avatar: 'LK', text: 'Updated the sidebar nav and added the empty states you mentioned. Let me know what you think!' } },
				{ title: 'Set up staging environment for v2.1', done: true, hasSubtasks: false, comment: null },
				{ title: 'Write tests for notification service', done: false, hasSubtasks: true, comment: { author: 'CI Bot', date: '3d ago', avatar: 'CI', text: '3 of 12 tests failing. See run #847 for details... more' } }
			]
		},
		{
			label: '@January 30, 2026',
			tasks: [
				{ title: 'Migrate user preferences to new schema', done: true, hasSubtasks: false, comment: null },
				{ title: 'Draft blog post on data ownership', done: false, hasSubtasks: false, comment: { author: 'You', date: '2w ago', avatar: 'ME', text: 'Outline done. Need to flesh out the "why Google" section with concrete examples.' } },
				{ title: 'Fix calendar timezone bug (#281)', done: true, hasSubtasks: false, comment: { author: 'Alex R.', date: '2w ago', avatar: 'AR', text: 'Confirmed fixed on staging. UTC+12 edge case also resolved.' } },
				{ title: 'Update dependencies and audit', done: false, hasSubtasks: false, comment: null }
			]
		},
		{
			label: '@January 28, 2026',
			tasks: [
				{ title: 'Prepare sprint retrospective notes', done: true, hasSubtasks: false, comment: null },
				{ title: 'Implement offline sync conflict resolution', done: false, hasSubtasks: true, comment: { author: 'You', date: '2w ago', avatar: 'ME', text: 'Went with last-write-wins for now. Revisit if users report issues.' } },
				{ title: 'Send invoice to client', done: true, hasSubtasks: false, comment: { author: 'Accounting', date: '2w ago', avatar: 'AC', text: 'Payment received. Marked as settled.' } }
			]
		}
	];
</script>

<div class="flex h-full">
	<!-- Section 1: Calendar (independent scroll) -->
	<section class="flex w-[35%] min-w-0 flex-col border-r border-zinc-200 dark:border-zinc-800">
		<!-- Day header -->
		<div class="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
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
			<!-- Tasks for today -->
			<div class="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
				<div class="mb-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400">Tasks</div>
				{#each calendarTasks as task}
					<div class="flex cursor-pointer items-center gap-2.5 py-1.5" role="checkbox" aria-checked={task.done} tabindex="0">
						{#if task.done}
							<div class="flex h-4 w-4 items-center justify-center rounded border border-blue-500 bg-blue-500">
								<svg class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
							</div>
							<span class="text-sm text-zinc-400 line-through">{task.title}</span>
						{:else}
							<div class="h-4 w-4 rounded border border-zinc-300 dark:border-zinc-600"></div>
							<span class="text-sm text-zinc-700 dark:text-zinc-300">{task.title}</span>
						{/if}
					</div>
				{/each}
			</div>

			<!-- Time grid -->
			<div class="relative px-4 py-2">
				{#each hours as hour}
					{@const formatHour = hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
					<div class="flex h-16 items-start border-b border-zinc-100 dark:border-zinc-800/50">
						<span class="w-14 shrink-0 pt-0.5 text-[11px] text-zinc-400">{formatHour}</span>
						<div class="relative flex-1">
							{#each calendarEvents.filter(e => e.start === hour) as event}
								<div
									class="absolute left-0 right-1 rounded-md border px-2.5 py-1.5 {event.color}"
									style="top: 0; height: {event.duration * 64}px; z-index: 1;"
								>
									<div class="text-xs font-medium leading-tight">{event.title}</div>
									{#if event.location}
										<div class="mt-0.5 text-[10px] opacity-70">{event.location}</div>
									{/if}
								</div>
							{/each}
						</div>
					</div>

					<!-- Current time indicator -->
					{#if hour === Math.floor(currentTimeOffset) && currentHour >= 7 && currentHour <= 18}
						<div
							class="pointer-events-none absolute left-14 right-4 z-10 flex items-center"
							style="top: {((currentTimeOffset - 7) * 64) + 40}px;"
						>
							<div class="h-2.5 w-2.5 rounded-full bg-red-500"></div>
							<div class="h-px flex-1 bg-red-500"></div>
						</div>
					{/if}
				{/each}
			</div>
		</div>
	</section>

	<!-- Sections 2+3: Tasks/Notes + Updates (co-scroll) -->
	<section class="flex min-w-0 flex-1 flex-col">
		<!-- Header -->
		<div class="flex border-b border-zinc-200 dark:border-zinc-800">
			<div class="flex-1 px-4 py-3">
				<h2 class="text-sm font-semibold text-zinc-900 dark:text-white">Tasks / Notes</h2>
			</div>
			<div class="w-72 shrink-0 border-l border-zinc-200 px-4 py-3 dark:border-zinc-800">
				<h2 class="text-sm font-semibold text-zinc-900 dark:text-white">Updates</h2>
			</div>
		</div>

		<!-- Scrollable content (tasks + updates scroll together) -->
		<div class="flex-1 overflow-y-auto">
			{#each taskGroups as group}
				<!-- Date group header -->
				<div class="flex border-b border-zinc-100 bg-zinc-50/80 dark:border-zinc-800/50 dark:bg-zinc-900/50">
					<div class="flex-1 px-4 py-2">
						<span class="text-xs font-medium text-zinc-400">{group.label}</span>
					</div>
					<div class="w-72 shrink-0 border-l border-zinc-100 dark:border-zinc-800/50"></div>
				</div>

				<!-- Task rows -->
				{#each group.tasks as task}
					<div class="group flex border-b border-zinc-100 transition-colors hover:bg-zinc-50/50 dark:border-zinc-800/50 dark:hover:bg-zinc-900/30">
						<!-- Task cell -->
						<div class="flex min-w-0 flex-1 items-start gap-3 px-4 py-3">
							{#if task.done}
								<div class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-blue-500 bg-blue-500">
									<svg class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
								</div>
								<span class="text-sm text-zinc-400 line-through">{task.title}</span>
							{:else}
								<div class="mt-0.5 h-4 w-4 shrink-0 rounded border border-zinc-300 dark:border-zinc-600"></div>
								<div class="min-w-0">
									<span class="text-sm text-zinc-800 dark:text-zinc-200">{task.title}</span>
									{#if task.hasSubtasks}
										<div class="mt-1 flex items-center gap-1.5 text-[11px] text-zinc-400">
											<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h8m-8 6h16" /></svg>
											<span>Subtasks</span>
										</div>
									{/if}
								</div>
							{/if}
						</div>

						<!-- Update/comment cell -->
						<div class="w-72 shrink-0 border-l border-zinc-100 px-4 py-3 dark:border-zinc-800/50">
							{#if task.comment}
								<div class="flex items-start gap-2.5">
									<div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[10px] font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
										{task.comment.avatar}
									</div>
									<div class="min-w-0">
										<div class="flex items-baseline gap-1.5">
											<span class="text-xs font-medium text-zinc-700 dark:text-zinc-300">{task.comment.author}</span>
											<span class="text-[10px] text-zinc-400">{task.comment.date}</span>
										</div>
										<p class="mt-0.5 line-clamp-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{task.comment.text}</p>
									</div>
								</div>
							{/if}
						</div>
					</div>
				{/each}
			{/each}
		</div>
	</section>
</div>
