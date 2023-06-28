import type { Redis } from '@upstash/redis';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace svelteHTML {
		interface HTMLAttributes<T> {
			'on:outclick'?: (e: CustomEvent) => void;
		}
	}
	namespace App {
		interface Locals {
			redis: Redis;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
