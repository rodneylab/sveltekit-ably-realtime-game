import grid from '$lib/shared/stores/grid';
import type { GridSquareDesignation } from '$lib/types';
import type { Readable } from 'svelte/store';
import { derived } from 'svelte/store';

const store = derived<Readable<GridSquareDesignation[][]>, number[]>(grid, ($grid) =>
	$grid.reduce(
		// result is a two element array: [player1Score, player2Score]
		([player1Total, player2Total], currentRow) =>
			currentRow.reduce(
				([player1RowAccumulator, player2RowAcumulator], currentSquare) => [
					player1RowAccumulator + (currentSquare === 'player1' ? 1 : 0),
					player2RowAcumulator + (currentSquare === 'player2' ? 1 : 0),
				],
				[player1Total, player2Total],
			),
		[0, 0],
	),
);

export default store;
