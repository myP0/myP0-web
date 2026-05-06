<script lang="ts">
	let { attr = '', children }: { attr?: string; children: import('svelte').Snippet } = $props();
</script>

<figure class="my-10 border-l-[3px] border-accent pl-8">
	<blockquote
		class="m-0 font-serif text-[32px] font-normal italic leading-[1.3] tracking-[-0.01em] text-ink"
	>
		{@render children()}
	</blockquote>
	{#if attr}
		<figcaption class="mt-3.5 text-[13px] tracking-[0.04em] text-dim">— {attr}</figcaption>
	{/if}
</figure>
