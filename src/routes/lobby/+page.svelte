<script lang="ts">
	import { applyAction, deserialize } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import CloseIcon from '$lib/components/Icons/Close.svelte';
	import LogoutIcon from '$lib/components/Icons/Logout.svelte';
	import PlayIcon from '$lib/components/Icons/Play.svelte';
	import app from '$lib/configuration';
	import { clickOutside } from '$lib/shared/actions/clickOutside';
	import '$lib/styles/fonts.css';
	import '$lib/styles/global.css';
	import { Temporal } from '@js-temporal/polyfill';
	import type { Types } from 'ably';
	import ably from 'ably';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	const { Realtime } = ably;

	let { data }: PageData = $props();

	const { ablyChannelName } = app;

	let { myClientId, name, somethingWentWrong, token } = $derived(data ?? {});

	let channel: Types.RealtimeChannelPromise | null = $state(null);

	let presentPlayers: { clientId: string; name: string; timestamp: number }[] = $state([]);

	interface GameInvitation {
		player1: string;
		player2: string;
		gameId: string;
		name: string;
	}

	let incomingInvitation: GameInvitation | null = $state(null);
	let openInvitation: GameInvitation | null = $state(null);

	onMount(async () => {
		const ably = new Realtime.Promise({
			...token,

			authCallback: () => {
				/* todo(rodneylab): add token refresh logic */
			},
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
							name: player1Name,
						};
					} else if (type === 'accept-invitation') {
						// other player has accpeted this players previously extended invitation
						const { sender, target, gameId } = data;
						const body = new FormData();
						body.append('player1', target);
						body.append('player2', sender);
						body.append('gameId', gameId);
						body.append('token', JSON.stringify(token));
						const response = await fetch('?/play', {
							credentials: 'same-origin',
							method: 'POST',
							body,
						});
						const result = deserialize(await response.text());
						const { type } = result;
						if (type === 'success') {
							await invalidateAll();
						}
						openInvitation = null;
						await channel?.presence.leave({ name });
						applyAction(result);
					} else if (type === 'rescind-invitation') {
						const { gameId } = data;
						if (incomingInvitation?.gameId === gameId) {
							incomingInvitation = null;
						}
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
									timestamp,
								};
							}
						}
						return accumulator;
					},
					initial,
				);

				presentPlayers = Object.entries(presentPlayersObject)
					.map(([, value]) => value)
					.filter(({ clientId }) => clientId !== myClientId);
			}
		});
	});

	async function handleInvitation({
		otherPlayerClientId,
		otherPlayerName,
	}: {
		otherPlayerClientId: string;
		otherPlayerName: string;
	}) {
		const gameId = crypto.randomUUID();
		openInvitation = {
			player1: myClientId,
			player2: otherPlayerClientId,
			gameId,
			name: otherPlayerName,
		};

		await channel?.presence.update({
			type: 'invite',
			sender: myClientId,
			target: otherPlayerClientId,
			gameId,
			name,
		});
	}

	async function handleRescindInvitation() {
		if (openInvitation) {
			const { gameId, name, player2 } = openInvitation;
			await channel?.presence.update({
				type: 'rescind-invitation',
				sender: myClientId,
				target: player2,
				gameId,
				name,
			});
			openInvitation = null;
		}
	}

	async function handleInvitationAcceptance(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement },
	) {
		event.preventDefault();
		if (incomingInvitation) {
			const { player1: target, player2: sender, gameId } = incomingInvitation;
			await channel?.presence.update({
				type: 'accept-invitation',
				sender,
				target,
				gameId,
			});
			const body = new FormData(event.currentTarget);
			body.append('token', JSON.stringify(token));
			const response = await fetch(event.currentTarget.action, {
				credentials: 'same-origin',
				method: 'POST',
				body,
			});
			const result = deserialize(await response.text());
			const { type } = result;
			if (type === 'success') {
				await invalidateAll();
			}
			incomingInvitation = null;
			await channel?.presence.leave({ name });
			applyAction(result);
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		const { key } = event;
		if (key === 'Escape') {
			if (openInvitation != null) {
				handleRescindInvitation();
			} else if (incomingInvitation != null) {
				incomingInvitation = null;
			}
		}
	}

	function timestampToDurationString(timestamp: number): string {
		const now = Temporal.Now.instant();
		const timestampInstant = Temporal.Instant.fromEpochMilliseconds(timestamp);
		const { seconds } = now.since(timestampInstant, { smallestUnit: 'second' });
		return `${seconds}s ago`;
	}
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="wrapper">
	<h1>Sqvuably Lobby</h1>
	<div>
		{#if somethingWentWrong}
			<p><strong> Something went wrong. Try setting up your game again.</strong></p>
		{:else}
			<p>
				Welcome to the Sqvuably lobby {name} 👋🏽. To start playing, invite a player listed below or wait
				for one of them to invite you. If you want to play a friend, ask them to go to
				<a href="https://sqvuably.rodneylab.com/">sqvuably.rodneylab.com</a>, enter a player name
				and hit the <strong>Start</strong> button.
			</p>
		{/if}
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
						timestamp,
					)}</span
				>
				<button onclick={() => handleInvitation({ otherPlayerClientId, otherPlayerName })}
					>Invite {otherPlayerName}</button
				>
			</li>
		{:else}
			There aren&rsquo;t any other players waiting right&nbps;now.
		{/each}
	</ul>

	{#if incomingInvitation}
		{@const { player1, player2, gameId } = incomingInvitation}
		<section class="modal-wrapper">
			<div
				use:clickOutside
				onoutclick={() => {
					incomingInvitation = null;
				}}
				class="modal-content incoming-invite"
			>
				<div class="close-button-wrapper">
					<button
						onclick={() => {
							incomingInvitation = null;
						}}
						type="button"
						class="close-button"
					>
						<span class="screen-reader-text">Cancel invitation</span>
						<CloseIcon width={24} /></button
					>
				</div>
				<p>{incomingInvitation.name} invited you to join a game!</p>
				<form action="?/play" method="POST" onsubmit={handleInvitationAcceptance}>
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
			<div use:clickOutside onoutclick={handleRescindInvitation} class="modal-content">
				<div class="close-button-wrapper">
					<button onclick={handleRescindInvitation} type="button" class="close-button">
						<span class="screen-reader-text">Cancel invitation</span>
						<CloseIcon width={24} /></button
					>
				</div>
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
			box-shadow: var(--shadow-elevation-low);
			border-radius: var(--spacing-1);
		}
	}

	.logout button {
		display: flex;
		background-color: var(--colour-secondary);
		color: var(--colour-light);
		padding: var(--spacing-2);
		box-shadow: var(--shadow-elevation-low);
	}

	.player {
		grid-area: player;
		font-style: italic;
		margin-bottom: var(--spacing-4);
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
		width: min(48rem, 100%);
		height: fit-content;
		margin: auto;
		padding: var(--spacing-12);
		font-size: var(--font-size-3);

		& .close-button-wrapper {
			display: flex;
		}

		& .close-button {
			background-color: transparent;
			padding: var(--spacing-3);
			margin: calc(-1 * var(--spacing-3)) calc(-1 * var(--spacing-3)) var(--spacing-0) auto;
		}
	}

	@media (--desktop-device) {
		li {
			display: grid;
			grid-template-columns: auto auto 33%;
			grid-template-areas: 'player . invite-button';
			align-items: center;
			margin-bottom: var(--spacing-8);
		}

		.player {
			margin-bottom: unset;
		}

		.modal-content {
			border-radius: var(--spacing-1);
		}
	}
</style>
