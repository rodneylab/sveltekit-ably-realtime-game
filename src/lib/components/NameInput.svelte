<script lang="ts">
	import PlayIcon from '$lib/components/Icons/Play.svelte';
</script>

<form action="?/play" method="POST">
	<p>Enter your name then hit play to start:</p>
	<div class="name-input-wrapper">
		<label for="name" class="screen-reader-text">Name</label>
		<input id="name" type="text" name="name" placeholder="Your player name" />
		<button type="submit"><span class="button-text"> Start</span><PlayIcon width={36} /></button>
	</div>
</form>

<style lang="postcss">
	form {
		margin-bottom: var(--spacing-20);
	}

	form p {
		margin-bottom: var(--spacing-4);
		font: var(--font-weight-bold) var(--font-size-2) / var(--line-height-normal) var(--font-body);
	}

	.name-input-wrapper {
		--_border-radius: var(--spacing-2);

		display: flex;
		overflow: visible;
		margin: var(--spacing-6) auto var(--spacing-0);
		width: min(440px, 100%);
		border-radius: var(--_border-radius);
		box-shadow: var(--shadow-elevation-medium);
	}

	.name-input-wrapper input {
		border: var(--spacing-px) solid var(--colour-primary);
		border-radius: var(--_border-radius) 0 0 var(--_border-radius);
		outline: none;
		width: 100%;
	}

	.name-input-wrapper:focus-within {
		outline: solid var(--spacing-px-2) var(--colour-primary);
	}

	.name-input-wrapper button {
		position: relative;
		display: flex;
		align-items: center;
		border-radius: 0 var(--_border-radius) var(--_border-radius) 0;
		background: var(--colour-primary-linear-gradient-rotated);
		z-index: 1;
	}

	.name-input-wrapper button::before {
		content: '';
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border-radius: 0 var(--_border-radius) var(--_border-radius) 0;
		background: var(--colour-primary-linear-gradient);
		opacity: 0;
		z-index: -1;
	}

	.name-input-wrapper button:focus::before,
	.name-input-wrapper button:hover::before {
		opacity: 1;
	}

	@media (prefers-reduced-motion: no-preference) {
		button::before {
			transition: opacity 600ms ease-in-out;
		}
	}
	.name-input-wrapper .button-text {
		display: none;
	}

	@media (width > 768px) {
		.name-input-wrapper .button-text {
			display: inline;
		}
	}
</style>
