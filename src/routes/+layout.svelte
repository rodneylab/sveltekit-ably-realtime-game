<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import '$lib/styles/fonts.css';
	import '$lib/styles/global.css';

	let { children } = $props();

	const title = 'Sqvuably: SvelteKit Ably Real-time Squares Game';
	const description =
		'SvelteKit Ably: introduction to using Svelte with Ably and building a real-time ♟️ game or instant 💬 chat with serverless WebSockets.';
</script>

<svelte:head>
	<title>{title}</title>
	<meta title="description" content={description} />
	<meta
		name="robots"
		content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
	/>
	<link rel="canonical" href="https://sqvuably.rodneylab.com" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content="https://sqvuably.rodneylab.com/sqvuably-twitter.png" />
	<meta name="twitter:creator" content="@askRodney" />
	<meta name="twitter:site" content="@askRodney" />
	<meta name="twitter:label1" content="Written by" />
	<meta name="twitter:data1" content="Rodney Lab" />
	<meta property="og:site_name" content="Sqvuably: SvelteKit Ably Real-time Squares Game" />
	<meta property="og:locale" content="en_GB" />
	<meta property="og:url" content="https://sqvuably.rodneylab.com" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Sqvuably: SvelteKit Ably Real-time Squares Game" />
	<meta
		property="og:description"
		content="SvelteKit Ably: introduction to using Svelte with Ably and building a real-time ♟️ game or instant 💬 chat with serverless WebSockets."
	/>
	<meta property="og:image" content="https://sqvuably.rodneylab.com/sqvuably-og.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="627" />
	<meta property="og:image:alt" content="Sqvuably: Rodney Lab Demo" />
</svelte:head>

<Header />
<main>
	{@render children?.()}
</main>
<Footer />

<style lang="postcss">
	main {
		display: flex;
		flex-direction: column;
		width: calc(var(--max-width-full) - var(--spacing-12));
		margin: var(--spacing-6) var(--spacing-outer) var(--spacing-24);
		max-width: var(--max-width-full);
		min-height: 100vh;
	}

	@media (--desktop-device) {
		main {
			width: min(var(--max-width-full) - var(--spacing-24), var(--max-width-wrapper));
			margin: var(--spacing-6) auto var(--spacing-24);
		}
	}
</style>
