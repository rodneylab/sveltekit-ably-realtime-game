<script lang="ts">
	import horizontals from '$lib/shared/stores/horizontalLines';
	import type { PlayerDesignation } from '$lib/types';
	import type { Types } from 'ably';
	import HorizontalLine from './HorizontalLine.svelte';

	export let channel: Types.RealtimeChannelPromise | null;
	export let player: PlayerDesignation;
	export let rowIndex: number;
	export let columnCount: number;
</script>

<div class="horizontals-wrapper">
	{#each $horizontals[rowIndex].slice(0, columnCount) as _, columnIndex}
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
