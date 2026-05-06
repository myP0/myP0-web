<script lang="ts">
	import V2Logo from './V2Logo.svelte';

	let { variant = 'full' }: { variant?: 'full' | 'minimal' } = $props();

	const groups = [
		{ h: 'Product', l: ['Calendar', 'Notes', 'Tasks', 'Changelog'] },
		{ h: 'Resources', l: ['Manual', 'Privacy', 'Source (GitHub)', 'Status'] },
		{ h: 'Company', l: ['About', 'Contact', 'Press kit', 'Postcards'] },
		{ h: 'Newsletter', l: ['Monthly memo', 'Releases'] }
	];
	const year = new Date().getFullYear();
</script>

{#if variant === 'full'}
	<div class="border-t border-rule bg-bg px-14 py-10">
		<div
			class="mx-auto grid max-w-[1280px] grid-cols-[1.4fr_repeat(4,1fr)] items-start gap-6"
		>
			<div>
				<V2Logo />
				<p class="mt-3.5 max-w-[240px] text-[12px] leading-relaxed text-dim">
					A small, quiet productivity app. Made in Lisbon. Stored in your Drive.
				</p>
			</div>
			{#each groups as g}
				<div>
					<div
						class="mb-3 text-[11px] uppercase tracking-[0.08em] text-dim"
					>
						{g.h}
					</div>
					{#each g.l as x}
						<div class="py-1 text-[13px] text-ink">{x}</div>
					{/each}
				</div>
			{/each}
		</div>
		<div
			class="mx-auto mt-10 flex max-w-[1280px] justify-between border-t border-rule pt-5 text-[12px] text-dim"
		>
			<span>© {year} myP0 Co-op</span>
			<span class="font-serif italic">The file is the database.</span>
		</div>
	</div>
{:else}
	<div class="flex justify-between border-t border-rule px-14 py-6 text-[12px] text-dim">
		<span>© {year} myP0 Co-op</span>
		<span class="font-serif italic">The file is the database.</span>
	</div>
{/if}
