import Swiper from "swiper";
import { Navigation, Pagination, Virtual } from "swiper/modules";
import { track } from "../analytics/umami.js";
import { dqs, dqsa } from "./utils.js";
import reviews from "../../../temp/reviews.json";
import { renderReviewSlide } from "./renderReviewSlide.js";


new Swiper('.reviews__swiper', {

	modules: [ Navigation, Pagination, Virtual ],

	pagination: {
		el: '.reviews__swiper-pagination',
		type: 'fraction',
	},

	navigation: {
		nextEl: '.reviews .swiper-nav_right',
		prevEl: '.reviews .swiper-nav_left',
	},

	virtual: {
		enabled: true,
		slides: reviews,
		renderSlide: renderReviewSlide,
		addSlidesAfter: 1,
		addSlidesBefore: 1,
	},

	autoHeight: true,
	grabCursor: true,

	breakpoints: {
		// when window width is >= 575.5px
		575.5: { speed: 450 }
	},

	spaceBetween: 50,

	on: {
		beforeInit: () => dqs(".reviews__slide").remove(),
		slideChange: swiper => {

			const activeSlideEl = dqs(".reviews__slide.swiper-slide-active");
			
			track("reviews-swiper-slide-change", {
				review: activeSlideEl.querySelector("a").getAttribute("href"),
				"to-index": swiper.activeIndex + 1, // to 1-based index
				direction:
					swiper.previousIndex < swiper.activeIndex ? "next" : "prev",
			});
		},
	},
});

const navButtons = dqsa(".reviews .swiper-nav");
navButtons.forEach(btn => {
	
	btn.addEventListener("mouseenter", () => {

		const isAtPageBottom =
			Math.ceil(window.scrollY) + window.innerHeight >=
			document.documentElement.scrollHeight;
			
		navButtons.forEach(btn => {
			btn.style[isAtPageBottom ? "bottom" : "top"] = btn.offsetTop + "px";
			btn.style[isAtPageBottom ? "top" : "bottom"] = "auto";
		});
	});

	btn.addEventListener("mouseleave", () => {
		const topOrBottom = btn.style.top === "auto" ? "bottom" : "top";
		navButtons.forEach(btn => btn.style[topOrBottom] = "var(--center-y)");
	});
});
