<script lang="ts">
	import V2Logo from './V2Logo.svelte';

	let {
		active = '',
		bordered = true,
		showSignIn = false
	}: { active?: string; bordered?: boolean; showSignIn?: boolean } = $props();

	const items = [
		{ label: 'Product', href: '/#product' },
		{ label: 'Privacy', href: '/#privacy' },
		{ label: 'Pricing', href: '/#pricing' },
		{ label: 'Manual', href: '/blog' }
	];
</script>

<div
	class="sticky top-0 z-20 bg-bg {bordered ? 'border-b border-rule' : ''}"
>
	<div class="mx-auto flex max-w-[1280px] items-center justify-between px-14 py-5">
		<V2Logo />
		<nav class="hidden items-center gap-9 text-[14px] md:flex">
			{#each items as item}
				<a
					href={item.href}
					class="relative no-underline transition-colors {item.label === active
						? 'font-medium text-ink'
						: 'text-dim hover:text-ink'}"
				>
					{item.label}
					{#if item.label === active}
						<span
							class="absolute -bottom-[22px] left-0 right-0 h-px bg-ink"
							aria-hidden="true"
						></span>
					{/if}
				</a>
			{/each}
		</nav>
		<div class="flex items-center gap-2.5">
			{#if showSignIn}
				<a
					href="/app"
					class="rounded-full border border-rule bg-transparent px-3.5 py-2 text-[14px] text-ink no-underline transition-colors hover:bg-panel"
				>
					Sign in
				</a>
			{/if}
			<a
				href="/app"
				class="rounded-full bg-ink px-4 py-2 text-[14px] font-medium text-bg no-underline transition-colors hover:opacity-90"
			>
				Open app{showSignIn ? ' →' : ''}
			</a>
		</div>
	</div>
</div>
