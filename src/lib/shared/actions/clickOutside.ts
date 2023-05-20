import { browser } from '$app/environment';

export function clickOutside(node: HTMLElement) {
	const handleClick = (event: MouseEvent) => {
		if (!node.contains(event.target as HTMLElement)) {
			node.dispatchEvent(new CustomEvent('outclick'));
		}
	};

	browser && document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			browser && document.removeEventListener('click', handleClick, true);
		}
	};
}
