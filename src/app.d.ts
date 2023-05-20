// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace svelte.JSX {
		interface HTMLAttributes<T> {
			onoutclick?: (e: CustomEvent) => void;
		}
	}
	namespace App {
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
