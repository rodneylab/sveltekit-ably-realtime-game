<script lang="ts">
	import { PUBLIC_COLUMNS, PUBLIC_ROWS } from '$env/static/public';
	import GridRow from '$lib/components/GridRow.svelte';
	import HorizontalLineRow from '$lib/components/HorizontalLineRow.svelte';
	import grid from '$lib/shared/stores/grid';
	import '$lib/styles/global.css';
	import type { PlayerDesignation } from '$lib/types';
	import type { Types } from 'ably';

	export let channel: Types.RealtimeChannelPromise | null = null;
	export let player: PlayerDesignation = 'player1';

	const rowCount = Number.parseInt(PUBLIC_ROWS, 10);
	const columnCount = Number.parseInt(PUBLIC_COLUMNS, 10);
</script>

{#each $grid as _, rowIndex}
	<HorizontalLineRow {channel} {columnCount} {player} {rowIndex} />
	<GridRow {channel} gridRow={$grid[rowIndex]} {player} {rowIndex} {columnCount} />
{/each}
<HorizontalLineRow {channel} {columnCount} {player} rowIndex={rowCount} />
