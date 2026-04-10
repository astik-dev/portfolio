/**
 * @type {any[][] | null}
 */
let pendingTrackCalls = [];

export const track = (...args) => {
	if (window.umami) {
		window.umami.track(...args);
	} else if (pendingTrackCalls) {
		pendingTrackCalls.push(args);
	}
};

const umamiScript = document.querySelector("script[src='js/u.js']");

umamiScript.addEventListener("load", () => {
	if (window.umami) {
		pendingTrackCalls.forEach(args => window.umami.track(...args));
	}
	pendingTrackCalls = null;
});

umamiScript.addEventListener("error", () => pendingTrackCalls = null);
