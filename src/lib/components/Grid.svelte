<script lang="ts">
	import GridRow from '$lib/components/GridRow.svelte';
	import HorizontalLineRow from '$lib/components/HorizontalLineRow.svelte';
	import app from '$lib/configuration';
	import grid from '$lib/shared/stores/grid';
	import '$lib/styles/global.css';
	import type { PlayerDesignation } from '$lib/types';
	import type { Types } from 'ably';

	let {
		channel = null,
		player = 'player1',
	}: { channel: Types.RealtimeChannelPromise | null; player: PlayerDesignation } = $props();

	const { rowCount, columnCount } = app;
</script>

<section class="grid-wrapper">
	{#each $grid as _, rowIndex (rowIndex)}
		<HorizontalLineRow {channel} {columnCount} {player} {rowIndex} />
		<GridRow {channel} gridRow={$grid[rowIndex]} {player} {rowIndex} {columnCount} />
	{/each}
	<HorizontalLineRow {channel} {columnCount} {player} rowIndex={rowCount} />
</section>

<style>
	.grid-wrapper {
		background-color: var(--colour-light);
		width: fit-content;
		padding: var(--spacing-6);
		margin-inline: auto;
		margin-bottom: var(--spacing-16);
		border-radius: var(--spacing-2);
		box-shadow: var(--shadow-elevation-medium);
	}
</style>
