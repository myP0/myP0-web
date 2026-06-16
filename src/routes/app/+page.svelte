<script lang="ts">
	import { onMount, tick } from 'svelte';
	import V2Logo from '$lib/components/V2Logo.svelte';
	import { hashColor, getPaletteColor, colorStyle } from '$lib/palette';
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
		title: string;
		tag: string;
		active?: boolean;
		done?: boolean;
		comments: Comment[];
	};

	type Group = { date: string; tasks: Task[] };
	type Row =
		| { kind: 'date'; date: string }
		| { kind: 'task'; task: Task; groupIdx: number; taskIdx: number };

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

	let groups = $state<Group[]>([
		{
			date: '2026-04-29',
			tasks: [
				{
					id: 't1',
					title: 'Ship redesign RFC draft #design',
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
					title: 'Reply to Ben re: API keys',
					tag: 'Inbox',
					comments: [
						{ who: 'Ben', initials: 'BD', when: '08:14', body: "Keys are in 1pw under 'p0/staging'." }
					]
				},
				{ id: 't3', title: 'Audit Drive permissions #security', tag: 'P0', comments: [] }
			]
		},
		{
			date: '2026-04-28',
			tasks: [
				{
					id: 't4',
					title: 'Review PR #482',
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
				{ id: 't5', title: 'Outline Q2 review', tag: 'Mgmt', comments: [] }
			]
		}
	]);

	const ROW_H_TASK = 44;
	const ROW_H_DATE = 44;

	function extractHashtags(title: string): string[] {
		const matches = title.match(/#[\w-]+/g);
		return matches ? [...new Set(matches)] : [];
	}

	function stripHashtags(title: string): string {
		return title.replace(/#[\w-]+/g, '').replace(/\s+/g, ' ').trim();
	}

	function getTodayStr() {
		return new Date().toISOString().slice(0, 10);
	}

	function formatGroupLabel(dateStr: string): string {
		const now = new Date();
		const todayStr = now.toISOString().slice(0, 10);
		const yesterday = new Date(now);
		yesterday.setDate(now.getDate() - 1);
		const tomorrow = new Date(now);
		tomorrow.setDate(now.getDate() + 1);

		if (dateStr === todayStr) return '@Today';
		if (dateStr === yesterday.toISOString().slice(0, 10)) return '@Yesterday';
		if (dateStr === tomorrow.toISOString().slice(0, 10)) return '@Tomorrow';

		const date = new Date(dateStr + 'T12:00:00');
		const diffMs = now.getTime() - date.getTime();
		const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
		const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

		if (diffDays > 0 && diffDays < 7) return `@Last ${dayName}`;
		if (diffDays < 0 && diffDays > -7) return `@This ${dayName}`;

		return `@${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
	}

	function parseDatePrefix(text: string): { date: string; title: string; dateMatch: string } | null {
		if (!text.startsWith('@')) return null;
		const after = text.slice(1);
		const now = new Date();
		const toISO = (d: Date) => d.toISOString().slice(0, 10);

		const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
		const dayAbbrevs: Record<string, number> = {
			sun: 0, mon: 1, tue: 2, tues: 2, wed: 3, thu: 4, thur: 4, thurs: 4, fri: 5, sat: 6
		};
		const monthNames: Record<string, number> = {
			january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
			july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
			jan: 0, feb: 1, mar: 2, apr: 3, jun: 5, jul: 6, aug: 7, sep: 8, sept: 8, oct: 9, nov: 10, dec: 11
		};

		const patterns: { regex: RegExp; resolve: (m: RegExpMatchArray) => Date | null }[] = [
			{ regex: /^(today)\b\s*(.*)/i, resolve: () => now },
			{ regex: /^(tomorrow)\b\s*(.*)/i, resolve: () => { const d = new Date(now); d.setDate(d.getDate() + 1); return d; } },
			{ regex: /^(yesterday)\b\s*(.*)/i, resolve: () => { const d = new Date(now); d.setDate(d.getDate() - 1); return d; } },
			{ regex: /^(day\s+before\s+yesterday)\b\s*(.*)/i, resolve: () => { const d = new Date(now); d.setDate(d.getDate() - 2); return d; } },
			{ regex: /^(day\s+after\s+tomorrow)\b\s*(.*)/i, resolve: () => { const d = new Date(now); d.setDate(d.getDate() + 2); return d; } },
			{ regex: /^(in\s+(\d+)\s+days?)\b\s*(.*)/i, resolve: (m) => { const d = new Date(now); d.setDate(d.getDate() + parseInt(m[2])); return d; } },
			{ regex: /^((\d+)\s+days?\s+ago)\b\s*(.*)/i, resolve: (m) => { const d = new Date(now); d.setDate(d.getDate() - parseInt(m[2])); return d; } },
			{ regex: /^(in\s+(\d+)\s+weeks?)\b\s*(.*)/i, resolve: (m) => { const d = new Date(now); d.setDate(d.getDate() + parseInt(m[2]) * 7); return d; } },
			{ regex: /^((\d+)\s+weeks?\s+ago)\b\s*(.*)/i, resolve: (m) => { const d = new Date(now); d.setDate(d.getDate() - parseInt(m[2]) * 7); return d; } },
			{
				regex: new RegExp(`^(next\\s+(${dayNames.join('|')}|${Object.keys(dayAbbrevs).join('|')}))\\b\\s*(.*)`, 'i'),
				resolve: (m) => {
					const k = m[2].toLowerCase();
					const dayIdx = dayNames.indexOf(k);
					const idx = dayIdx !== -1 ? dayIdx : dayAbbrevs[k];
					if (idx === undefined) return null;
					const d = new Date(now);
					let diff = (idx - d.getDay() + 7) % 7;
					if (diff === 0) diff = 7;
					d.setDate(d.getDate() + diff);
					return d;
				}
			},
			{
				regex: new RegExp(`^(last\\s+(${dayNames.join('|')}|${Object.keys(dayAbbrevs).join('|')}))\\b\\s*(.*)`, 'i'),
				resolve: (m) => {
					const k = m[2].toLowerCase();
					const dayIdx = dayNames.indexOf(k);
					const idx = dayIdx !== -1 ? dayIdx : dayAbbrevs[k];
					if (idx === undefined) return null;
					const d = new Date(now);
					let diff = (d.getDay() - idx + 7) % 7;
					if (diff === 0) diff = 7;
					d.setDate(d.getDate() - diff);
					return d;
				}
			},
			{
				regex: new RegExp(`^(this\\s+(${dayNames.join('|')}|${Object.keys(dayAbbrevs).join('|')}))\\b\\s*(.*)`, 'i'),
				resolve: (m) => {
					const k = m[2].toLowerCase();
					const dayIdx = dayNames.indexOf(k);
					const idx = dayIdx !== -1 ? dayIdx : dayAbbrevs[k];
					if (idx === undefined) return null;
					const d = new Date(now);
					const diff = (idx - d.getDay() + 7) % 7;
					d.setDate(d.getDate() + diff);
					return d;
				}
			},
			{ regex: /^(next\s+week)\b\s*(.*)/i, resolve: () => { const d = new Date(now); d.setDate(d.getDate() + 7); return d; } },
			{ regex: /^(last\s+week)\b\s*(.*)/i, resolve: () => { const d = new Date(now); d.setDate(d.getDate() - 7); return d; } },
			{ regex: /^(next\s+month)\b\s*(.*)/i, resolve: () => { const d = new Date(now); d.setMonth(d.getMonth() + 1); return d; } },
			{ regex: /^(last\s+month)\b\s*(.*)/i, resolve: () => { const d = new Date(now); d.setMonth(d.getMonth() - 1); return d; } },
			{
				regex: new RegExp(`^(${dayNames.join('|')}|${Object.keys(dayAbbrevs).join('|')})\\b\\s*(.*)`, 'i'),
				resolve: (m) => {
					const k = m[1].toLowerCase();
					const dayIdx = dayNames.indexOf(k);
					const idx = dayIdx !== -1 ? dayIdx : dayAbbrevs[k];
					if (idx === undefined) return null;
					const d = new Date(now);
					let diff = (d.getDay() - idx + 7) % 7;
					if (diff === 0) diff = 7;
					d.setDate(d.getDate() - diff);
					return d;
				}
			},
			{
				regex: new RegExp(`^((?:${Object.keys(monthNames).join('|')})\\s+\\d{1,2}(?:[,\\s]+\\d{4})?)\\b\\s*(.*)`, 'i'),
				resolve: (m) => {
					const parts = m[1].replace(',', ' ').split(/\s+/);
					const month = monthNames[parts[0].toLowerCase()];
					if (month === undefined) return null;
					const day = parseInt(parts[1]);
					const year = parts[2] ? parseInt(parts[2]) : now.getFullYear();
					const d = new Date(year, month, day);
					return isNaN(d.getTime()) ? null : d;
				}
			},
			{
				regex: new RegExp(`^(\\d{1,2}\\s+(?:${Object.keys(monthNames).join('|')})(?:\\s+\\d{4})?)\\b\\s*(.*)`, 'i'),
				resolve: (m) => {
					const parts = m[1].split(/\s+/);
					const day = parseInt(parts[0]);
					const month = monthNames[parts[1].toLowerCase()];
					if (month === undefined) return null;
					const year = parts[2] ? parseInt(parts[2]) : now.getFullYear();
					const d = new Date(year, month, day);
					return isNaN(d.getTime()) ? null : d;
				}
			},
			{
				regex: /^(\d{4}-\d{2}-\d{2})\b\s*(.*)/i,
				resolve: (m) => {
					const d = new Date(m[1] + 'T12:00:00');
					return isNaN(d.getTime()) ? null : d;
				}
			},
			{
				regex: new RegExp(`^(\\d{1,2}[\\-/](?:${Object.keys(monthNames).join('|')})[\\-/]\\d{4})\\b\\s*(.*)`, 'i'),
				resolve: (m) => {
					const parts = m[1].split(/[-/]/);
					const day = parseInt(parts[0]);
					const month = monthNames[parts[1].toLowerCase()];
					if (month === undefined) return null;
					const year = parseInt(parts[2]);
					const d = new Date(year, month, day);
					return isNaN(d.getTime()) ? null : d;
				}
			},
			{
				regex: new RegExp(`^((?:${Object.keys(monthNames).join('|')})[\\-/]\\d{1,2}[\\-/]\\d{4})\\b\\s*(.*)`, 'i'),
				resolve: (m) => {
					const parts = m[1].split(/[-/]/);
					const month = monthNames[parts[0].toLowerCase()];
					if (month === undefined) return null;
					const day = parseInt(parts[1]);
					const year = parseInt(parts[2]);
					const d = new Date(year, month, day);
					return isNaN(d.getTime()) ? null : d;
				}
			},
			{
				regex: /^(\d{1,2}[/\-]\d{1,2}[/\-]\d{4})\b\s*(.*)/i,
				resolve: (m) => {
					const parts = m[1].split(/[-/]/);
					const a = parseInt(parts[0]), b = parseInt(parts[1]), year = parseInt(parts[2]);
					const month = a > 12 ? b - 1 : a - 1;
					const day = a > 12 ? a : b;
					const d = new Date(year, month, day);
					return isNaN(d.getTime()) ? null : d;
				}
			},
			{
				regex: /^(\d{1,2}[/\-]\d{1,2})\b\s*(.*)/i,
				resolve: (m) => {
					const parts = m[1].split(/[-/]/);
					const a = parseInt(parts[0]), b = parseInt(parts[1]);
					const month = a > 12 ? b - 1 : a - 1;
					const day = a > 12 ? a : b;
					const d = new Date(now.getFullYear(), month, day);
					return isNaN(d.getTime()) ? null : d;
				}
			}
		];

		for (const { regex, resolve } of patterns) {
			const m = after.match(regex);
			if (m) {
				const d = resolve(m);
				if (d && !isNaN(d.getTime())) {
					const title = m[m.length - 1].trim();
					return { date: toISO(d), title, dateMatch: m[1] };
				}
			}
		}

		return null;
	}

	let nextTaskId = $state(100);
	let focusTaskId = $state<string | null>(null);

	let topInputValue = $state('');
	let topInputDateMatch = $derived.by<{ matched: boolean; dateText: string; rest: string }>(() => {
		if (!topInputValue.startsWith('@')) return { matched: false, dateText: '', rest: topInputValue };
		const parsed = parseDatePrefix(topInputValue);
		if (parsed) {
			return { matched: true, dateText: '@' + parsed.dateMatch, rest: parsed.title };
		}
		return { matched: false, dateText: '', rest: topInputValue };
	});
	let topInputDisplayValue = $derived(topInputDateMatch.matched ? topInputDateMatch.rest : topInputValue);
	let topInputHashtags = $derived(extractHashtags(topInputValue));

	let flatTaskIds = $derived(groups.flatMap((g) => g.tasks.map((t) => t.id)));

	function addTaskToDate(dateStr: string, initialTitle = '') {
		const id = `t${nextTaskId++}`;
		const newTask: Task = { id, title: initialTitle, tag: 'Inbox', comments: [] };

		const existingIdx = groups.findIndex((g) => g.date === dateStr);
		if (existingIdx !== -1) {
			groups = groups.map((g, gi) =>
				gi !== existingIdx ? g : { ...g, tasks: [newTask, ...g.tasks] }
			);
		} else {
			const newGroup: Group = { date: dateStr, tasks: [newTask] };
			const insertAt = groups.findIndex((g) => g.date < dateStr);
			const next = [...groups];
			if (insertAt === -1) next.push(newGroup);
			else next.splice(insertAt, 0, newGroup);
			groups = next;
		}
		focusTaskId = id;
	}

	function addTask(afterGroupIdx?: number, afterTaskIdx?: number, initialTitle = '') {
		if (afterGroupIdx !== undefined && afterTaskIdx !== undefined) {
			const id = `t${nextTaskId++}`;
			const newTask: Task = { id, title: initialTitle, tag: 'Inbox', comments: [] };
			groups = groups.map((g, gi) => {
				if (gi !== afterGroupIdx) return g;
				const tasks = [...g.tasks];
				tasks.splice(afterTaskIdx + 1, 0, newTask);
				return { ...g, tasks };
			});
			focusTaskId = id;
		} else {
			const parsed = parseDatePrefix(initialTitle);
			if (parsed) addTaskToDate(parsed.date, parsed.title);
			else addTaskToDate(getTodayStr(), initialTitle);
		}
	}

	function getAdjacentTaskId(groupIdx: number, taskIdx: number, direction: -1 | 1): string | null {
		const currentId = groups[groupIdx].tasks[taskIdx].id;
		const flatIdx = flatTaskIds.indexOf(currentId);
		const targetIdx = flatIdx + direction;
		if (targetIdx >= 0 && targetIdx < flatTaskIds.length) return flatTaskIds[targetIdx];
		return null;
	}

	function updateTitle(groupIdx: number, taskIdx: number, newTitle: string) {
		groups = groups.map((g, gi) => {
			if (gi !== groupIdx) return g;
			return {
				...g,
				tasks: g.tasks.map((t, ti) => (ti !== taskIdx ? t : { ...t, title: newTitle }))
			};
		});
	}

	function handleTaskKeydown(e: KeyboardEvent, groupIdx: number, taskIdx: number) {
		if (e.key === 'Enter') {
			e.preventDefault();
			addTask(groupIdx, taskIdx);
		}
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			const targetId = getAdjacentTaskId(groupIdx, taskIdx, -1);
			if (targetId) focusTaskId = targetId;
		}
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			const targetId = getAdjacentTaskId(groupIdx, taskIdx, 1);
			if (targetId) focusTaskId = targetId;
		}
		if (e.key === 'Backspace' && (e.target as HTMLInputElement).value === '') {
			e.preventDefault();
			const prevId = getAdjacentTaskId(groupIdx, taskIdx, -1);
			const deletingId = groups[groupIdx].tasks[taskIdx].id;
			groups = groups
				.map((g, gi) => {
					if (gi !== groupIdx) return g;
					return { ...g, tasks: g.tasks.filter((_, ti) => ti !== taskIdx) };
				})
				.filter((g) => g.tasks.length > 0);
			if (pinnedId === deletingId) pinnedId = null;
			if (prevId) focusTaskId = prevId;
		}
	}

	$effect(() => {
		if (focusTaskId) {
			const id = focusTaskId;
			tick().then(() => {
				requestAnimationFrame(() => {
					const input = document.querySelector(
						`input[data-task-id="${id}"]`
					) as HTMLInputElement | null;
					if (input) {
						input.focus();
						input.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
					}
				});
			});
			focusTaskId = null;
		}
	});

	let rows = $derived.by<Row[]>(() => {
		const out: Row[] = [];
		groups.forEach((g, gi) => {
			out.push({ kind: 'date', date: g.date });
			g.tasks.forEach((t, ti) => out.push({ kind: 'task', task: t, groupIdx: gi, taskIdx: ti }));
		});
		return out;
	});

	let taskY = $derived.by<Record<string, number>>(() => {
		const map: Record<string, number> = {};
		let y = 16;
		for (const r of rows) {
			if (r.kind === 'date') y += ROW_H_DATE;
			else {
				map[r.task.id] = y;
				y += ROW_H_TASK;
			}
		}
		return map;
	});

	let minColHeight = $derived.by(() => {
		let y = 16;
		for (const r of rows) y += r.kind === 'date' ? ROW_H_DATE : ROW_H_TASK;
		return y + 60;
	});

	const ticks = Array.from({ length: 28 });

	let pinnedId: string | null = $state('t1');
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
					class="sticky top-0 z-20 flex justify-between border-b border-rule bg-bg px-[22px] py-3.5 text-[11px] uppercase tracking-[0.06em] text-dim"
				>
					<span>Tasks</span><span>{flatTaskIds.length} open</span>
				</div>

				<!-- Top input: persistent quick-add with @date and #hashtag parsing -->
				<div
					class="sticky top-[44px] z-[15] flex items-center gap-2 border-b border-rule bg-panel px-[22px] py-2"
				>
					<span
						class="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-sm border border-dashed border-faint text-[11px] leading-none text-faint"
						aria-hidden="true">+</span
					>
					{#if topInputDateMatch.matched}
						<span
							class="flex-shrink-0 rounded-md border px-1.5 py-0.5 text-[11px] font-medium"
							style={colorStyle(getPaletteColor('blue'), 'light')}
						>
							{topInputDateMatch.dateText}
						</span>
					{/if}
					<input
						type="text"
						class="min-w-0 flex-1 bg-transparent text-[14px] text-ink outline-none placeholder:text-faint"
						placeholder="Add a task… try @tomorrow buy milk #work"
						value={topInputDisplayValue}
						oninput={(e) => {
							const v = (e.currentTarget as HTMLInputElement).value;
							if (topInputDateMatch.matched) {
								topInputValue = topInputDateMatch.dateText + ' ' + v;
							} else {
								topInputValue = v;
							}
						}}
						onkeydown={(e) => {
							if (e.key === 'Enter') {
								const title = topInputValue.trim();
								if (title) {
									addTask(undefined, undefined, title);
									topInputValue = '';
								}
							}
							if (e.key === 'Backspace' && topInputDateMatch.matched) {
								const input = e.currentTarget as HTMLInputElement;
								if (input.selectionStart === 0 && input.selectionEnd === 0) {
									e.preventDefault();
									topInputValue = topInputDateMatch.rest;
								}
							}
						}}
					/>
					{#if topInputHashtags.length > 0}
						<div class="flex flex-shrink-0 items-center gap-1">
							{#each topInputHashtags as tag}
								<span
									class="inline-flex items-center rounded-full border px-1.5 py-0 text-[10px] font-medium"
									style={colorStyle(hashColor(tag), 'light')}
								>
									{tag.slice(1)}
								</span>
							{/each}
						</div>
					{/if}
				</div>

				{#each rows as r}
					{#if r.kind === 'date'}
						<div
							class="sticky top-[88px] z-[5] px-[22px] pb-1.5 pt-5 font-serif text-[16px] italic text-dim backdrop-blur-sm"
							style="height:{ROW_H_DATE}px;background:rgb(255 254 249 / 0.8)"
						>
							{formatGroupLabel(r.date)}
						</div>
					{:else}
						{@const isActive = activeId === r.task.id}
						{@const tags = extractHashtags(r.task.title)}
						<div
							class="flex w-full cursor-pointer items-center gap-2.5 border-l-2 px-[22px] text-left transition-colors"
							style="height:{ROW_H_TASK}px;background:{isActive
								? selBg
								: 'transparent'};border-left-color:{isActive ? selBorder : 'transparent'}"
							role="presentation"
							onmouseenter={() => (hoveredId = r.task.id)}
							onmouseleave={() => (hoveredId = null)}
							onclick={() => (pinnedId = r.task.id)}
						>
							<span
								class="h-3.5 w-3.5 flex-shrink-0 rounded-full border {r.task.done
									? 'border-faint bg-faint'
									: 'border-rule bg-transparent'}"
							></span>
							<input
								type="text"
								data-task-id={r.task.id}
								value={stripHashtags(r.task.title)}
								class="min-w-0 flex-1 bg-transparent text-[14px] outline-none {r.task.done
									? 'text-dim line-through'
									: 'text-ink'} {isActive ? 'font-medium' : ''}"
								onclick={(e) => e.stopPropagation()}
								onfocus={() => (hoveredId = r.task.id)}
								onblur={() => (hoveredId = null)}
								oninput={(e) => {
									const newTitle = (e.currentTarget as HTMLInputElement).value;
									const existingTags = extractHashtags(r.task.title);
									const merged = existingTags.length
										? newTitle + ' ' + existingTags.join(' ')
										: newTitle;
									updateTitle(r.groupIdx, r.taskIdx, merged.trim());
								}}
								onkeydown={(e) => handleTaskKeydown(e, r.groupIdx, r.taskIdx)}
							/>
							<span
								class="rounded-md border px-2 py-0.5 text-[11px]"
								style={colorStyle(hashColor(r.task.tag), 'light')}
							>
								{r.task.tag}
							</span>
							{#each tags as tag}
								<span
									class="rounded-full border px-1.5 py-0 text-[10px] font-medium"
									style={colorStyle(hashColor(tag), 'light')}
								>
									{tag.slice(1)}
								</span>
							{/each}
							{#if r.task.comments.length > 0}
								<span class="text-[11px] text-faint">● {r.task.comments.length}</span>
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
