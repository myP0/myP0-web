<script lang="ts">
	let {
		label = '',
		caption = '',
		children
	}: { label?: string; caption?: string; children: import('svelte').Snippet } = $props();
</script>

<figure class="my-10 rounded-md border border-rule bg-panel p-8">
	{#if label}
		<div class="mb-3.5 text-[11px] uppercase tracking-[0.08em] text-dim">{label}</div>
	{/if}
	{@render children()}
	{#if caption}
		<figcaption class="mt-[18px] text-[13px] leading-[1.5] text-dim">{caption}</figcaption>
	{/if}
</figure>
