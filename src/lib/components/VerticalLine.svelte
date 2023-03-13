<script lang="ts">
	import verticals from '$lib/shared/stores/verticalLines';
	import type { PlayerDesignation } from '$lib/types';

	export let rowIndex: number;
	export let columnIndex: number;
	export let player: PlayerDesignation;
</script>

<button
	class="line-v"
	class:player-1={$verticals[rowIndex][columnIndex] === 'player1'}
	class:player-2={$verticals[rowIndex][columnIndex] === 'player2'}
	disabled={$verticals[rowIndex][columnIndex] != null}
	on:click={() => {
		// set verticals[rowIndex,columnIndex] to player and maintain all other elements
		verticals.set([
			...$verticals.slice(0, rowIndex),
			[
				...$verticals[rowIndex].slice(0, columnIndex),
				player,
				...$verticals[rowIndex].slice(columnIndex + 1)
			],
			...$verticals.slice(rowIndex + 1)
		]);
	}}
	><span class="screen-reader-text"
		>{`Mark vertical line row ${rowIndex + 1}, column ${columnIndex + 1}`}</span
	></button
>

<style>
	.line-v {
		width: 2px;
		height: 3rem;
	}

	.player-1 {
		background-color: red;
	}

	.player-2 {
		background-color: blue;
	}
</style>
