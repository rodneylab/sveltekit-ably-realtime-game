import type { Game, PlayerDesignation } from '$lib/types';
import type { Actions, PageServerLoad } from './$types';
import { Temporal } from '@js-temporal/polyfill';
import { fail, redirect } from '@sveltejs/kit';
import type { Types } from 'ably';

const REDIS_HASHSET_KEY = 'games';

export const actions: Actions = {
	logout: ({ cookies }) => {
		const session = cookies.get('session');
		if (session) {
			cookies.delete('session', { path: '/' });
		}
		redirect(303, '/');
	},
	play: async ({ cookies, request }) => {
		const form = await request.formData();
		const name = form.get('name');
		if (typeof name === 'string' && name) {
			let clientId = cookies.get('clientId');
			if (!clientId) {
				clientId = crypto.randomUUID();
			}

			// player name stored to cookie
			cookies.set('session', JSON.stringify({ clientId, gameId: crypto.randomUUID(), name }), {
				path: '/',
				expires: new Date(Temporal.Now.plainDateTimeISO().add({ hours: 2 }).toString()),
				sameSite: 'lax',
				httpOnly: true,
			});

			redirect(303, '/lobby');
		}
		return fail(400, { name, missing: true });
	},
};

export const load: PageServerLoad = async function load({ cookies, locals }) {
	const session = cookies.get('session');
	if (session) {
		const { clientId, gameId, name, token: stringifiedToken } = JSON.parse(session);
		const token = JSON.parse(stringifiedToken) as Types.TokenDetails;

		const game = (await locals.redis.hget(REDIS_HASHSET_KEY, gameId)) as Game | null;
		if (game) {
			const { player1, player2 } = game;
			let player: PlayerDesignation = null;
			if (player1 === clientId) {
				player = 'player1';
				return { gameId, name, player, token, playerIds: [player1, player2] };
			}
			if (player2 === clientId) {
				player = 'player2';
				return { gameId, name, player, token, playerIds: [player1, player2] };
			}
		}
		redirect(303, '/lobby?error=true');
	}
};
