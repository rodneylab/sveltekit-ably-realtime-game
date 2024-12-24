<script lang="ts">
	/* This is code is based on an adaptation by https://twitter.com/jaffathecake of
	https://jsbin.com/mamisar/edit?html,css,js,output By https://twitter.com/flackrw 
	*/

	import { onMount } from 'svelte';

	let header: HTMLDivElement;
	let headerHeight: number;
	let headerShifterHeight = 0;

	function fixHeaderOffset() {
		header.style.setProperty('--computed-height', `${headerHeight}px`);

		headerShifterHeight =
			Math.min(
				header.offsetTop,
				document.documentElement.scrollHeight - window.innerHeight - headerHeight,
			) - 1;
	}

	onMount(() => {
		header.style.position = 'sticky';
		header.style.top = 'calc(var(--_computed-height) * -1 - 1px)';
		header.style.bottom = 'calc(100% - var(--_computed-height))';
		fixHeaderOffset();
	});
</script>

<svelte:window on:scroll={fixHeaderOffset} on:resize={fixHeaderOffset} />

<div style:height="{headerShifterHeight}px" class="header-shifter"></div>
<div
	bind:this={header}
	bind:clientHeight={headerHeight}
	style:margin-bottom="-{headerShifterHeight}px"
	class="header"
>
	<header class="wrapper">Real-time, online game built with Svelte and Ably.</header>
</div>

<style>
	.header-shifter {
		background-color: var(--colour-dark);
	}
	.header {
		--_computed-height: var(--computed-height, 100px);

		position: relative;
		color: var(--colour-alt);
		background-color: var(--colour-dark);
		padding: var(--spacing-2);
		box-shadow: var(--shadow-elevation-medium);
		border-bottom: var(--spacing-px-2) solid var(--colour-dark);
	}
	.wrapper {
		width: var(--max-width-full);
		margin: var(--spacing-2) auto;
		max-width: var(--max-width-full);
		font: var(--font-weight-normal) var(--font-size-2) var(--font-body);
		text-align: center;
	}
</style>
