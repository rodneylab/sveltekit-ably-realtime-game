<script lang="ts">
	import LogoutIcon from '$lib/components/Icons/Logout.svelte';
	import myTurn from '$lib/shared/stores/myTurn';
	import type { PlayerDesignation } from '$lib/types';

	let {
		name,
		player,
		serviceStatus,
		playerNumber,
		otherPlayerNumber,
		player1Score,
		player2Score,
		playworthyCells,
	}: {
		name: string;
		player: PlayerDesignation;
		serviceStatus: string;
		playerNumber: number;
		otherPlayerNumber: number;
		player1Score: number;
		player2Score: number;
		playworthyCells: number;
	} = $props();
</script>

<div class="player-name">
	{#if player}
		<div
			class="player-indicator"
			class:player-1={player === 'player1'}
			class:player-2={player === 'player2'}
		></div>{/if}Playing as {name}
	<form class="logout" action="?/logout" method="POST">
		<button type="submit"><span class="screen-reader-text">Log out</span> <LogoutIcon /></button>
	</form>
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
	<p class="turn">Player 1 wins</p>
{:else if player2Score > player1Score}
	<p class="turn">Player 2 wins</p>
{:else}
	<p class="turn">Draw</p>
{/if}

<style lang="postcss">
	.player-name {
		display: flex;
		align-items: center;
		margin-bottom: var(--spacing-8);
	}

	.logout {
		margin-left: auto;
	}

	.logout button {
		display: flex;
		background-color: var(--colour-secondary);
		color: var(--colour-light);
		padding: var(--spacing-2);
		box-shadow: var(--shadow-elevation-low);
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

	@media (--desktop-device) {
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
		border-radius: var(--spacing-px-2);
		box-shadow: var(--shadow-elevation-medium);
	}
</style>
