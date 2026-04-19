/**
 * @param {string} key 
 * @returns {string | null}
 */
export function getQueryParam(key) {
	const params = new URLSearchParams(window.location.search);
	return params.get(key);
}

/**
 * @param {string} key 
 * @param {string} value
 * @returns {void} 
 */
export function setQueryParam(key, value) {
	const url = new URL(window.location.href);
	url.searchParams.set(key, value);
	window.history.pushState({}, "", url);
}

/**
 * @param {string} key 
 * @param {object} [options={}]
 * @param {boolean} [options.replace=false]
 * @returns {void} 
 */
export function deleteQueryParam(key, { replace = false } = {}) {
	const url = new URL(window.location.href);
	url.searchParams.delete(key);
	window.history[replace ? "replaceState" : "pushState"]({}, "", url);
}
