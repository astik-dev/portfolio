const headerContainer = document.querySelector(".header__container");

let burgerMenuBtnStatus = "close";
let openClosePermissionProjectPopup = true;



function findParent (eventTarget, className, NumberOfParents) {
	if (eventTarget.classList.contains(className)) {
		checkClassName(className, eventTarget);
	} else if (NumberOfParents != 0) {
		findParent (eventTarget.parentNode, className, NumberOfParents-1);
	} else {
		return false;
	}
}

function checkClassName (className, eventTarget) {
	if (className == "header__burger") {
		openCloseBurgerMenu();
	} else if (className == "projects__item" || className ==  "project-popup__close") {
		if (!eventTarget.classList.contains("projects__item_empty")) {
			openCloseProjectPopup(eventTarget);
		}
	}
}

function openCloseBurgerMenu () {
	if (burgerMenuBtnStatus == "close") {
		burgerMenuBtnStatus = "open";
		headerContainer.classList.add("header__container_open-burger");
		gtmEvent({'event': 'open_burgerMenu'});
	} else {
		burgerMenuBtnStatus = "close";
		headerContainer.classList.remove("header__container_open-burger");
	}
}


function openCloseProjectPopup(eventTarget) {
	if (openClosePermissionProjectPopup == true) {
		openClosePermissionProjectPopup = false;
	
		if (!document.querySelector(".open-project-popup")) {

			overflowScrollPadding("add");


			// Toggle scroll event for all ".swiper-slide" elements (Google Tag Manager)
			function toggleScrollEvent(action) {

				let cssSelector = ".project-popup__image-swiper-wrapper .swiper-slide";

				if (document.querySelector(cssSelector)) {
					if (action == "add") {
						document.querySelectorAll(cssSelector).forEach((slide) => {
							slide.addEventListener('scroll', scrollEvent, { once: true });
						});
					} else if (action == "remove") {
						document.querySelectorAll(cssSelector).forEach((slide) => {
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
			const projectsItemAll = document.querySelectorAll(".projects__item");
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
			const projectPopupTitle = document.querySelector(".project-popup__container h3");
			const projectPopupText = document.querySelector(".project-popup__container p");

			projectPopupTitle.textContent = pTitle;
			projectPopupText.textContent = pDescription;


			// Set buttons
			const projectPopupBtnR = document.querySelector(".project-popup__btn:nth-child(1)");
			const projectPopupBtnD = document.querySelector(".project-popup__btn:nth-child(2)");

			if (pRepository != "") {
				projectPopupBtnR.href = pRepository;
				projectPopupBtnR.classList.remove("project-popup__btn_disabled");
			} else {
				disableBtn(projectPopupBtnR);
			}

			if (pDemo != "") {
				projectPopupBtnD.href = pDemo;
				projectPopupBtnD.classList.remove("project-popup__btn_disabled");
			} else {
				disableBtn(projectPopupBtnD);
			}

			function disableBtn(btn) {
				btn.removeAttribute("href");
				btn.classList.add("project-popup__btn_disabled");
			}


			// Creating links to all screenshots
			function generateUrl(screenshots, folder1, folder2) {
				let urls = [];
				for (let i = 1; i <= screenshots; i++) {
					urls.push(`img/projects/${folder1}/${folder2}/${i}.png`);
				}
				return urls;
			}
			let imgFullSize = generateUrl(pScreenshots, pFolder, "full-size");


			// Generate screenshots slides
			function generateSlides(screenshots) {
				let slides;
				for (let i = 1; i <= screenshots; i++) {
					slide = `<div class="project-popup__image-slide swiper-slide">
								<a href="${imgFullSize[i-1]}" target="_blank">
									<img src="img/1x1.png" data-src="${imgFullSize[i-1]}" style="height: 1px; width: 1px;" alt="Project image" class="img-lazy-loading">
								</a>
							</div>`;

					if (slides) {
						slides = slides + slide;
					} else {
						slides = slide;
					}
				}
				return slides;
			}

			document.querySelector(".project-popup__image-swiper-wrapper")
				.innerHTML = generateSlides(pScreenshots);
			swiperProjectPopup.slideTo(0, 1, false);
			toggleScrollEvent("add");



			// Lazy loading
			let lazyImages = document.querySelectorAll(".img-lazy-loading[data-src]");

			const lazyImagesObserver = new IntersectionObserver(
				(entries, observer) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							setTimeout(() => {
								entry.target.src = entry.target.dataset.src;
								entry.target.removeAttribute("style");
								//observer.unobserve(entry.target);
							}, 300);
						}
					});
				},
				{
					rootMargin: "0px 0px 0px 0px",
				},
			);

			lazyImages.forEach(image => lazyImagesObserver.observe(image));
		} else {
			overflowScrollPadding("remove");

			let lazyImages = document.querySelectorAll(".img-lazy-loading[data-src]");

			setTimeout(() => {
				lazyImages.forEach(image => {
					image.style.width = "0px";
					image.style.height = "0px";
					image.src = "img/1x1.png";
				});
			}, 100);
			
		}

		document.querySelector("body").classList.toggle("open-project-popup");

		setTimeout(() => {
			openClosePermissionProjectPopup = true;
		}, 300);
	}
}

function getScrollSize() {
	let scrollWidth = window.innerWidth - document.documentElement.clientWidth;
	return scrollWidth;
}
function overflowScrollPadding(addRemove) {
	if (addRemove == "remove") {
		document.querySelector("body").removeAttribute("style");
		document.querySelector(".header").removeAttribute("style");
	} else if (addRemove == "add") {
		let scrl = getScrollSize();

		document.querySelector("body").style.paddingRight = `${scrl}px`;
		document.querySelector(".header").style.paddingRight = `${scrl}px`;
	}
}



document.addEventListener("click", (event) => {

	// Header burger
	findParent (event.target, "header__burger", 3);

	// Project popup
	findParent (event.target, "projects__item", 3);	
	findParent (event.target, "project-popup__close", 3);
	if (event.target.classList.contains("project-popup")) {
		openCloseProjectPopup();
	}
});



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
		},
	},
});



function removeEmptyItems(className, itemsContainer) {
	if (itemsContainer.querySelector(className)) {
		itemsContainer.querySelectorAll(className).forEach(emptyItem => {
			emptyItem.remove();
		});
	}
}


let projects;
fetch('projects.json')
	.then(response => response.json())
	.then(data => {
		projects = data;

		let amt = 4;
		generateProjects(amt, "start");
		if (projects.length > amt) {
			document.querySelector(".projects__container")
				.insertAdjacentHTML("beforeend", 
									`<button class="projects__btn-load-more" onClick="generateProjects(4, 'load more')">Load More</button>`);
		}
	});

const projectsItems = document.querySelector(".projects__items");

// mode: "start", "load more".
function generateProjects(amt, mode) {

	let startIndex;

	if (mode == "start") {
		startIndex = 0;
		removeEmptyItems(".projects__item_empty", projectsItems);
	} else if (mode == "load more") {

		let loadedProjects = document.querySelectorAll(".projects__item").length;

		let difference = projects.length - loadedProjects;

		if (difference > amt) {
			startIndex = projects.length - difference;
			amt += startIndex;
		} else {
			startIndex = projects.length - difference;
			amt = projects.length;
			document.querySelector(".projects__container").removeChild(document.querySelector(".projects__btn-load-more"));
		}
	}

	for (let i = startIndex; i < amt; i++) {

		let img800 = "img/projects/" + projects[i].folder + "/800";
		let title = projects[i].title;

		let projectItem = `<div class="projects__item">
								<picture>
									<source type="image/webp" data-src="${img800}.webp">
									<source type="image/jpeg" data-src="${img800}.jpg">
									<img src="img/1x1.png" data-src="${img800}.jpg" alt="${title}">
								</picture>
								<div class="projects__item-title">
									<h5>${title}</h5>
								</div>
							</div>`

		projectsItems.insertAdjacentHTML("beforeend", projectItem);



		// Lazy loading for preview image
		let newLazyImg = projectsItems.querySelector(".projects__item:last-child picture");

		const newObserver = new IntersectionObserver(
			(entries, observer) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {

						let sourceWEBP = entry.target.querySelector("source:nth-child(1)");
						let sourceJPEG = entry.target.querySelector("source:nth-child(2)");
						let img = entry.target.querySelector("img");

						sourceWEBP.srcset = sourceWEBP.dataset.src;
						sourceJPEG.srcset = sourceJPEG.dataset.src;
						img.src = img.dataset.src;
					}
				});
			},
			{
				rootMargin: "200px 0px 200px 0px",
			},
		);

		newObserver.observe(newLazyImg);
	}
}



let skills;
fetch('skills.json')
	.then(response => response.json())
	.then(data => {
		skills = data;
		generateSkills();
	});

function generateSkills() {
	const skillsItems = document.querySelector(".skills__items");

	removeEmptyItems(".skills__item_empty", skillsItems);

	skills.forEach((skill) => {

		let imgElem;

		if (skill.imgWEBP) {
			imgElem = `<picture>
						   <source type="image/webp" srcset="img/skills/${skill.imgWEBP}">
						   <source type="image/png" srcset="img/skills/${skill.img}">
						   <img src="img/skills/${skill.img}" alt="${skill.name}">
					   </picture>`;
		} else {
			imgElem = `<img src="img/skills/${skill.img}" alt="${skill.name}">`;
		}

		let currentSkill = `<div class="skills__item">
								${imgElem}
								<h4>${skill.name}</h4>
							</div>`;

		skillsItems.insertAdjacentHTML("beforeend", currentSkill);
	});
}



let reviews;
fetch('reviews.json')
	.then(response => response.json())
	.then(data => {

		reviews = data;

		reviews.sort(function (a, b) {
			return -(a.text.length - b.text.length);
		});
		


		const reviewsSwiperWrapper = document.querySelector(".reviews__swiper-wrapper");

		removeEmptyItems(".reviews__slide_empty", reviewsSwiperWrapper);

		reviews.forEach((review) => {

			let reviewAvatar;
			if (review.avatar == "") {
				reviewAvatar = `<img src="img/reviews/user-avatar.svg" alt="Avatar">`;
			} else {
				reviewAvatar = `<picture>
									<source type="image/webp" srcset="img/reviews/avatar/${review.avatar}.webp">
									<source type="image/jpeg" srcset="img/reviews/avatar/${review.avatar}.jpg">
									<img src="img/reviews/avatar/${review.avatar}.jpg" alt="Avatar">
								</picture>`;
			}

			gradeColor = "#2CB67D";
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
	});



let contacts;
fetch('contacts.json')
	.then(response => response.json())
	.then(data => {
		contacts = data;
		generateContacts();
	});

function generateContacts() {
	const contactsItems = document.querySelector(".contacts__items");

	removeEmptyItems(".contacts__item_empty", contactsItems);

	contacts.forEach((contact) => {

		let imgElem;
		if (contact.imgWEBP) {
			imgElem = `<picture>
						   <source type="image/webp" srcset="img/contacts/${contact.imgWEBP}">
						   <source type="image/png" srcset="img/contacts/${contact.img}">
						   <img src="img/contacts/${contact.img}" alt="${contact.title}">
					   </picture>`;
		} else {
			imgElem = `<img src="img/contacts/${contact.img}" alt="${contact.title}">`;
		}

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



// Smooth scroll
const headerMenuLinks = document.querySelectorAll('.header__menu a[href*="#"]');

for (let headerMenuLink of headerMenuLinks) {
  headerMenuLink.addEventListener('click', function (e) {
    e.preventDefault();
    
    const blockID = headerMenuLink.getAttribute('href').substr(1);
    
   	smoothScroll(blockID);
  })
}

function currentYPosition() {
    // Firefox, Chrome, Opera, Safari
    if (self.pageYOffset) return self.pageYOffset;
    // Internet Explorer 6 - standards mode
    if (document.documentElement && document.documentElement.scrollTop)
        return document.documentElement.scrollTop;
    // Internet Explorer 6, 7 and 8
    if (document.body.scrollTop) return document.body.scrollTop;
    return 0;
}

function elmYPosition(eID) {
    var elm = document.getElementById(eID);
    var y = elm.offsetTop;
    var node = elm;
    while (node.offsetParent && node.offsetParent != document.body) {
        node = node.offsetParent;
        y += node.offsetTop;
    } return y;
}

function getHeaderHeight() {
	if (window.innerWidth < 575.5) {
		openCloseBurgerMenu();
		return 70;
	} else {
		return 80;
	}
}

function smoothScroll(eID) {
    var startY = currentYPosition();
    var stopY = elmYPosition(eID) - getHeaderHeight();
    var distance = stopY > startY ? stopY - startY : startY - stopY;
 	if (distance < 100) {
        scrollTo(0, stopY); return;
    }
    var speed = Math.round(distance / 100);
    if (speed >= 20) speed = 20;
    var step = Math.round(distance / 25);
    var leapY = stopY > startY ? startY + step : startY - step;
    var timer = 0;
    if (stopY > startY) {
        for ( var i=startY; i<stopY; i+=step ) {
            setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
            leapY += step; if (leapY > stopY) leapY = stopY; timer++;
        } return;
    }
    for ( var i=startY; i>stopY; i-=step ) {
        setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
        leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
    }
}