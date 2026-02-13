<svelte:head>
	<title>Dashboard - myP0</title>
</svelte:head>

<div class="p-8">
	<div class="mb-8">
		<h1 class="text-2xl font-bold text-zinc-900 dark:text-white">Dashboard</h1>
		<p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Welcome back. Here's your day at a glance.</p>
	</div>

	<div class="grid gap-4 sm:grid-cols-3">
		<div class="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
			<div class="text-2xl font-bold text-zinc-900 dark:text-white">0</div>
			<div class="mt-1 text-sm text-zinc-500">Tasks today</div>
		</div>
		<div class="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
			<div class="text-2xl font-bold text-zinc-900 dark:text-white">0</div>
			<div class="mt-1 text-sm text-zinc-500">Events</div>
		</div>
		<div class="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
			<div class="text-2xl font-bold text-zinc-900 dark:text-white">0</div>
			<div class="mt-1 text-sm text-zinc-500">Notes</div>
		</div>
	</div>

	<div class="mt-8 rounded-xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
		<p class="text-sm text-zinc-400 dark:text-zinc-500">Sign in with Google to see your tasks, notes, and calendar.</p>
	</div>
</div>
