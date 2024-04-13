// utils.js

const
	doc = document,
	dqs = c => doc.querySelector(c),
	dqsa = c => doc.querySelectorAll(c);



// cookies.js

const cookiesPopupHTML =   `<div class="cookies-popup cookies-popup_close">
								<div class="cookies-popup__text">
									<p>🍪 Cookie Usage Notice</p>
									<p>We use cookies to enhance your browsing experience and gain insights into how our website is used. These cookies help us understand user behavior and analyze traffic patterns, all while respecting your privacy. To learn more about how we use cookies and your data, please review our <a href="privacy.html">Privacy Policy</a>.</p>
								</div>
								<div class="cookies-popup__btns">
									<button>Reject</button>
									<button>Accept</button>
								</div>
							</div>`;



function getCookie(cookieName) {
  	const name = cookieName + "=";
  	const decodedCookie = decodeURIComponent(doc.cookie);
  	const cookieArray = decodedCookie.split(';');

  	for (let i = 0; i < cookieArray.length; i++) {
    	let cookie = cookieArray[i].trim();
    	if (cookie.indexOf(name) === 0) {
      		return cookie.substring(name.length, cookie.length);
    	}
  	}

  	return null;
}

function toggleCloseStyleCookiesPopup () {
	dqs(".cookies-popup").classList.toggle("cookies-popup_close");
}

function addCookiesPopup () {
	dqs(".wrapper").insertAdjacentHTML("afterbegin", cookiesPopupHTML);
	dqs(".cookies-popup__btns button:nth-child(1)").addEventListener("click", cookiesDecline);
	dqs(".cookies-popup__btns button:nth-child(2)").addEventListener("click", cookiesAccept);
	setTimeout(() => {
		toggleCloseStyleCookiesPopup();
	}, 100);
}

function removeCookiesPopup () {
	toggleCloseStyleCookiesPopup();
	setTimeout(() => {
		dqs(".cookies-popup").remove();
	}, 300);
}

function cookiesAccept() {
	removeCookiesPopup();
	setCookieConsent("accepted");
	loadGoogleAnalytics4();
}

function cookiesDecline() {
	removeCookiesPopup();
	setCookieConsent("declined");
}

function setCookieConsent (value) {
	let sixMonthsInSeconds = 6 * 30 * 24 * 60 * 60;
	doc.cookie = `consent=${value}; max-age=${sixMonthsInSeconds}`;
}

function loadGoogleAnalytics4 () {

	// Google Tag Manager
	(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
	new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
	j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
	'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
	})(window,document,'script','dataLayer','GTM-5LL8BFL');


	// Google tag (gtag.js)
	doc.head.insertAdjacentHTML("beforeend", `<script async src="https://www.googletagmanager.com/gtag/js?id=G-B8B6TJH9GG"></script>`);

	window.dataLayer = window.dataLayer || [];
	function gtag(){dataLayer.push(arguments);}
	gtag('js', new Date());
	gtag('config', 'G-B8B6TJH9GG');


	// Google Tag Manager (noscript)
	doc.body.insertAdjacentHTML('afterbegin', `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5LL8BFL" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`);
}


doc.addEventListener('DOMContentLoaded', function() {
	
	if (navigator.cookieEnabled) {

		let currentCookieValue = getCookie("consent");

		if (currentCookieValue) {

			if (currentCookieValue == "accepted") {
				loadGoogleAnalytics4();
			}

		} else {

			// Excluding the display of the popup on the Privacy Policy
			// page based on the presence of the .privacy element.
			if (!dqs(".privacy")) {
				addCookiesPopup();
			}
		}
	}
});



// script.js

let openClosePermissionProjectPopup = true;



const getFileExtension = filePath => filePath.split('.').pop();

const imageCreator = {

	imgBasePath: {
		local: "img/",
		external: "https://raw.githubusercontent.com/astik-dev/portfolio/content/images/",
	},

	px1: `img/1x1.png`,

	fullPath: function (source, path) {return this.imgBasePath[source] + path},

	newWebpPic: function (source, webpPath, fallbackPath, alt, lazy) {
		const types = {
			jpg: "jpeg",
		}

		const src = lazy ? "data-src" : "srcset";
		
		const fallbackExt = getFileExtension(fallbackPath);
		const fallbackType = types[fallbackExt] || fallbackExt;
		
		return `<picture>
					<source type="image/webp" ${src}="${this.fullPath(source, webpPath)}">
					<source type="image/${fallbackType}" ${src}="${this.fullPath(source, fallbackPath)}">
					${this.newImg(source, fallbackPath, alt, lazy)}
				</picture>`;
	},

	newImg: function (source, path, alt, lazy) {
		const fullPath = this.fullPath(source, path);
		const src = lazy ? `"${this.px1}" data-src="${fullPath}"` : `"${fullPath}"`;
		return `<img src=${src} alt="${alt}">`;
	}
}



function toggleBurgerMenu() {
	const
		headerCont = dqs(".header__container"),
		openCssClass = "header__container_open-burger";

	if (!headerCont.classList.contains(openCssClass)) gtmEvent({'event': 'open_burgerMenu'});

	headerCont.classList.toggle(openCssClass);
}


function loadPictureSources (picture) {
	picture.querySelectorAll("source").forEach(source => {
		source.srcset = source.dataset.src;
	});
	const pictureImg = picture.querySelector("img");
	pictureImg.src = pictureImg.dataset.src;
}


function openCloseProjectPopup(eventTarget) {
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
					loadPictureSources(slidePic);
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
	    nextEl: '.project-popup__image-swiper-nav_right',
	    prevEl: '.project-popup__image-swiper-nav_left',
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
					if (picImg.src != imageCreator.px1) loadPictureSources(nextNextPic);
				}, 300); // 300 - Default duration of transition between slides (in ms)
			}
		},
	},
});



function setScrollWidthCssVar() {
	const scrollWidth = window.innerWidth - doc.documentElement.clientWidth;
	doc.documentElement.style.setProperty('--scroll-width', `${scrollWidth}px`);
}



function removeEmptyItems(className, itemsContainer) {
	if (itemsContainer.querySelector(className)) {
		itemsContainer.querySelectorAll(className).forEach(emptyItem => {
			emptyItem.remove();
		});
	}
}



const btnLoadMore = {
	cssClass: "projects__btn-load-more",
	clickEventFunction: function () { generateProjects('load more') },
	
	create: function () {
		dqs(".projects__container").insertAdjacentHTML("beforeend", `<button class="${this.cssClass}">Load More</button>`);
		this.elem = dqs(`.${this.cssClass}`);
		this.elem.addEventListener("click", this.clickEventFunction);
	},
}



let projects;
// mode: "start", "load more".
function generateProjects(mode) {

	const projectsItems = dqs(".projects__items");

	let generationSize = 4;
	let startIndex;

	if (mode == "start") {
		startIndex = 0;
		removeEmptyItems(".projects__item_empty", projectsItems);
	} else if (mode == "load more") {

		let loadedProjects = dqsa(".projects__item").length;

		let difference = projects.length - loadedProjects;

		if (difference > generationSize) {
			startIndex = projects.length - difference;
			generationSize += startIndex;
		} else {
			startIndex = projects.length - difference;
			generationSize = projects.length;
			btnLoadMore.elem.remove();
		}
	}

	for (let i = startIndex; i < generationSize; i++) {

		const img800 = "projects/" + projects[i].folder + "/800";
		const webp = img800 + ".webp", fallback = img800 + ".jpeg", alt = projects[i].title;
		
		const webpPicElem = imageCreator.newWebpPic("external", webp, fallback, alt, "lazy");

		let projectItem = `<article class="projects__item">
								${webpPicElem}
								<div class="projects__item-title">
									<h5>${projects[i].title}</h5>
								</div>
							</article>`

		projectsItems.insertAdjacentHTML("beforeend", projectItem);



		// Lazy loading for preview image
		let newLazyImg = projectsItems.querySelector(".projects__item:last-child picture");

		const newObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) loadPictureSources(entry.target);
				});
			},
			{
				rootMargin: "200px 0px 200px 0px",
			},
		);

		newObserver.observe(newLazyImg);
	}

	if (mode == "start" && projects.length > generationSize) btnLoadMore.create();
}

function generateSkills(skills) {
	const skillsItems = dqs(".skills__items");

	removeEmptyItems(".skills__item_empty", skillsItems);

	skills.forEach((skill) => {

		const fallback = `skills/${skill.img}`, alt = skill.name;

		const imgElem = skill.imgWEBP ?
			imageCreator.newWebpPic("external", `skills/${skill.imgWEBP}`, fallback, alt) :
			imageCreator.newImg("external", fallback, alt);

		let currentSkill = `<article class="skills__item">
								${imgElem}
								<h4>${skill.name}</h4>
							</article>`;

		skillsItems.insertAdjacentHTML("beforeend", currentSkill);
	});
}

function generateReviews(reviews) {
	reviews.sort(function (a, b) {
		return -(a.text.length - b.text.length);
	});
	


	const reviewsSwiperWrapper = dqs(".reviews__swiper-wrapper");

	removeEmptyItems(".reviews__slide_empty", reviewsSwiperWrapper);

	reviews.forEach((review) => {

		const alt = `Avatar`;

		const reviewAvatar = review.avatar == "" ?
			imageCreator.newImg("local", `reviews/user-avatar.svg`, alt) :
			imageCreator.newWebpPic("external", `reviews/${review.avatar}.webp`, `reviews/${review.avatar}.jpeg`, alt);

		let gradeColor = "#2CB67D";
		if (Number(review.grade) < 5) {gradeColor = "#fa1111"}
		else if (Number(review.grade) < 7) {gradeColor = "#fab43c"}

		let currentReview =`<div class="reviews__slide swiper-slide">
								<div class="reviews__slide-top">
									${reviewAvatar}
									<h5>${review.name}</h5>
									<h4 class="reviews__slide-grade">
										<span style="color: ${gradeColor};">${review.grade}/10</span>
										<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"viewBox="0 0 47.94 47.94" xml:space="preserve"> <path fill="${gradeColor}" d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"/> </svg>
									</h4>
								</div>
								<p>${review.text}</p>
								<div class="reviews__slide-bottom">
									<span>${review.date}</span>
									<a href="${review.link}" target="_blank" title="Go to source">${review.linkText}</a>
								</div>
							</div>`

		reviewsSwiperWrapper.insertAdjacentHTML("beforeend", currentReview);
	});



	const swiperReviews = new Swiper('.reviews__swiper', {

		pagination: {
			el: '.reviews__swiper-pagination',
			type: 'fraction',
		},

		navigation: {
			nextEl: '.reviews__swiper-nav_right',
			prevEl: '.reviews__swiper-nav_left',
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

function generateContacts(contacts) {
	const contactsItems = dqs(".contacts__items");

	removeEmptyItems(".contacts__item_empty", contactsItems);

	contacts.forEach((contact) => {

		const fallback = `contacts/${contact.img}`, alt = contact.title;

		const imgElem = contact.imgWEBP ?
			imageCreator.newWebpPic("external", `contacts/${contact.imgWEBP}`, fallback, alt) :
			imageCreator.newImg("external", fallback, alt);

		let currentContact = `<a href="${contact.link}" target="_blank" title="${contact.title}" class="contacts__item">
								  ${imgElem}
							  </a>`

		contactsItems.insertAdjacentHTML("beforeend", currentContact);
	});
}



function gtmEvent(object) {
	if (typeof dataLayer !== "undefined" && Array.isArray(dataLayer)) {
		dataLayer.push(object);
	}
}



function smoothScroll(elemSelector) {
    const startY = window.pageYOffset;
    const stopY = dqs(elemSelector).offsetTop - dqs(".header").offsetHeight;
    const distance = stopY > startY ? stopY - startY : startY - stopY;
 	
    if (window.innerWidth < 575.5) toggleBurgerMenu();

 	if (distance < 100) {
        scrollTo(0, stopY);
        return;
    }
    
    let speed = Math.min(Math.round(distance / 100), 20);
    
    const step = Math.round(distance / 25);
    let leapY = stopY > startY ? startY + step : startY - step;
    let timer = 0;
    
    const scrollDirection = stopY > startY ? 1 : -1; // 1 = scroll down, -1 = scroll up
	
	for (let i = startY; scrollDirection === 1 ? i < stopY : i > stopY; i += scrollDirection * step) {
	    setTimeout((y) => {window.scrollTo(0, y)}, timer * speed, leapY);
	    leapY += scrollDirection * step;
	    if (scrollDirection === 1 ? leapY > stopY : leapY < stopY) leapY = stopY;
	    timer++;
	}
}



const spreadsheets = {
	id: "1K842-NO5cQoYdsCjDdWzTbxwYfTmaysR4V8oSBI0qMo",
	
	get link() {return `https://opensheet.elk.sh/${this.id}/`},
		
	fetchJSON: function(sheet, retries = 3) {
		return fetch(this.link + sheet)
			.then(response => {
				if (!response.ok) throw new Error('Response was not ok');
				return response.json();
			})
			.catch(error => {
				console.error("Error fetching JSON:", error);
				if (retries <= 0) throw new Error('Max retries exceeded');
				return new Promise(resolve => {
					setTimeout(() => {
						resolve(this.fetchJSON(sheet, retries - 1));
					}, 1500);
				});
			});
	},
}

spreadsheets.fetchJSON("projects").then(data => {projects = data; generateProjects("start")});
spreadsheets.fetchJSON("skills").then(data => generateSkills(data));
spreadsheets.fetchJSON("reviews").then(data => generateReviews(data));
spreadsheets.fetchJSON("contacts").then(data => generateContacts(data));



doc.addEventListener("click", e => {

	const burger = e.target.closest(".header__burger"),
		  projectItem = e.target.closest(".projects__item"),
		  closeProjectPopup = e.target.closest(".project-popup__close");

	if (burger)
		toggleBurgerMenu();

	else if (projectItem || closeProjectPopup)
		openCloseProjectPopup(projectItem || closeProjectPopup);

	else if (e.target.classList.contains("project-popup")) // click outside the popup
		openCloseProjectPopup();

	else if (e.target.matches('.header__menu a[href*="#"]')) {
		e.preventDefault();
		smoothScroll(e.target.getAttribute('href'));
	}
});
