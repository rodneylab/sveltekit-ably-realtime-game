<script lang="ts">
	import verticals from '$lib/shared/stores/verticalLines';
	import type { GridSquareDesignation, PlayerDesignation } from '$lib/types';
	import type { Types } from 'ably';
	import VerticalLine from '$lib/components/VerticalLine.svelte';

	export let channel: Types.RealtimeChannelPromise | null;
	export let gridRow: GridSquareDesignation[];
	export let player: PlayerDesignation;
	export let rowIndex: number;
	export let columnCount: number;
</script>

<div class="row-wrapper">
	{#each $verticals[rowIndex].slice(0, columnCount) as _, columnIndex}
		<VerticalLine {channel} {player} {rowIndex} {columnIndex} />
		<div
			class="square"
			class:player-1={gridRow[columnIndex] === 'player1'}
			class:player-2={gridRow[columnIndex] === 'player2'}
		/>
	{/each}
	<VerticalLine {channel} {player} {rowIndex} columnIndex={columnCount} />
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
