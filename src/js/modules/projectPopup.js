import { doc, dqs, dqsa } from "./utils.js";
import imageCreator from "./imageCreator.js";
import { gtmEvent } from "./googleAnalytics4.js";
import { getProjects } from "./data/projects.js";


let openClosePermissionProjectPopup = true;


function setScrollWidthCssVar() {
	const scrollWidth = window.innerWidth - doc.documentElement.clientWidth;
	doc.documentElement.style.setProperty('--scroll-width', `${scrollWidth}px`);
}

export function openCloseProjectPopup(eventTarget) {

	const projects = getProjects();

	if (eventTarget && eventTarget.classList.contains("projects__item_empty")) return;

	if (openClosePermissionProjectPopup == true) {
		openClosePermissionProjectPopup = false;

		if (!dqs(".open-project-popup") && eventTarget !== undefined) {

			setScrollWidthCssVar();


			// Toggle scroll event for all ".swiper-slide" elements (Google Tag Manager)
			function toggleScrollEvent(action) {

				let cssSelector = ".project-popup__image-swiper-wrapper .swiper-slide";

				if (dqs(cssSelector)) {
					if (action == "add") {
						dqsa(cssSelector).forEach((slide) => {
							slide.addEventListener('scroll', scrollEvent, { once: true });
						});
					} else if (action == "remove") {
						dqsa(cssSelector).forEach((slide) => {
							slide.removeEventListener('scroll', scrollEvent);
						});
					}
				}		
			}
			function scrollEvent(event) {
				let link = event.target.querySelector("a").href;
				let startIndex = link.indexOf("/projects/") + 10; // 10 = "/projects/" length
				let trimmedLink = link.substring(startIndex);
				gtmEvent({'event': 'project_slideScroll', 'projectTrimmedLink': trimmedLink});
			}


			toggleScrollEvent("remove");


			// Checking which project was clicked
			const projectsItemAll = dqsa(".projects__item");
			let projectsItemIndex;

			projectsItemAll.forEach((item, index) => {
				if (eventTarget == item) {
					projectsItemIndex = index;
				}
			});


			// Getting data from JSON
			let pFolder = projects[projectsItemIndex].folder,
				pTitle = projects[projectsItemIndex].title,
				pDescription = projects[projectsItemIndex].description,
				pRepository = projects[projectsItemIndex].repository,
				pDemo = projects[projectsItemIndex].demo,
				pScreenshots = projects[projectsItemIndex].screenshots;


			// Set title & description
			const projectPopupTitle = dqs(".project-popup__container h3");
			const projectPopupText = dqs(".project-popup__container p");

			projectPopupTitle.textContent = pTitle;
			projectPopupText.textContent = pDescription;

			projectPopupText.scrollTop = 0;


			// Set buttons
			[pRepository, pDemo].forEach((link, index) => {
				const btn = dqs(`.project-popup__btn:nth-child(${index + 1})`);
				const isLinkEmpty = link == "";
				
				btn.classList.toggle("project-popup__btn_disabled", isLinkEmpty);
				
				if (isLinkEmpty) btn.removeAttribute("href");
				else btn.href = link;
			});

			dqs(".project-popup__btns").classList.toggle(
				"project-popup__btns_disabled",
				pRepository == "" && pDemo == ""
			);


			// Generate screenshots slides
			function generateSlides(screenshots) {
				let slides = ``;
				for (let i = 1; i <= screenshots; i++) {
					const slideImgPath = `projects/${pFolder}/full-size/${i}`;
					const slide = `<div class="project-popup__image-slide swiper-slide">
										<a href="${imageCreator.fullPath("external", slideImgPath)}.jpeg" target="_blank">
											${imageCreator.newWebpPic(
												"external",
												slideImgPath+".webp",
												slideImgPath+".jpeg",
												`Project image ${i}`,
												"lazy"
											)}
										</a>
									</div>`;
					slides += slide;
				}
				return slides;
			}

			dqs(".project-popup__image-swiper-wrapper")
				.innerHTML = generateSlides(pScreenshots);
			swiperProjectPopup.slideTo(0, 1, false);
			toggleScrollEvent("add");

			function showScrollAnimation(image) {
				if (image.scrollHeight > dqs(".project-popup__image").clientHeight) {
					setTimeout(() => {
						dqs(".project-popup__image-scroll").classList.add("project-popup__image-scroll_animation");
					}, 600);
				}
			}

			setTimeout(() => {
				// Load first two (if available) images
				dqsa(".project-popup__image-slide:nth-child(-n+2) picture").forEach((slidePic, index) => {
					imageCreator.loadPictureSources(slidePic);
					if (index == 0) {
						const picImg = slidePic.querySelector("img");
						picImg.addEventListener("load", () => showScrollAnimation(picImg));
					}
				});
			}, 300);
		}

		dqs("body").classList.toggle("open-project-popup");

		setTimeout(() => {
			openClosePermissionProjectPopup = true;
		}, 300);
	}
}

const swiperProjectPopup = new Swiper('.project-popup__image-swiper', {
	// Navigation arrows
	navigation: {
	    nextEl: '.project-popup__image .swiper-nav_right',
	    prevEl: '.project-popup__image .swiper-nav_left',
	},

	pagination: {
	    el: '.project-popup__swiper-pagination',
	    type: 'fraction',
	},

	simulateTouch: false,
	allowTouchMove: false,

	on: {
		slideChange: function () {
			gtmEvent({'event': 'project_slideChange'});

			// Loading next-next image
			const nextNextPic = dqs(".project-popup__image-slide.swiper-slide-next + .project-popup__image-slide picture");
			if (nextNextPic) {
				setTimeout(() => {
					const picImg = nextNextPic.querySelector("img");
					if (picImg.src != imageCreator.px1) {
						imageCreator.loadPictureSources(nextNextPic);
					}
				}, 300); // 300 - Default duration of transition between slides (in ms)
			}
		},
	},
});
