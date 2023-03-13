<script lang="ts">
	import { PUBLIC_ROWS, PUBLIC_COLUMNS } from '$env/static/public';
	import GridRow from '$lib/components/GridRow.svelte';
	import HorizontalLineRow from '$lib/components/HorizontalLineRow.svelte';
	import horizontals from '$lib/shared/stores/horizontalLines';
	import verticals from '$lib/shared/stores/verticalLines';
	import type { PlayerDesignation } from '$lib/types';
	import '$lib/styles/global.css';

	const rowCount = Number.parseInt(PUBLIC_ROWS, 10);
	const columnCount = Number.parseInt(PUBLIC_COLUMNS, 10);
	let player: PlayerDesignation = 'player1';

	let grid: PlayerDesignation[][] = Array.from({ length: rowCount }, () =>
		Array.from({ length: columnCount + 1 }, () => null)
	);

	$: {
		grid.forEach((row, rowIndex) => {
			row.forEach((_, columnIndex) => {
				if (
					$horizontals[rowIndex][columnIndex] &&
					$horizontals[rowIndex + 1][columnIndex] &&
					$verticals[rowIndex][columnIndex] &&
					$verticals[rowIndex][columnIndex + 1]
				) {
					grid[rowIndex][columnIndex] = player;
				}
			});
		});
	}
</script>

<main>
	<h1>Sqvuably: SvelteKit Ably Squares Realtime Multiplayer Game</h1>
	{#each Array.from({ length: rowCount }, () => 0) as _, rowIndex}
		<HorizontalLineRow {rowIndex} {columnCount} {player} />
		<GridRow {rowIndex} {columnCount} gridRow={grid[rowIndex]} {player} />
	{/each}
	<HorizontalLineRow rowIndex={rowCount} {columnCount} {player} />
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
	}
</style>
