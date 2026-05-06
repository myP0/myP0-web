<script lang="ts">
	let email = $state('');
</script>

<div
	class="grid grid-cols-12 items-center gap-6 border-b border-rule bg-panel px-14 py-10"
>
	<div class="col-span-6">
		<div class="mb-1 font-serif text-[24px] italic text-ink">The monthly memo.</div>
		<div class="text-[14px] text-dim">
			One letter a month. Whatever we wrote. Unsubscribe in two clicks.
		</div>
	</div>
	<form
		class="col-span-6 flex gap-2"
		onsubmit={(e) => e.preventDefault()}
	>
		<input
			type="email"
			placeholder="you@your-domain.com"
			bind:value={email}
			class="flex-1 rounded-full border border-rule bg-bg px-[18px] py-3 text-[14px] text-ink outline-none placeholder:text-dim focus:border-ink"
		/>
		<button
			type="submit"
			class="rounded-full bg-accent px-5 py-3 text-[14px] font-medium text-white"
		>
			Subscribe
		</button>
	</form>
</div>
