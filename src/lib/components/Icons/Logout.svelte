<script lang="ts">
	import Icon, { addCollection } from '@iconify/svelte/dist/OfflineIcon.svelte';

	export let label: string = 'logout icon';
	export let colour: string = 'inherit';
	export let ariaHidden: boolean = false;
	export let width: number = 32;
	export let height: number = width;

	addCollection({
		prefix: 'teenyicons',
		lastModified: 1656267513,
		aliases: {},
		width: 15,
		height: 15,
		icons: {
			'logout-outline': {
				body: '<path fill="none" stroke="currentColor" d="m13.5 7.5l-3 3.25m3-3.25l-3-3m3 3H4m4 6H1.5v-12H8"/>'
			}
		}
	});

	// https://api.iconify.design/teenyicons.json?icons=logout-outline
</script>

<Icon
	color={colour}
	role="img"
	icon="teenyicons:logout-outline"
	aria-label={label}
	aria-hidden={ariaHidden ? 'true' : 'false'}
	{width}
	{height}
/>
