import { PUBLIC_COLUMNS, PUBLIC_ROWS } from '$env/static/public';
import type { PlayerDesignation } from '$lib/types';
import { writable } from 'svelte/store';

const rowCount = Number.parseInt(PUBLIC_ROWS, 10);
const columnCount = Number.parseInt(PUBLIC_COLUMNS, 10);

// Matrix representing all the vertical square borders in the grid
let verticals: PlayerDesignation[][] = Array.from({ length: rowCount }, () =>
	Array.from({ length: columnCount + 1 }, () => null)
);

const store = writable<PlayerDesignation[][]>(verticals);

export default store;
