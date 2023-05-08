<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import GameMeta from '$lib/components/GameMeta.svelte';
	import Grid from '$lib/components/Grid.svelte';
	import Header from '$lib/components/Header.svelte';
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
	import { Realtime } from 'ably';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

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

		channel?.subscribe(({ name: messageName, data: messageData }) => {
			console.log({ messageName, messageData });
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

	const title = 'Sqvuably: SvelteKit Ably Real-time Squares Game';
	const description =
		'SvelteKit Ably: introduction to using Svelte with Ably and building a real-time ♟️ game or instant 💬 chat with serverless WebSockets.';
</script>

<svelte:head>
	<title>{title}</title>
	<meta title="description" content={description} />
	<meta
		name="robots"
		content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
	/>
	<link rel="canonical" href="https://sqvuably.rodneylab.com" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content="https://sqvuably.rodneylab.com/sqvuably-twitter.png" />
	<meta name="twitter:creator" content="@askRodney" />
	<meta name="twitter:site" content="@askRodney" />
	<meta name="twitter:label1" content="Written by" />
	<meta name="twitter:data1" content="Rodney Lab" />
	<meta property="og:site_name" content="Sqvuably: SvelteKit Ably Real-time Squares Game" />
	<meta property="og:locale" content="en_GB" />
	<meta property="og:url" content="https://sqvuably.rodneylab.com" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Sqvuably: SvelteKit Ably Real-time Squares Game" />
	<meta
		property="og:description"
		content="SvelteKit Ably: introduction to using Svelte with Ably and building a real-time ♟️ game or instant 💬 chat with serverless WebSockets."
	/>
	<meta property="og:image" content="https://sqvuably.rodneylab.com/sqvuably-og.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="627" />
	<meta property="og:image:alt" content="Sqvuably: Rodney Lab Demo" />
</svelte:head>

<Header />
<main>
	<h1>Sqvuably</h1>
	<h2>Squares with Svelte and Ably</h2>
	{#if !name}
		<NameInput />
	{:else}
		<GameMeta
			{gameId}
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
</main>
<Footer />

<style lang="postcss">
	main {
		display: flex;
		flex-direction: column;
		width: calc(var(--max-width-full) - var(--spacing-12));
		margin: var(--spacing-6) var(--spacing-outer) var(--spacing-24);
		max-width: var(--max-width-full);
		min-height: 100vh;
	}

	@media screen and (width > 768px) {
		main {
			width: min(var(--max-width-full) - var(--spacing-24), var(--max-width-wrapper));
			margin: var(--spacing-6) auto var(--spacing-24);
		}
	}

	h2 {
		margin-bottom: var(--spacing-16);
	}
</style>
