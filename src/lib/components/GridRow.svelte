<script lang="ts">
	import verticals from '$lib/shared/stores/verticalLines';
	import type { PlayerDesignation } from '$lib/types';
	import VerticalLine from './VerticalLine.svelte';

	export let rowIndex: number;
	export let columnCount: number;
	export let gridRow: (null | 'player1' | 'player2')[];
	export let player: PlayerDesignation;
</script>

<div class="row-wrapper">
	{#each $verticals[rowIndex].slice(0, columnCount) as _, columnIndex}
		<VerticalLine {rowIndex} {columnIndex} {player} />
		<div
			class="square"
			class:player-1={gridRow[columnIndex] === 'player1'}
			class:player-2={gridRow[columnIndex] === 'player2'}
		/>
	{/each}
	<VerticalLine {rowIndex} columnIndex={columnCount} {player} />
</div>

<style>
	.row-wrapper {
		display: flex;
		width: 100%;
	}

	.square {
		background-color: grey;
		width: 3rem;
		height: 3rem;
	}

	.player-1 {
		background-color: red;
	}

	.player-2 {
		background-color: blue;
	}
</style>
