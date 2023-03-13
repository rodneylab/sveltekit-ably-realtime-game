import type { PlayerDesignation } from '$lib/types';
import { writable } from 'svelte/store';
import { PUBLIC_ROWS, PUBLIC_COLUMNS } from '$env/static/public';

const rowCount = Number.parseInt(PUBLIC_ROWS, 10);
const columnCount = Number.parseInt(PUBLIC_COLUMNS, 10);

let verticals: PlayerDesignation[][] = Array.from({ length: rowCount }, () =>
	Array.from({ length: columnCount + 1 }, () => null)
);

const store = writable<PlayerDesignation[][]>(verticals);

export default store;
