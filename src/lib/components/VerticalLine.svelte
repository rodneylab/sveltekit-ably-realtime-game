<script lang="ts">
	import myTurn from '$lib/shared/stores/myTurn';
	import verticals from '$lib/shared/stores/verticalLines';
	import type { PlayerDesignation } from '$lib/types';
	import type { Types } from 'ably';

	export let channel: Types.RealtimeChannelPromise | null;
	export let rowIndex: number;
	export let columnIndex: number;
	export let player: PlayerDesignation;
</script>

<button
	class="line-v"
	class:player-1={$verticals[rowIndex][columnIndex] === 'player1'}
	class:player-2={$verticals[rowIndex][columnIndex] === 'player2'}
	disabled={!channel || !$myTurn || $verticals[rowIndex][columnIndex] != null}
	on:click={() => {
		myTurn.set(false);
		if (channel) {
			channel.publish('turn', {
				player,
				vertical: true,
				row: rowIndex,
				column: columnIndex
			});
		}
	}}
	><span class="screen-reader-text"
		>{`Mark vertical line row ${rowIndex + 1}, column ${columnIndex + 1}`}</span
	></button
>

<style>
	.line-v {
		width: 2px;
		height: 3rem;
	}

	.player-1 {
		background-color: red;
	}

	.player-2 {
		background-color: blue;
	}
</style>
