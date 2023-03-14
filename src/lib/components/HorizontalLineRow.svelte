<script lang="ts">
	import horizontals from '$lib/shared/stores/horizontalLines';
	import myTurn from '$lib/shared/stores/myTurn';
	import type { PlayerDesignation } from '$lib/types';
	import type { Types } from 'ably';

	export let channel: Types.RealtimeChannelPromise | null;
	export let player: PlayerDesignation;
	export let rowIndex: number;
	export let columnCount: number;
</script>

<div>
	{#each $horizontals[rowIndex].slice(0, columnCount) as _, columnIndex}
		<button
			class="line-h"
			class:player-1={$horizontals[rowIndex][columnIndex] === 'player1'}
			class:player-2={$horizontals[rowIndex][columnIndex] === 'player2'}
			disabled={!channel || !$myTurn || $horizontals[rowIndex][columnIndex] != null}
			on:click={() => {
				myTurn.set(false);
				if (channel) {
					channel.publish('turn', {
						player,
						vertical: false,
						row: rowIndex,
						column: columnIndex
					});
				}
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
