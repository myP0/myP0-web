<script>
	import { onMount } from 'svelte';
	import { Sun, Moon } from 'lucide-svelte';

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
		<Sun class="h-4 w-4" />
	{:else}
		<Moon class="h-4 w-4" />
	{/if}
</button>
