import app from '$lib/configuration';
import type { PlayerDesignation } from '$lib/types';
import { writable } from 'svelte/store';

const { rowCount, columnCount } = app;

// Matrix representing all the horizontal square borders in the grid
let horizontals: PlayerDesignation[][] = Array.from({ length: rowCount + 1 }, () =>
	Array.from({ length: columnCount }, () => null)
);

const store = writable<PlayerDesignation[][]>(horizontals);

export default store;
