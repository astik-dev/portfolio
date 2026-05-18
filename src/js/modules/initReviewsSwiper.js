import Swiper from "swiper";
import { EffectFlip, Navigation, Pagination } from "swiper/modules";
import { track } from "../analytics/umami.js";
import { dqsa } from "./utils.js";


new Swiper('.reviews__swiper', {

	modules: [ Navigation, Pagination, EffectFlip ],

	pagination: {
		el: '.reviews__swiper-pagination',
		type: 'fraction',
	},

	navigation: {
		nextEl: '.reviews .swiper-nav_right',
		prevEl: '.reviews .swiper-nav_left',
	},

	autoHeight: true,
	grabCursor: true,

	effect: "flip",
	speed: 450,

	on: {
		slideChange: swiper => {

			const activeSlideEl = swiper.slides[swiper.activeIndex];
			
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
		navButtons.forEach(btn => btn.style.top = btn.offsetTop + "px");
	});

	btn.addEventListener("mouseleave", () => {
		navButtons.forEach(btn => btn.style.top = "50%");
	});
});
