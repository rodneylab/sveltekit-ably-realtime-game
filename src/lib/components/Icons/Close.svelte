<script lang="ts">
	let {
		label = 'close icon',
		colour = 'inherit',
		ariaHidden = false,
		width = 32,
		height,
	}: {
		label?: string;
		colour?: string;
		width?: number;
		height?: number;
		ariaHidden?: boolean;
	} = $props();

	let usedHeight = $derived(width && !height ? width : height);
</script>

<div class="logo">
	<svg
		aria-hidden={ariaHidden}
		color={colour}
		aria-label={label}
		role="img"
		{width}
		height={usedHeight}
		viewBox="0 0 24 24"
		fill="none"
	>
		<use href="/sprite.svg#close" />
	</svg>
</div>

<style>
	.logo {
		display: flex;
		align-items: center;
	}
</style>
