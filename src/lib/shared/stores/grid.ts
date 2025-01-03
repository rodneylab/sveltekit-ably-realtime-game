import app from '$lib/configuration';
import horizontals from '$lib/shared/stores/horizontalLines';
import verticals from '$lib/shared/stores/verticalLines';
import type { GridSquareDesignation } from '$lib/types';
import { derived } from 'svelte/store';

const { rowCount, columnCount } = app;

const initialGrid: GridSquareDesignation[][] = Array.from({ length: rowCount }, () =>
	Array.from({ length: columnCount }, () => null),
);

const store = derived(
	[horizontals, verticals],
	([$horizontals, $verticals]) => {
		const result = initialGrid;

		initialGrid.forEach((row, rowIndex) => {
			row.forEach((_, columnIndex) => {
				if (
					$horizontals[rowIndex][columnIndex] === 'player1' &&
					$horizontals[rowIndex + 1][columnIndex] === 'player1' &&
					$verticals[rowIndex][columnIndex] === 'player1' &&
					$verticals[rowIndex][columnIndex + 1] === 'player1'
				) {
					result[rowIndex][columnIndex] = 'player1';
				} else if (
					$horizontals[rowIndex][columnIndex] === 'player2' &&
					$horizontals[rowIndex + 1][columnIndex] === 'player2' &&
					$verticals[rowIndex][columnIndex] === 'player2' &&
					$verticals[rowIndex][columnIndex + 1] === 'player2'
				) {
					result[rowIndex][columnIndex] = 'player2';
				} else if (
					/* If any grid square has any side marked by one player and another side marked by the
					 * other player then neither player will be able to take the square.  The game can end
					 * early if there is only this type of square left in the grid.
					 * */
					($horizontals[rowIndex][columnIndex] === 'player1' ||
						$horizontals[rowIndex + 1][columnIndex] === 'player1' ||
						$verticals[rowIndex][columnIndex] === 'player1' ||
						$verticals[rowIndex][columnIndex + 1] === 'player1') &&
					($horizontals[rowIndex][columnIndex] === 'player2' ||
						$horizontals[rowIndex + 1][columnIndex] === 'player2' ||
						$verticals[rowIndex][columnIndex] === 'player2' ||
						$verticals[rowIndex][columnIndex + 1] === 'player2')
				) {
					result[rowIndex][columnIndex] = 'neutral';
				}
			});
		});
		return result;
	},
	initialGrid,
);

export default store;
