<script lang="ts">
	import myTurn from '$lib/shared/stores/myTurn';
	import verticals from '$lib/shared/stores/verticalLines';
	import type { PlayerDesignation } from '$lib/types';
	import type { Types } from 'ably';

	export let channel: Types.RealtimeChannelPromise | null;
	export let rowIndex: number;
	export let columnIndex: number;
	export let player: PlayerDesignation;

	$: markedPlayer1 = $verticals[rowIndex][columnIndex] === 'player1';
	$: markedPlayer2 = $verticals[rowIndex][columnIndex] === 'player2';
	let label = `Mark vertical line row ${rowIndex + 1}, column ${columnIndex + 1}`;
	$: {
		if (markedPlayer1) {
			label = 'Marked player 1';
		} else if (markedPlayer2) {
			label = 'Marked player 2';
		}
	}
	$: disabled = !$myTurn || markedPlayer1 || markedPlayer2;
</script>

<button
	aria-label={label}
	class="line-v"
	class:player-1={markedPlayer1}
	class:player-2={markedPlayer2}
	style:--hover-colour={player === 'player1'
		? 'var(--colour-primary-tint-50)'
		: 'var(--colour-secondary-tint-50)'}
	style:outline-color={player === 'player1' ? 'var(--colour-primary)' : 'var(--colour-secondary)'}
	{disabled}
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
/>

<style>
	button {
		--_hover-colour: var(--hover-colour, var(--colour-alt));

		background-color: var(--colour-alt-tint-50-alpha-80);
		width: var(--grid-line-width);
		height: var(--square-size);
		padding: var(--spacing-0);
		border-radius: var(--spacing-px-2);
	}

	button:not(:disabled):focus {
		background-color: var(--_hover-colour);
	}

	@media (any-hover: hover) {
		button:not(:disabled):hover {
			background-color: var(--_hover-colour);
		}
	}

	.player-1 {
		background-color: var(--colour-primary);
	}

	.player-1:focus {
		outline: 1px solid var(--colour-primary);
	}

	.player-2 {
		background-color: var(--colour-secondary);
	}
	.player-2:focus {
		outline: 1px solid var(--colour-secondary);
	}
</style>
