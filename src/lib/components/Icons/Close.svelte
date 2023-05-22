<script lang="ts">
	import Icon, { addCollection } from '@iconify/svelte/dist/OfflineIcon.svelte';

	export let label: string = 'close icon';
	export let colour: string = 'inherit';
	export let ariaHidden: boolean = false;
	export let width: number = 32;
	export let height: number = width;

	addCollection({
		prefix: 'lucide',
		lastModified: 1684733842,
		aliases: {},
		width: 24,
		height: 24,
		icons: {
			x: {
				body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12"/>'
			}
		}
	});

	// https://api.iconify.design/lucide.json?icons=x
</script>

<Icon
	color={colour}
	role="img"
	icon="lucide:x"
	aria-label={label}
	aria-hidden={ariaHidden ? 'true' : 'false'}
	{width}
	{height}
/>
