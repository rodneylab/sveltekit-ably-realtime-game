<script lang="ts">
	import VerticalLine from '$lib/components/VerticalLine.svelte';
	import verticals from '$lib/shared/stores/verticalLines';
	import type { GridSquareDesignation, PlayerDesignation } from '$lib/types';
	import type { Types } from 'ably';

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
	}

	.square {
		--_square-margin: var(--spacing-px);
		--_square-side-length: calc(var(--square-size) - (2 * var(--_square-margin)));

		width: var(--_square-side-length);
		height: var(--_square-side_length);
		margin: var(--_square-margin);
	}

	.player-1 {
		background-color: var(--colour-primary-tint-50);
	}

	.player-2 {
		background-color: var(--colour-secondary-tint-50);
	}
</style>
