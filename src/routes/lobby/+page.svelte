<script lang="ts">
	import { applyAction, deserialize } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import LogoutIcon from '$lib/components/Icons/Logout.svelte';
	import PlayIcon from '$lib/components/Icons/Play.svelte';
	import app from '$lib/configuration';
	import { clickOutside } from '$lib/shared/actions/clickOutside';
	import '$lib/styles/fonts.css';
	import '$lib/styles/global.css';
	import { Temporal } from '@js-temporal/polyfill';
	import type { Types } from 'ably';
	import { Realtime } from 'ably';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const { ablyChannelName } = app;

	let { myClientId, name, token } = data ?? {};

	let channel: Types.RealtimeChannelPromise | null = null;

	let presentPlayers: { clientId: string; name: string; timestamp: number }[] = [];

	interface GameInvitation {
		player1: string;
		player2: string;
		gameId: string;
		name: string;
	}

	let incomingInvitation: GameInvitation | null = null;
	let openInvitation: GameInvitation | null = null;

	onMount(async () => {
		const ably = new Realtime.Promise({
			...token,

			authCallback: () => {
				/* todo(rodneylab): add token refresh logic */
			}
		});

		await ably.connection.once('connected');

		channel = ably.channels.get(ablyChannelName);

		await channel?.attach();

		await channel?.presence.enter({ name });

		await channel.presence.subscribe(async (presenceUpdate) => {
			const { action, data } = presenceUpdate;

			if (action === 'update') {
				const { target, type } = data;
				if (target === myClientId) {
					if (type === 'invite') {
						const { gameId, name: player1Name, sender } = data;
						incomingInvitation = {
							player1: sender,
							player2: myClientId,
							gameId,
							name: player1Name
						};
					} else if (type === 'accept-invitation') {
						const { sender, target, gameId } = data;
						const body = new FormData();
						body.append('player1', target);
						body.append('player2', sender);
						body.append('gameId', gameId);
						body.append('token', JSON.stringify(token));
						const response = await fetch('?/play', {
							credentials: 'same-origin',
							method: 'POST',
							body
						});
						const result = deserialize(await response.text());
						const { type } = result;
						if (type === 'success') {
							await invalidateAll();
						}
						await channel?.presence.leave({ name });
						applyAction(result);
					}
				}
				return;
			}

			presentPlayers = [];

			const updatedPresentMembers = (await channel?.presence.get()) ?? [];
			if (updatedPresentMembers) {
				let initial: Record<string, { clientId: string; name: string; timestamp: number }> = {};
				const presentPlayersObject = updatedPresentMembers.reduce(
					(accumulator, { action, clientId, data, timestamp }) => {
						if (action === 'present') {
							const existing = accumulator[clientId];
							if (!existing || timestamp > existing.timestamp) {
								accumulator[clientId] = {
									clientId,
									name: data.name,
									timestamp
								};
							}
						}
						return accumulator;
					},
					initial
				);

				presentPlayers = Object.entries(presentPlayersObject)
					.map(([_key, value]) => value)
					.filter(({ clientId }) => clientId !== myClientId);
			}
		});
	});

	async function handleInvitation({
		otherPlayerClientId,
		otherPlayerName
	}: {
		otherPlayerClientId: string;
		otherPlayerName: string;
	}) {
		const gameId = crypto.randomUUID();
		openInvitation = {
			player1: myClientId,
			player2: otherPlayerClientId,
			gameId,
			name: otherPlayerName
		};

		await channel?.presence.update({
			type: 'invite',
			sender: myClientId,
			target: otherPlayerClientId,
			gameId,
			name: otherPlayerName
		});
	}

	async function handleInvitationAcceptance(this: HTMLFormElement) {
		if (incomingInvitation) {
			const { player1: target, player2: sender, gameId } = incomingInvitation;
			await channel?.presence.update({
				type: 'accept-invitation',
				sender,
				target,
				gameId
			});
			const body = new FormData(this);
			body.append('token', JSON.stringify(token));
			const response = await fetch(this.action, {
				credentials: 'same-origin',
				method: 'POST',
				body
			});
			const result = deserialize(await response.text());
			const { type } = result;
			if (type === 'success') {
				await invalidateAll();
			}
			await channel?.presence.leave({ name });
			applyAction(result);
		}
	}

	function timestampToDurationString(timestamp: number): string {
		const now = Temporal.Now.instant();
		const timestampInstant = Temporal.Instant.fromEpochMilliseconds(timestamp);
		const { seconds } = now.since(timestampInstant, { smallestUnit: 'second' });
		return `${seconds}s ago`;
	}
</script>

<div class="wrapper">
	<h1>Sqvuably Lobby</h1>
	<div>
		<p>
			Welcome to the Sqvuably lobby {name} 👋🏽. To start playing, invite a player listed below or wait
			for one of them to invite you. If you want to play a friend, ask them to go to
			<a href="https://sqvuably.rodneylab.com/">sqvuably.rodneylab.com</a>, enter a player name and
			hit the <strong>Start</strong> button.
		</p>

		<form class="logout" action="?/logout" method="POST">
			<button type="submit"><span class="screen-reader-text">Log out</span> <LogoutIcon /></button>
		</form>
	</div>
	<h2>Waiting players</h2>
	<ul>
		{#each presentPlayers as { clientId: otherPlayerClientId, name: otherPlayerName, timestamp }}
			<li>
				<span class="player">
					<span class="player-name">{otherPlayerName}</span> active {timestampToDurationString(
						timestamp
					)}</span
				>
				<button on:click={() => handleInvitation({ otherPlayerClientId, otherPlayerName })}
					>Invite {otherPlayerName}</button
				>
			</li>
		{:else}
			There aren&rsquo;t any other players waiting right now.
		{/each}
	</ul>

	{#if incomingInvitation}
		{@const { player1, player2, gameId } = incomingInvitation}
		<section class="modal-wrapper">
			<div
				use:clickOutside
				on:outclick={() => {
					incomingInvitation = null;
				}}
				class="modal-content incoming-invite"
			>
				<p>{incomingInvitation.name} invited you to join a game!</p>
				<form action="?/play" method="POST" on:submit|preventDefault={handleInvitationAcceptance}>
					<div>
						<input type="hidden" name="player1" value={player1} />
						<input type="hidden" name="player2" value={player2} />
						<input type="hidden" name="gameId" value={gameId} />
						<button type="submit"
							><span class="button-text"> Play {incomingInvitation.name}</span><PlayIcon
								width={36}
							/></button
						>
					</div>
				</form>
			</div>
		</section>
	{/if}
	{#if openInvitation}
		{@const { name } = openInvitation}
		<section class="modal-wrapper">
			<div
				use:clickOutside
				on:outclick={() => {
					openInvitation = null;
				}}
				class="modal-content"
			>
				You invited {name} to play. Waiting for their response&hellip;
			</div>
		</section>
	{/if}
</div>

<style lang="postcss">
	.wrapper {
		display: flex;
		flex-direction: column;
		max-width: var(--max-width-container-text);
		margin-inline: auto;
	}

	.logout {
		display: flex;
		justify-content: flex-end;
	}

	ul {
		list-style-type: none;
		padding-left: var(--spacing-0);
	}

	li {
		display: grid;
		grid-template-areas:
			'player'
			'invite-button';
		margin-bottom: var(--spacing-12);

		& button {
			grid-area: invite-button;
			display: flex;
			justify-content: center;
			background-color: var(--colour-secondary);
			color: var(--colour-light);
		}
	}

	.logout button {
		display: flex;
		background-color: var(--colour-secondary);
		color: var(--colour-light);
		padding: var(--spacing-2);
	}

	@media (width > 768px) {
		li {
			display: grid;
			grid-template-columns: auto auto 33%;
			grid-template-areas: 'player . invite-button';
			align-items: center;
			margin-bottom: var(--spacing-8);
		}
	}

	.player {
		grid-area: player;
		font-style: italic;
		margin-bottom: var(--spacing-4);
	}

	@media (width > 768px) {
		.player {
			margin-bottom: unset;
		}
	}

	.player-name {
		font: normal var(--font-weight-bold) var(--font-size-2) var(--font-heading);
	}

	.incoming-invite form {
		display: flex;
		justify-content: center;
		margin-top: var(--spacing-8);

		& button {
			display: flex;
			align-items: center;
		}
	}

	.modal-wrapper {
		display: flex;
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100%;
		background-color: hsl(0 0% 0% / 50%);
	}
	.modal-content {
		background-color: var(--colour-alt);
		height: fit-content;
		margin: auto;
		padding: var(--spacing-12);
		border-radius: var(--spacing-1);
		font-size: var(--font-size-3);
	}
</style>
