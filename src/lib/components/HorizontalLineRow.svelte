<script lang="ts">
	import horizontals from '$lib/shared/stores/horizontalLines';
	import type { PlayerDesignation } from '$lib/types';

	export let rowIndex: number;
	export let columnCount: number;
	export let player: PlayerDesignation;
</script>

<div>
	{#each $horizontals[rowIndex].slice(0, columnCount) as _, columnIndex}
		<button
			class="line-h"
			class:player-1={$horizontals[rowIndex][columnIndex] === 'player1'}
			class:player-2={$horizontals[rowIndex][columnIndex] === 'player2'}
			disabled={$horizontals[rowIndex][columnIndex] != null}
			on:click={() => {
				// set horizontals[rowIndex,columnIndex] to player and maintain all other elements
				horizontals.set([
					...$horizontals.slice(0, rowIndex),
					[
						...$horizontals[rowIndex].slice(0, columnIndex),
						player,
						...$horizontals[rowIndex].slice(columnIndex + 1)
					],
					...$horizontals.slice(rowIndex + 1)
				]);
			}}
			><span class="screen-reader-text"
				>{`Mark horizontal line row ${rowIndex + 1}, column ${columnIndex + 1}`}</span
			></button
		>
	{/each}
</div>

<style>
	.line-h {
		width: 3rem;
		height: 2px;
	}

	.player-1 {
		background-color: red;
	}

	.player-2 {
		background-color: blue;
	}
</style>
