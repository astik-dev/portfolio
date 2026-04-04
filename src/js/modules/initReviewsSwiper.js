import Swiper from "swiper";
import { EffectFlip, Navigation, Pagination } from "swiper/modules";
import { gtmEvent } from "./googleAnalytics4.js";


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
		slideChange: function () {
			gtmEvent({'event': 'reviews_slideChange'});
		},
	},
});
