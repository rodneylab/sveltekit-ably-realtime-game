import app from '$lib/configuration';
import type { PlayerDesignation } from '$lib/types';
import { writable } from 'svelte/store';

const { rowCount, columnCount } = app;

// Matrix representing all the vertical square borders in the grid
const verticals: PlayerDesignation[][] = Array.from({ length: rowCount }, () =>
	Array.from({ length: columnCount + 1 }, () => null),
);

const store = writable<PlayerDesignation[][]>(verticals);

export default store;
