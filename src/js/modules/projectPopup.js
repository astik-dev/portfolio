import { doc, dqs, dqsa } from "./utils.js";
import imageCreator from "./imageCreator.js";
import { gtmEvent } from "./googleAnalytics4.js";
import { getProjects } from "./data/projects.js";


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

	setLinkButtons(repositoryLink, demoLink) {
		const linkButtons = [repositoryLink, demoLink];

		linkButtons.forEach((link, index) => {
			const btn = dqs(`.project-popup__btn:nth-child(${index + 1})`);
			const isLinkEmpty = link == "";

			btn.classList.toggle("project-popup__btn_disabled", isLinkEmpty);

			if (isLinkEmpty) btn.removeAttribute("href");
			else btn.href = link;
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

function imageSlideHTML(imagePath) {
	return `
		<div class="project-popup__image-slide swiper-slide">
			<a href="${imageCreator.fullPath("external", imagePath)}.jpeg" target="_blank">
				${imageCreator.newWebpPic(
					"external",
					imagePath+".webp",
					imagePath+".jpeg",
					`Project image`,
					"lazy"
				)}
			</a>
		</div>
	`;
}

function imageSlideScrollEvent(event) {
	const link = event.target.querySelector("a").href;
	const startIndex = link.indexOf("/projects/") + 10; // 10 = "/projects/" length
	const trimmedLink = link.substring(startIndex);
	gtmEvent({
		'event': 'project_slideScroll',
		'projectTrimmedLink': trimmedLink
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

export function openProjectPopup(eventTarget) {
	withTransitionLock(() => {

		setScrollWidthCssVar();

		const projects = getProjects();

		const projectIndex = eventTarget.dataset.projectIndex;
		const project = projects[projectIndex];

		projectPopup.setTitle(project.title);
		projectPopup.setDescription(project.description);
		projectPopup.setLinkButtons(project.repository, project.demo);

		// image slides
		let imageSlideElems = ``;
		const imagesFolderPath = `projects/${project.folder}/full-size/`;
		for (let i = 1; i <= project.screenshots; i++) {
			imageSlideElems += imageSlideHTML(imagesFolderPath + i);
		}
		dqs(".project-popup__image-swiper-wrapper").innerHTML = imageSlideElems;
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
