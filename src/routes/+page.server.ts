import type { PlayerDesignation } from '$lib/types';
import { Temporal } from '@js-temporal/polyfill';
import { fail, redirect } from '@sveltejs/kit';
import type { Types } from 'ably';
import type { Actions, PageServerLoad } from './$types';

export const actions: Actions = {
	logout: ({ cookies }) => {
		const session = cookies.get('session');
		if (session) {
			cookies.delete('session');
		}
		throw redirect(303, '/');
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
				httpOnly: true
			});

			throw redirect(303, '/lobby');
		}
		return fail(400, { name, missing: true });
	}
};

export const load: PageServerLoad = async function load({ cookies, url }) {
	const session = cookies.get('session');
	if (session) {
		const {
			clientId,
			gameId,
			name,
			player1,
			player2,
			token: stringifiedToken
		} = JSON.parse(session);

		let player: PlayerDesignation = null;
		if (player1 === clientId) {
			player = 'player1';
		} else if (player2 === clientId) {
			player = 'player2';
		}

		const token = JSON.parse(stringifiedToken) as Types.TokenDetails;
		return { gameId, name, player, token, playerIds: [player1, player2] };
	}
};
