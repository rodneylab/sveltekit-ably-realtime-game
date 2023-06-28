export type PlayerDesignation = null | 'player1' | 'player2';

export interface Game {
	player1: string;
	player2: string;
}

export type GridSquareDesignation = PlayerDesignation | 'neutral';
