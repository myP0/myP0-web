<svelte:head>
	<title>Calendar - myP0</title>
</svelte:head>

<script lang="ts">
	import { onMount } from 'svelte';
	import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-svelte';
	import { authStore, signIn } from '$lib/google/auth';
	import { fetchCalendarEvents, type CalendarEvent } from '$lib/google/calendar';

	let auth = $state($authStore);
	let currentDate = $state(new Date());
	let events = $state<CalendarEvent[]>([]);
	let loading = $state(false);

	const HOUR_HEIGHT = 60;
	const GRID_START = 7; // 7 AM
	const hours = Array.from({ length: 15 }, (_, i) => i + GRID_START); // 7 AM – 9 PM

	const currentHour = new Date().getHours();
	const currentMinute = new Date().getMinutes();

	onMount(() => {
		const unsub = authStore.subscribe((v) => {
			auth = v;
			if (v.isSignedIn) {
				loadEvents();
			} else {
				events = [];
			}
		});
		return unsub;
	});

	async function loadEvents() {
		loading = true;
		events = await fetchCalendarEvents(currentDate);
		loading = false;
	}

	function prevDay() {
		const d = new Date(currentDate);
		d.setDate(d.getDate() - 1);
		currentDate = d;
		if (auth.isSignedIn) loadEvents();
	}

	function nextDay() {
		const d = new Date(currentDate);
		d.setDate(d.getDate() + 1);
		currentDate = d;
		if (auth.isSignedIn) loadEvents();
	}

	function goToToday() {
		currentDate = new Date();
		if (auth.isSignedIn) loadEvents();
	}

	function isToday(date: Date): boolean {
		const now = new Date();
		return (
			date.getFullYear() === now.getFullYear() &&
			date.getMonth() === now.getMonth() &&
			date.getDate() === now.getDate()
		);
	}

	function formatTime(hour: number) {
		const h = Math.floor(hour);
		const m = Math.round((hour - h) * 60);
		const period = h >= 12 ? 'PM' : 'AM';
		const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
		return m === 0 ? `${displayH} ${period}` : `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
	}

	function formatEventTime(date: Date): string {
		return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
	}

	const colorClasses: Record<string, string> = {
		amber: 'bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200',
		blue: 'bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200',
		emerald: 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200',
		violet: 'bg-violet-100 dark:bg-violet-900/40 border-violet-300 dark:border-violet-700 text-violet-900 dark:text-violet-200',
		rose: 'bg-rose-100 dark:bg-rose-900/40 border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-200',
		cyan: 'bg-cyan-100 dark:bg-cyan-900/40 border-cyan-300 dark:border-cyan-700 text-cyan-900 dark:text-cyan-200',
		orange: 'bg-orange-100 dark:bg-orange-900/40 border-orange-300 dark:border-orange-700 text-orange-900 dark:text-orange-200',
		zinc: 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 text-zinc-800 dark:text-zinc-200'
	};

	function getColorClass(color: string): string {
		return colorClasses[color] || colorClasses.zinc;
	}

	// Position events on the time grid
	function getTimedEvents(events: CalendarEvent[]) {
		return events
			.filter((e) => !e.allDay)
			.map((event) => {
				const startHour = event.start.getHours() + event.start.getMinutes() / 60;
				const endHour = event.end.getHours() + event.end.getMinutes() / 60;
				const duration = Math.max(0.25, endHour - startHour);
				return { ...event, startHour, duration };
			});
	}

	function getAllDayEvents(events: CalendarEvent[]) {
		return events.filter((e) => e.allDay);
	}

	// Overlap detection
	function getEventColumns(events: ReturnType<typeof getTimedEvents>) {
		const sorted = [...events].sort((a, b) => a.startHour - b.startHour || b.duration - a.duration);
		const columns: { event: (typeof events)[0]; col: number; totalCols: number }[] = [];
		const active: { event: (typeof events)[0]; col: number; end: number }[] = [];

		for (const event of sorted) {
			const stillActive = active.filter((a) => a.end > event.startHour);
			active.length = 0;
			active.push(...stillActive);

			const usedCols = new Set(active.map((a) => a.col));
			let col = 0;
			while (usedCols.has(col)) col++;

			const entry = { event, col, end: event.startHour + event.duration };
			active.push(entry);
			columns.push({ event, col, totalCols: 0 });
		}

		for (let i = 0; i < columns.length; i++) {
			const ev = columns[i].event;
			const overlapping = columns.filter((c) => {
				const cEnd = c.event.startHour + c.event.duration;
				const evEnd = ev.startHour + ev.duration;
				return c.event.startHour < evEnd && cEnd > ev.startHour;
			});
			const maxCol = Math.max(...overlapping.map((c) => c.col)) + 1;
			for (const o of overlapping) {
				o.totalCols = Math.max(o.totalCols, maxCol);
			}
		}

		return columns;
	}

	$effect(() => {
		// Reactively recompute when events or currentDate change
		currentDate;
		events;
	});

	let dayName = $derived(currentDate.toLocaleDateString('en-US', { weekday: 'long' }));
	let dayFormatted = $derived(
		currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
	);
	let timedEvents = $derived(getTimedEvents(events));
	let allDayEvents = $derived(getAllDayEvents(events));
	let eventColumns = $derived(getEventColumns(timedEvents));
</script>

<div class="flex h-full flex-col">
	{#if !auth.isSignedIn && !auth.loading}
		<!-- Not signed in -->
		<div class="flex flex-1 items-center justify-center p-8">
			<div class="text-center">
				<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
					<svg class="h-8 w-8" viewBox="0 0 24 24" fill="none">
						<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
						<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
						<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
						<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
					</svg>
				</div>
				<h2 class="text-lg font-semibold text-zinc-900 dark:text-white">Connect your Google Calendar</h2>
				<p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
					Sign in to see your events here.
				</p>
				<button
					class="mt-4 inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
					onclick={() => signIn()}
				>
					Sign in with Google
				</button>
			</div>
		</div>
	{:else}
		<!-- Header with date navigation -->
		<div class="flex items-center justify-between border-b border-zinc-200 px-6 py-3 dark:border-zinc-800">
			<div class="flex items-center gap-4">
				<h1 class="text-lg font-semibold text-zinc-900 dark:text-white">{dayName}</h1>
				<span class="text-sm text-zinc-500 dark:text-zinc-400">{dayFormatted}</span>
			</div>
			<div class="flex items-center gap-2">
				{#if !isToday(currentDate)}
					<button
						class="rounded-md px-3 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
						onclick={goToToday}
					>
						Today
					</button>
				{/if}
				<button
					aria-label="Previous day"
					class="rounded p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
					onclick={prevDay}
				>
					<ChevronLeft class="h-4 w-4" />
				</button>
				<button
					aria-label="Next day"
					class="rounded p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
					onclick={nextDay}
				>
					<ChevronRight class="h-4 w-4" />
				</button>
			</div>
		</div>

		{#if loading}
			<div class="flex flex-1 items-center justify-center">
				<Loader2 class="h-6 w-6 animate-spin text-zinc-400" />
			</div>
		{:else if events.length === 0}
			<div class="flex flex-1 items-center justify-center p-8">
				<div class="text-center">
					<p class="text-sm text-zinc-400 dark:text-zinc-500">No events for this day.</p>
				</div>
			</div>
		{:else}
			<!-- All-day events -->
			{#if allDayEvents.length > 0}
				<div class="border-b border-zinc-200 px-6 py-2 dark:border-zinc-800">
					<div class="flex flex-wrap gap-2">
						{#each allDayEvents as event}
							<div class="rounded-md border px-2.5 py-1 text-xs font-medium {getColorClass(event.color)}">
								{event.title}
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Time grid -->
			<div class="flex-1 overflow-y-auto">
				<div class="relative px-6" style="padding-left: 5rem;">
					{#each hours as hour}
						{@const formatHour = hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
						<div class="relative" style="height: {HOUR_HEIGHT}px;">
							<span class="absolute -left-14 top-0 w-12 text-right text-[11px] text-zinc-400 -translate-y-1/2">{formatHour}</span>
							<div class="absolute inset-x-0 top-0 border-t border-zinc-100 dark:border-zinc-800/50"></div>
						</div>
					{/each}

					<!-- Events layer -->
					<div class="absolute inset-0" style="left: 5rem; right: 1.5rem;">
						{#each eventColumns as { event, col, totalCols }}
							{@const top = (event.startHour - GRID_START) * HOUR_HEIGHT}
							{@const height = Math.max(event.duration * HOUR_HEIGHT, 24)}
							{@const width = totalCols > 1 ? `calc(${100 / totalCols}% - 2px)` : 'calc(100% - 2px)'}
							{@const left = totalCols > 1 ? `${(col / totalCols) * 100}%` : '0'}
							<div
								class="absolute rounded-md border px-2 py-1 {getColorClass(event.color)}"
								style="top: {top}px; height: {height}px; width: {width}; left: {left};"
							>
								<div class="text-xs font-medium leading-tight truncate">{event.title}</div>
								{#if event.location && height > 32}
									<div class="mt-0.5 text-[10px] opacity-70 truncate">{event.location}</div>
								{/if}
								{#if height > 20}
									<div class="text-[9px] opacity-50 mt-0.5">
										{formatEventTime(event.start)} – {formatEventTime(event.end)}
									</div>
								{/if}
							</div>
						{/each}
					</div>

					<!-- Current time indicator -->
					{#if isToday(currentDate) && currentHour >= GRID_START && currentHour <= GRID_START + hours.length}
						<div
							class="pointer-events-none absolute right-6 z-30 flex items-center"
							style="top: {(currentHour + currentMinute / 60 - GRID_START) * HOUR_HEIGHT}px; left: 5rem;"
						>
							<div class="h-2.5 w-2.5 rounded-full bg-red-500 -ml-1"></div>
							<div class="h-px flex-1 bg-red-500"></div>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	{/if}
</div>
