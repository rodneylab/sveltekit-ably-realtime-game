<script lang="ts">
	import GameMeta from '$lib/components/GameMeta.svelte';
	import Grid from '$lib/components/Grid.svelte';
	import NameInput from '$lib/components/NameInput.svelte';
	import Rules from '$lib/components/Rules.svelte';
	import app from '$lib/configuration';
	import grid from '$lib/shared/stores/grid';
	import horizontals from '$lib/shared/stores/horizontalLines';
	import myTurn from '$lib/shared/stores/myTurn';
	import score from '$lib/shared/stores/score';
	import verticals from '$lib/shared/stores/verticalLines';
	import '$lib/styles/fonts.css';
	import '$lib/styles/global.css';
	import type { PlayerDesignation } from '$lib/types';
	import type { Types } from 'ably';
	import ably from 'ably';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	const { Realtime } = ably;

	export let data: PageData;

	const { ablyChannelName, rowCount, columnCount } = app;

	let [player1Score, player2Score] = $score;
	$: [player1Score, player2Score] = $score;
	let { gameId, name, player = null, token } = data ?? {};

	let channel: Types.RealtimeChannelPromise | null = null;
	$: serviceStatus = channel ? 'Connected to Ably' : 'Offline';

	let playerNumber = (player && player === 'player1' ? 1 : 2) ?? 0;
	let otherPlayerNumber = (player && player === 'player1' ? 2 : 1) ?? 0;

	let playworthyCells = columnCount * rowCount;

	let otherPlayer: PlayerDesignation =
		(player && playerNumber === 1 ? 'player2' : 'player1') ?? null;

	onMount(async () => {
		// serviceStatus = 'Offline';
		myTurn.set(player === 'player1');
		const ably = new Realtime.Promise({
			...token,

			authCallback: () => {
				/* todo(rodneylab): add token refresh logic */
			}
		});

		await ably.connection.once('connected');

		channel = ably.channels.get(ablyChannelName);

		// // leave the lobby since we are about to start playing
		// await channel?.presence.leave({ name });

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
	});
</script>

<h1>Sqvuably</h1>
<h2>Squares with Svelte and Ably</h2>
{#if !name}
	<NameInput />
{:else}
	<GameMeta
		{name}
		{player}
		{serviceStatus}
		{playerNumber}
		{otherPlayerNumber}
		{player1Score}
		{player2Score}
		{playworthyCells}
	/>
{/if}
<Grid {channel} {player} />
<Rules />

<style lang="postcss">
	h2 {
		margin-bottom: var(--spacing-16);
	}
</style>
