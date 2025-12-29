import { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } from '$env/static/private';
import { Redis } from '@upstash/redis';

export const handle = async ({ event, resolve }) => {
	event.locals.redis = new Redis({ url: UPSTASH_REDIS_REST_URL, token: UPSTASH_REDIS_REST_TOKEN });

	return resolve(event);
};
