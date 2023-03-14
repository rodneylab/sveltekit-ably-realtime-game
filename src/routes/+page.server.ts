import { ABLY_API_KEY } from '$env/static/private';
import type { PlayerDesignation } from '$lib/types';
import { Temporal } from '@js-temporal/polyfill';
import { error as svelteKitError, fail, redirect } from '@sveltejs/kit';
import Ably from 'ably';
import type { Actions, PageServerLoad } from './$types';

interface Game {
	gameId: string;
	player1: string;
	player2: string | null;
}

// only player ids are stored here a no other player details
let games: Game[] = [];

const ably = new Ably.Realtime.Promise(ABLY_API_KEY);

export const actions: Actions = {
	login: async ({ cookies, request }) => {
		const form = await request.formData();
		const name = form.get('name');
		if (typeof name === 'string' && name) {
			let clientId = cookies.get('clientId');
			if (!clientId) {
				clientId = crypto.randomUUID();
			}

			// try to push this new player into an existing games with only one (waiting) player
			let game = games.find(({ player2 }) => player2 === null);
			if (game) {
				game.player2 = clientId;
			} else {
				game = { gameId: crypto.randomUUID(), player1: clientId, player2: null };
				games.push(game);
			}

			// player name stored to cookie
			const { gameId } = game;
			cookies.set('session', JSON.stringify({ clientId, gameId, name }), {
				path: '/',
				expires: new Date(Temporal.Now.plainDateTimeISO().add({ hours: 2 }).toString()),
				sameSite: 'lax',
				httpOnly: true
			});

			throw redirect(303, '/');
		}
		return fail(400, { name, missing: true });
	}
};

export const load: PageServerLoad = async function load({ cookies, url }) {
	try {
		const session = cookies.get('session');
		if (session) {
			const { clientId, gameId, name } = JSON.parse(session);
			const token = await ably.auth.requestToken({ clientId });
			const { player1, player2 } =
				games.find(({ gameId: elementGameId }) => gameId === elementGameId) ?? {};

			let player: PlayerDesignation = null;
			if (player1 === clientId) {
				player = 'player1';
			} else if (player2 === clientId) {
				player = 'player2';
			}
			return { name, player, token, playerIds: [player1, player2] };
		}
	} catch (error: unknown) {
		const { pathname } = url;
		const message = `Error in server load function for ${pathname}: ${error as string}`;
		console.error(message);
		throw svelteKitError(500, message);
	}
};
