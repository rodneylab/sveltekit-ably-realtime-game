<script lang="ts">
	import Icon, { addCollection } from '@iconify/svelte/dist/OfflineIcon.svelte';

	const ELEMENT_BRAND_COLOUR = '#161823';

	export let width: number = 48;
	export let height: number = width;
	export let colour: string = ELEMENT_BRAND_COLOUR;
	export let label: string = 'Play';
	export let ariaHidden: boolean = false;

	addCollection({
		prefix: 'material-symbols',
		lastModified: 1678433314,
		aliases: { 'play-arrow-sharp': { parent: 'play-arrow' } },
		width: 24,
		height: 24,
		icons: { 'play-arrow': { body: '<path fill="currentColor" d="M8 19V5l11 7Z"/>' } }
	});

	// https://api.iconify.design/material-symbols.json?icons=play-arrow-sharp
</script>

<Icon
	color={colour}
	role="img"
	aria-label={label}
	aria-hidden={ariaHidden ? 'true' : 'false'}
	icon="material-symbols:play-arrow-sharp"
	{width}
	{height}
/>
