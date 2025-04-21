<script lang="ts">
	import GithubIcon from '$lib/components/Icons/Github.svelte';
	import XIcon from '$lib/components/Icons/X.svelte';
	import app from '$lib/configuration';

	const { githubPage, twitterUsername } = app;
	const COPYRIGHT_ENTITY = '\u00a9'; // (c)
</script>

<footer>
	<div class="footer-wrapper">
		<p class="notice">
			Created by <a
				aria-label="Open the Rodney Lab site"
				href="https://rodneylab.com/"
				target="_blank"
				rel="noopener noreferrer">Rodney Lab</a
			>. Copyright {COPYRIGHT_ENTITY}&nbsp;2023&thinsp;&ndash;&thinsp;2025.
		</p>
		<nav class="footer-icons" aria-label="Links to external sites">
			<ul>
				<li>
					<a
						aria-label="Go to the Rodney Lab Git Hub In Page"
						rel="nofollow noopener noreferer"
						target="_blank"
						href={`https://github.com/${githubPage}`}><GithubIcon /></a
					>
				</li>
				<li>
					<a
						aria-label="Go to the Rodney Lab X Page"
						rel="nofollow noopener noreferer"
						target="_blank"
						href={`https://x.com/intent/user?screen_name=${twitterUsername}`}><XIcon /></a
					>
				</li>
			</ul>
		</nav>
	</div>
</footer>

<style>
	.footer-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: calc(var(--max-width-full) - var(--spacing-12));
		padding-block: var(--spacing-4);
		margin: var(--spacing-4) var(--spacing-outer) var(--spacing-0);
		max-width: var(--max-width-full);
	}

	.notice {
		margin-bottom: var(--spacing-4);
	}

	ul {
		display: flex;
		flex-direction: row;
		gap: var(--spacing-8);
		padding-block: var(--spacing-4);
	}

	li {
		transition: all 0.25s ease-in-out;
	}

	@media (prefers-reduced-motion: reduce) {
		li {
			transition: all 2s ease-in-out;
		}
	}

	li:focus {
		transform: scale(1.2);
	}

	@media (any-hover: hover) {
		li:hover {
			transform: scale(1.2);
		}
	}
</style>
