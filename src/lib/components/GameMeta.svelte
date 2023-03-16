<script lang="ts">
	import myTurn from '$lib/shared/stores/myTurn';
	import type { PlayerDesignation } from '$lib/types';

	export let name: string;
	export let player: PlayerDesignation;
	export let serviceStatus: string;
	export let playerNumber: number;
	export let otherPlayerNumber: number;
	export let player1Score: number;
	export let player2Score: number;
	export let playworthyCells: number;
</script>

<div class="player-name">
	{#if player}
		<div
			class="player-indicator"
			class:player-1={player === 'player1'}
			class:player-2={player === 'player2'}
		/>{/if}Playing as {name}
</div>
<p class="network-status">Network Status: {serviceStatus}</p>
<div class="score">
	<span class="score-1-label">
		{playerNumber === 1 ? name : 'Player One'}
	</span>
	<span class="score-numbers">
		{player1Score}<span class="score-separator">&thinsp;&ndash;&thinsp;</span>{player2Score}</span
	>
	<span class="score-2-label"> {playerNumber === 2 ? name : 'Player Two'}</span>
</div>
{#if playworthyCells !== 0}
	<p class="turn">{$myTurn ? 'Your turn!' : `Player ${otherPlayerNumber}’s turn…`}</p>
{:else if player1Score > player2Score}
	Player 1 wins
{:else if player2Score > player1Score}
	Player 2 wins
{:else}
	Draw
{/if}

<style lang="postcss">
	.player-name {
		display: flex;
		align-items: center;
		margin-bottom: var(--spacing-2);
	}

	.network-status {
		font-size: var(--font-size-0);
		margin-bottom: var(--spacing-4);
	}

	.score {
		display: grid;
		grid-template-areas:
			'score-1-label . score-2-label'
			'score-numbers score-numbers score-numbers';
		grid-template-columns: 1fr 1rem 1fr;
		column-gap: var(--spacing-1);
		align-self: center;
		align-items: center;
		font-size: var(--font-size-2);
		font-family: var(--font-heading);
		max-width: var(--max-width-text-wrapper);
		margin-bottom: var(--spacing-8);
		padding-top: var(--spacing-4);
	}

	@media (width > 768px) {
		.score {
			display: grid;
			grid-template-areas: 'score-1-label score-numbers score-2-label';
			grid-template-columns: 1fr auto 1fr;
			column-gap: var(--spacing-2);
		}
	}

	.score-1-label {
		grid-area: score-1-label;
		text-align: right;
	}
	.score-numbers {
		grid-area: score-numbers;
		font-weight: var(--font-weight-bold);
		font-size: var(--font-size-3);
		text-align: center;
	}
	.score-2-label {
		grid-area: score-2-label;
	}

	.turn {
		margin-bottom: var(--spacing-8);
	}
	.player-indicator {
		width: var(--spacing-4);
		height: var(--spacing-4);
		margin-right: var(--spacing-2);
		border: var(--spacing-px) solid var(--colour-dark);
	}
</style>
