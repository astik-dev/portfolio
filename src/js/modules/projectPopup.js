import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { doc, dqs, dqsa } from "./utils.js";
import imageCreator from "./imageCreator.js";
import { track } from "./analytics.js";


const projectPopupTransitionDuration = 300;
let projectPopupInTransition = false;


const projectPopup = {

	setTitle(title) {
		dqs(".project-popup__container h3").textContent = title;
	},

	setDescription(descriptionText) {
		const descriptionElem = dqs(".project-popup__container p");
		descriptionElem.textContent = descriptionText;	
		descriptionElem.scrollTop = 0;
	},

	setLinkButtons(repositoryLink, demoLink, projectFolder) {
		const linkButtons = [repositoryLink, demoLink];

		linkButtons.forEach((link, index) => {
			const btn = dqs(`.project-popup__btn:nth-child(${index + 1})`);
			const isLinkEmpty = link == "";

			btn.classList.toggle("project-popup__btn_disabled", isLinkEmpty);

			if (isLinkEmpty) {
				btn.removeAttribute("href");
			} else {
				btn.href = link;
				btn.dataset.umamiEventProject = projectFolder;
			}
		});

		dqs(".project-popup__btns").classList.toggle(
			"project-popup__btns_disabled",
			linkButtons.every(link => link == "")
		);
	},
}

function setScrollWidthCssVar() {
	const scrollWidth = window.innerWidth - doc.documentElement.clientWidth;
	doc.documentElement.style.setProperty('--scroll-width', `${scrollWidth}px`);
}

function imageSlideHTML(projectFolder, index) {
	const imagePathWithoutExt = `projects/${projectFolder}/full-size/${index}`;
	return `
		<div class="project-popup__image-slide swiper-slide">
			<a
				href="${imageCreator.fullPath("external", imagePathWithoutExt)}.jpeg"
				target="_blank"
				data-umami-event="project-popup-screenshot-click"
				data-umami-event-project="${projectFolder}"
				data-umami-event-screenshot-index="${index}"
				data-umami-event-screenshot="${projectFolder}_${index}"
			>
				${imageCreator.newWebpPic(
					"external",
					imagePathWithoutExt + ".webp",
					imagePathWithoutExt + ".jpeg",
					`Project screenshot ${index}`,
					"lazy"
				)}
			</a>
		</div>
	`;
}

function imageSlideScrollEvent(event) {
	const link = event.target.querySelector("a").href;
	const startIndex = link.indexOf("/projects/") + "/projects/".length;
	track("project-popup-swiper-slide-scroll", {
		img: link.substring(startIndex),
	});
}

function addScrollEventToImageSlides() {
	const swiperSlideElems = dqsa(".project-popup__image-swiper-wrapper .swiper-slide");
	if (swiperSlideElems.length < 1) return;
	swiperSlideElems.forEach(slide => {
		slide.addEventListener('scroll', imageSlideScrollEvent, { once: true });
	});
}

function showScrollAnimation(image) {
	if (image.scrollHeight > dqs(".project-popup__image").clientHeight) {
		setTimeout(() => {
			dqs(".project-popup__image-scroll").classList.add("project-popup__image-scroll_animation");
		}, 600);
	}
}

function withTransitionLock(actionFunction) {

	if (projectPopupInTransition) return;
	else projectPopupInTransition = true;

	actionFunction();

	setTimeout(() => {
		projectPopupInTransition = false;
	}, projectPopupTransitionDuration);
}

export function openProjectPopup(project) {
	withTransitionLock(() => {

		setScrollWidthCssVar();

		projectPopup.setTitle(project.title);
		projectPopup.setDescription(project.description);
		projectPopup
			.setLinkButtons(project.repository, project.demo, project.folder);

		// image slides
		let imageSlideElems = ``;
		for (let index = 1; index <= project.screenshots; index++) {
			imageSlideElems += imageSlideHTML(project.folder, index);
		}
		dqs(".project-popup__image-swiper-wrapper").innerHTML = imageSlideElems;
		swiperProjectPopup.update();
		swiperProjectPopup.slideTo(0, 1, false);
		addScrollEventToImageSlides();

		setTimeout(() => {
			// Load first two (if available) images
			dqsa(".project-popup__image-slide:nth-child(-n+2) picture").forEach((slidePic, index) => {
				imageCreator.loadPictureSources(slidePic);
				if (index == 0) {
					const picImg = slidePic.querySelector("img");
					picImg.addEventListener("load", () => showScrollAnimation(picImg));
				}
			});
		}, projectPopupTransitionDuration);

		dqs("body").classList.add("open-project-popup");
	});
}

export function closeProjectPopup() {
	withTransitionLock(() => {
		dqs("body").classList.remove("open-project-popup");
	});
}


const swiperProjectPopup = new Swiper('.project-popup__image-swiper', {

	modules: [ Navigation, Pagination ],

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
		slideChange: () => {

			track("project-popup-swiper-slide-change");

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
