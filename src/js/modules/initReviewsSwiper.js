import Swiper from "swiper";
import { EffectFlip, Navigation, Pagination } from "swiper/modules";
import { track } from "./analytics.js";


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

	breakpoints: {	
		// when window width is >= 767.5px
		767.5: {
			resistanceRatio: 0,
		},
	},

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
