import { browser } from '$app/environment';

export function clickOutside(node: HTMLElement) {
	const handleClick = (event: MouseEvent) => {
		if (!node.contains(event.target as HTMLElement)) {
			node.dispatchEvent(new CustomEvent('outclick'));
		}
	};

	if (browser) {
		document.addEventListener('click', handleClick, true);
	}

	return {
		destroy() {
			if (browser) {
				document.removeEventListener('click', handleClick, true);
			}
		},
	};
}
