<script lang="ts">
	let { wordmark = true, size = 22 }: { wordmark?: boolean; size?: number } = $props();
	const inset = $derived(Math.round((size * 6) / 22));
</script>

<a href="/" class="flex items-center gap-2.5 no-underline">
	<span class="relative block rounded-full bg-ink" style="width:{size}px;height:{size}px">
		<span
			class="absolute rounded-full bg-accent"
			style="top:{inset}px;left:{inset}px;right:{inset}px;bottom:{inset}px"
		></span>
	</span>
	{#if wordmark}
		<span class="text-[16px] font-semibold tracking-[-0.02em] text-ink">MyP0</span>
	{/if}
</a>
