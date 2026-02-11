<script>
	import { onMount } from 'svelte';

	let dark = $state(false);

	onMount(() => {
		dark = localStorage.getItem('theme') === 'dark';
		applyTheme();
	});

	function applyTheme() {
		if (dark) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}

	function toggle() {
		dark = !dark;
		localStorage.setItem('theme', dark ? 'dark' : 'light');
		applyTheme();
	}
</script>

<button
	onclick={toggle}
	class="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
	aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
>
	{#if dark}
		<!-- Sun icon -->
		<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<circle cx="12" cy="12" r="5" />
			<path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
		</svg>
	{:else}
		<!-- Moon icon -->
		<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
		</svg>
	{/if}
</button>
