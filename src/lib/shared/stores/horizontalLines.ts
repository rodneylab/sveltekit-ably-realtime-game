import { PUBLIC_COLUMNS, PUBLIC_ROWS } from '$env/static/public';
import type { PlayerDesignation } from '$lib/types';
import { writable } from 'svelte/store';

const rowCount = Number.parseInt(PUBLIC_ROWS, 10);
const columnCount = Number.parseInt(PUBLIC_COLUMNS, 10);

// Matrix representing all the horizontal square borders in the grid
let horizontals: PlayerDesignation[][] = Array.from({ length: rowCount + 1 }, () =>
	Array.from({ length: columnCount }, () => null)
);

const store = writable<PlayerDesignation[][]>(horizontals);

export default store;
