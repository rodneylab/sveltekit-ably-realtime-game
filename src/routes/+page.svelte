<script lang="ts">
	import { PUBLIC_ABLY_CHANNEL, PUBLIC_COLUMNS, PUBLIC_ROWS } from '$env/static/public';
	import Grid from '$lib/components/Grid.svelte';
	import grid from '$lib/shared/stores/grid';
	import horizontals from '$lib/shared/stores/horizontalLines';
	import myTurn from '$lib/shared/stores/myTurn';
	import score from '$lib/shared/stores/score';
	import verticals from '$lib/shared/stores/verticalLines';
	import '$lib/styles/global.css';
	import type { PlayerDesignation } from '$lib/types';
	import type { Types } from 'ably';
	import { Realtime } from 'ably';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const ablyChannelName = PUBLIC_ABLY_CHANNEL;

	let [player1Score, player2Score] = $score;
	$: [player1Score, player2Score] = $score;
	let { name, player = null, playerIds, token } = data ?? {};
	$: ({ name, player = null, playerIds, token } = data ?? {});

	let channel: Types.RealtimeChannelPromise | null = null;
	let serviceStatus = '';

	let playerNumber = (player && player === 'player1' ? 1 : 2) ?? 0;
	let otherPlayerNumber = (player && player === 'player1' ? 2 : 1) ?? 0;

	let myId = (playerIds && playerIds[playerNumber - 1]) ?? null;

	const rowCount = Number.parseInt(PUBLIC_ROWS, 10);
	const columnCount = Number.parseInt(PUBLIC_COLUMNS, 10);
	let turnsRemaining = 2 * columnCount * rowCount + rowCount + columnCount;
	let playworthyCells = columnCount * rowCount;

	let otherPlayer: PlayerDesignation =
		(player && playerNumber === 1 ? 'player2' : 'player1') ?? null;

	onMount(async () => {
		serviceStatus = 'Offline';
		myTurn.set(player === 'player1');
		const ably = new Realtime.Promise({
			...token,

			authCallback: () => {
				/* todo(rodneylab): add token refresh logic */
			}
		});

		await ably.connection.once('connected');

		channel = ably.channels.get(ablyChannelName);

		channel?.subscribe(({ name: messageName, data: messageData }) => {
			if (messageName === 'turn') {
				const { player: messagePlayer, vertical, row, column } = messageData;

				const messagePlayerNumber = messagePlayer === 'player1' ? 1 : 2;

				const playerInitialScore = $score[messagePlayerNumber - 1];
				if (vertical) {
					// set verticals[row,column] to otherPlayer and maintain all other elements
					verticals.set([
						// rows before changed row
						...$verticals.slice(0, row),
						// changed row
						[
							// columns before changed column
							...$verticals[row].slice(0, column),
							// changed column
							messagePlayer,
							//columns after changed column
							...$verticals[row].slice(column + 1)
						],
						// rows after changed row
						...$verticals.slice(row + 1)
					]);
				} else {
					horizontals.set([
						...$horizontals.slice(0, row),
						[
							...$horizontals[row].slice(0, column),
							messagePlayer,
							...$horizontals[row].slice(column + 1)
						],
						...$horizontals.slice(row + 1)
					]);
				}
				// if other player has played it is now my turn
				const playerUpdatedScore = $score[messagePlayerNumber - 1];

				// if the player scored they get another turn
				if (playerUpdatedScore > playerInitialScore) {
					myTurn.set(messagePlayer === player);
				} else {
					myTurn.set(messagePlayer === otherPlayer);
				}
				turnsRemaining -= 1;
				playworthyCells = $grid.reduce(
					(runningCount, currentRow) =>
						currentRow.reduce(
							(rowRunningCount, currentSquare) =>
								rowRunningCount + (currentSquare === null ? 1 : 0),
							runningCount
						),
					0
				);
			}
		});

		if (channel) {
			serviceStatus = 'Connected to ably';
		}
	});
</script>

<main>
	<h1>Sqvuably: SvelteKit Ably Squares Realtime Multiplayer Game</h1>
	<p>Network Status: {serviceStatus}</p>
	<p>
		{playerNumber === 1 ? name : 'Player 1'}
		{player1Score}&thinsp;&ndash;&thinsp;{player2Score}
		{playerNumber === 2 ? name : 'Player 2'}
	</p>
	{#if !name}
		<form action="?/login" method="POST">
			<label for="name">Name</label>
			<input id="name" type="text" name="name" placeholder="Your login name" />
			<button type="submit">Login</button>
		</form>
	{:else}
		Playing as {name}
		{#if player}
			<div
				class="player-indicator"
				class:player-1={player === 'player1'}
				class:player-2={player === 'player2'}
			/>{/if}
		{#if playworthyCells !== 0}
			<p>{$myTurn ? 'Your turn!' : `Player ${otherPlayerNumber}’s turn...`}</p>
		{:else if player1Score > player2Score}
			Player 1 wins
		{:else if player2Score > player1Score}
			Player 2 wins
		{:else}
			Draw
		{/if}
	{/if}

	<Grid {channel} {player} />
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
	}

	.player-indicator {
		width: 1rem;
		height: 1rem;
	}

	.player-1 {
		background-color: red;
	}

	.player-2 {
		background-color: blue;
	}
</style>
