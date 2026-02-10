<script>
	import '../app.css';
	import DarkModeToggle from '$lib/components/DarkModeToggle.svelte';
	let { children } = $props();
</script>

{@render children()}

<div class="fixed bottom-6 right-6 z-50">
	<DarkModeToggle />
</div>
