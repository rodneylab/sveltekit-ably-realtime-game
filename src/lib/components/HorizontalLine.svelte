<script lang="ts">
	import horizontals from '$lib/shared/stores/horizontalLines';
	import myTurn from '$lib/shared/stores/myTurn';
	import type { PlayerDesignation } from '$lib/types';
	import type { Types } from 'ably';

	export let channel: Types.RealtimeChannelPromise | null;
	export let player: PlayerDesignation;
	export let rowIndex: number;
	export let columnIndex: number;
	$: markedPlayer1 = $horizontals[rowIndex][columnIndex] === 'player1';
	$: markedPlayer2 = $horizontals[rowIndex][columnIndex] === 'player2';
	$: disabled = !$myTurn || $horizontals[rowIndex][columnIndex] != null;
	let label = `Mark horizontal line row ${rowIndex + 1}, column ${columnIndex + 1}`;
	$: {
		if (markedPlayer1) {
			label = 'Marked player 1';
		} else if (markedPlayer2) {
			label = 'Marked player 2';
		}
	}
</script>

<button
	aria-label={label}
	class="line-h"
	class:player-1={markedPlayer1}
	class:player-2={markedPlayer2}
	{disabled}
	style:--hover-colour={player === 'player1'
		? 'var(--colour-primary-tint-50)'
		: 'var(--colour-secondary-tint-50)'}
	on:click={() => {
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

<style>
	button {
		--_hover-colour: var(--hover-colour, var(--colour-alt));

		background-color: var(--colour-alt-tint-50-alpha-80);
		width: var(--square-size);
		height: var(--grid-line-width);
		padding: var(--spacing-0);
		border-radius: var(--spacing-px-2);
	}

	button:not(:disabled):focus,
	button:not(:disabled):hover {
		background-color: var(--_hover-colour);
	}

	.player-1 {
		background-color: var(--colour-primary);
	}

	.player-2 {
		background-color: var(--colour-secondary);
	}
</style>
