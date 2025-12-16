<script lang="ts">
	import horizontals from '$lib/shared/stores/horizontalLines';
	import type { PlayerDesignation } from '$lib/types';
	import HorizontalLine from './HorizontalLine.svelte';
	import type { Types } from 'ably';

	let {
		channel,
		player,
		rowIndex,
		columnCount,
	}: {
		channel: Types.RealtimeChannelPromise | null;
		player: PlayerDesignation;
		rowIndex: number;
		columnCount: number;
	} = $props();
</script>

<div class="horizontals-wrapper">
	{#each $horizontals[rowIndex].slice(0, columnCount) as _, columnIndex (columnIndex)}
		<HorizontalLine {channel} {player} {rowIndex} {columnIndex} />
	{/each}
</div>

<style>
	.horizontals-wrapper {
		display: flex;
		gap: var(--grid-line-width);
		padding-inline: var(--grid-line-width);
	}
</style>
