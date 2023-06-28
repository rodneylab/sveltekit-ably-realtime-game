import { ABLY_API_KEY } from '$env/static/private';
import { Temporal } from '@js-temporal/polyfill';
import { fail, redirect, error as svelteKitError } from '@sveltejs/kit';
import type { Types } from 'ably';
import Ably from 'ably';
import type { Actions, PageServerLoad } from './$types';

const REDIS_HASHSET_KEY = 'games';

let ably: Types.RealtimePromise | null = null;
try {
	ably = new Ably.Realtime.Promise(ABLY_API_KEY);
} catch (error: unknown) {
	console.error({ error });
}

export const actions: Actions = {
	logout: ({ cookies }) => {
		const session = cookies.get('session');
		if (session) {
			cookies.delete('session', { path: '/' });
		}
		throw redirect(303, '/');
	},
	play: async ({ cookies, locals, request }) => {
		const form = await request.formData();
		const player1 = form.get('player1');
		const player2 = form.get('player2');
		const gameId = form.get('gameId');
		const token = form.get('token');

		if (
			typeof player1 === 'string' &&
			player1 &&
			typeof player2 === 'string' &&
			player2 &&
			typeof gameId === 'string' &&
			gameId &&
			typeof token === 'string' &&
			token
		) {
			const session = cookies.get('session');
			if (typeof session === 'string') {
				const { clientId, name } = JSON.parse(session);

				await locals.redis.hset(REDIS_HASHSET_KEY, {
					[gameId]: JSON.stringify({ player1, player2 })
				});

				// player name stored to cookie
				cookies.set(
					'session',
					// JSON.stringify({ clientId, gameId, name, player1, player2, token }),
					JSON.stringify({ clientId, gameId, name, token }),
					{
						path: '/',
						expires: new Date(Temporal.Now.plainDateTimeISO().add({ hours: 2 }).toString()),
						sameSite: 'lax',
						httpOnly: true
					}
				);
				throw redirect(303, '/');
			}
		}
		return fail(400, {});
	}
};

export const load: PageServerLoad = async function load({ cookies, url }) {
	if (!ably) {
		console.error('No ably!');
		throw svelteKitError(502, 'Bad Gateway');
	}
	const session = cookies.get('session');
	if (session) {
		const { clientId, name } = JSON.parse(session);
		const token = await ably.auth.requestToken({ clientId });
		const { searchParams } = url;
		const somethingWentWrong = searchParams.get('error') === 'true';

		return { myClientId: clientId, name, token, somethingWentWrong };
	}
	throw redirect(303, '/');
};
