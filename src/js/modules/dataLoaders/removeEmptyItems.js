export function removeEmptyItems(className, itemsContainer) {
	if (itemsContainer.querySelector(className)) {
		itemsContainer.querySelectorAll(className).forEach(emptyItem => {
			emptyItem.remove();
		});
	}
}
