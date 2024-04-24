import { dqs } from "../utils.js";
import { removeEmptyItems } from "./removeEmptyItems.js";
import imageCreator from "../imageCreator.js";
import { gtmEvent } from "../googleAnalytics4.js";


const colors = {
    red: "#fa1111",
    orange: "#fab43c",
    green: "#2CB67D",
}
const avatarAlt = `Avatar`;


function reviewsSlideHTML ({avatar, name, grade, text, date, link, linkText}) {
    
	const avatarElem = avatar == ""
		? imageCreator.newImg("local", `reviews/user-avatar.svg`, avatarAlt)
		: imageCreator.newWebpPic("external", `reviews/${avatar}.webp`, `reviews/${avatar}.jpeg`, avatarAlt);
	
	grade = +grade; // to number

    const gradeColor =
        grade < 5 ? colors.red :
        grade < 7 ? colors.orange :
        colors.green;
    
    return `
        <div class="reviews__slide swiper-slide">
            <div class="reviews__slide-top">
                ${avatarElem}
                <h5>${name}</h5>
                <h4 class="reviews__slide-grade">
                    <span style="color: ${gradeColor};">${grade}/10</span>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"viewBox="0 0 47.94 47.94" xml:space="preserve"> <path fill="${gradeColor}" d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"/> </svg>
                </h4>
            </div>
            <p>${text}</p>
            <div class="reviews__slide-bottom">
                <span>${date}</span>
                <a href="${link}" target="_blank" title="Go to source">${linkText}</a>
            </div>
        </div>
    `;
}

export function loadReviews(reviews) {
	
    reviews.sort((a, b) => -(a.text.length - b.text.length));
	
	const reviewsSwiperWrapper = dqs(".reviews__swiper-wrapper");

	removeEmptyItems(".reviews__slide_empty", reviewsSwiperWrapper);

	reviews.forEach((review) => {
		reviewsSwiperWrapper.insertAdjacentHTML(
            "beforeend",
            reviewsSlideHTML(review)
        );
	});

	initSwiper();
}

function initSwiper () {
    new Swiper('.reviews__swiper', {

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
}
