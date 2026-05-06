<script lang="ts">
	let {
		label = 'Try it',
		headline,
		ctaText = 'Connect your Drive →',
		ctaHref = '/app'
	}: {
		label?: string;
		headline: string;
		ctaText?: string;
		ctaHref?: string;
	} = $props();
</script>

<div class="mt-10 rounded-[10px] border border-accent bg-accent-soft p-7">
	<div
		class="mb-2.5 font-serif text-[12px] uppercase italic tracking-[0.08em] text-accent"
	>
		{label}
	</div>
	<div class="mb-4 font-serif text-[22px] leading-[1.4] text-ink">{headline}</div>
	<a
		href={ctaHref}
		class="inline-block rounded-full bg-ink px-[18px] py-2.5 text-[14px] font-medium text-bg no-underline"
	>
		{ctaText}
	</a>
</div>
