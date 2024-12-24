<script lang="ts">
	let {
		label = 'Play icon',
		colour = 'inherit',
		ariaHidden = false,
		width = 48,
		height = width,
	}: {
		label?: string;
		colour?: string;
		ariaHidden?: boolean;
		width?: number;
		height?: number;
	} = $props();
</script>

<div class="logo">
	<svg
		aria-hidden={ariaHidden}
		color={colour}
		aria-label={label}
		role="img"
		{width}
		{height}
		viewBox="0 0 24 24"
		fill="none"
	>
		<use href="/sprite.svg#play" />
	</svg>
</div>

<style>
	.logo {
		display: flex;
		align-items: center;
	}
</style>
