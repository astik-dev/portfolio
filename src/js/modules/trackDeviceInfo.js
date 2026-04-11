import { track } from "./analytics.js";

const dpr = window.devicePixelRatio;
const screenWidthPx = Math.round(screen.width * dpr);
const screenHeightPx = Math.round(screen.height * dpr);
const viewportWidthPx = Math.round(window.innerWidth * dpr);
const viewportHeightPx = Math.round(window.innerHeight * dpr);

track("device-info", {
	screen_width_css: screen.width,
	screen_height_css: screen.height,
	screen_size_css: screen.width + " x " + screen.height,

	viewport_width_css: window.innerWidth,
	viewport_height_css: window.innerHeight,
	viewport_size_css: window.innerWidth + " x " + window.innerHeight,

	screen_width_px: screenWidthPx,
	screen_height_px: screenHeightPx,
	screen_size_px: screenWidthPx + " x " + screenHeightPx,

	viewport_width_px: viewportWidthPx,
	viewport_height_px: viewportHeightPx,
	viewport_size_px: viewportWidthPx + " x " + viewportHeightPx,

	device_pixel_ratio: dpr,

	language: window.navigator.language,
});
