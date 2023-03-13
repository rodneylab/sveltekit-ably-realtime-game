import type { PlayerDesignation } from '$lib/types';
import { writable } from 'svelte/store';
import { PUBLIC_ROWS, PUBLIC_COLUMNS } from '$env/static/public';

const rowCount = Number.parseInt(PUBLIC_ROWS, 10);
const columnCount = Number.parseInt(PUBLIC_COLUMNS, 10);

let horizontals: PlayerDesignation[][] = Array.from({ length: rowCount + 1 }, () =>
	Array.from({ length: columnCount }, () => null)
);

const store = writable<PlayerDesignation[][]>(horizontals);

export default store;
