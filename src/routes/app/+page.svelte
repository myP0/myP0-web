<svelte:head>
	<title>Dashboard - myP0</title>
</svelte:head>

<div class="flex h-full">
	<!-- Column 1: Calendar -->
	<section class="flex w-1/3 flex-col border-r border-zinc-200 dark:border-zinc-800">
		<div class="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
			<h2 class="text-sm font-semibold text-zinc-900 dark:text-white">Calendar</h2>
			<span class="text-xs text-zinc-400">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
		</div>
		<div class="flex-1 overflow-y-auto p-4">
			<div class="rounded-lg border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
				<svg class="mx-auto h-8 w-8 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
				<p class="mt-3 text-xs text-zinc-400 dark:text-zinc-500">Sign in to see your events</p>
			</div>
		</div>
	</section>

	<!-- Column 2: Tasks / Notes -->
	<section class="flex w-1/3 flex-col border-r border-zinc-200 dark:border-zinc-800">
		<div class="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
			<h2 class="text-sm font-semibold text-zinc-900 dark:text-white">Tasks / Notes</h2>
		</div>
		<div class="flex-1 overflow-y-auto p-4">
			<div class="rounded-lg border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
				<svg class="mx-auto h-8 w-8 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
				<p class="mt-3 text-xs text-zinc-400 dark:text-zinc-500">Sign in to see your tasks and notes</p>
			</div>
		</div>
	</section>

	<!-- Column 3: Updates -->
	<section class="flex w-1/3 flex-col">
		<div class="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
			<h2 class="text-sm font-semibold text-zinc-900 dark:text-white">Updates</h2>
		</div>
		<div class="flex-1 overflow-y-auto p-4">
			<div class="rounded-lg border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
				<svg class="mx-auto h-8 w-8 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
				<p class="mt-3 text-xs text-zinc-400 dark:text-zinc-500">Comments and follow-ups will appear here</p>
			</div>
		</div>
	</section>
</div>
