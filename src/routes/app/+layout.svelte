<script lang="ts">
	import { onMount } from 'svelte';
	import { initAuth } from '$lib/google/auth';

	let { children } = $props();

	onMount(() => {
		initAuth();
	});
</script>

{@render children()}
