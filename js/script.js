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
		openCloseProjectPopup(eventTarget);
	}
}

function openCloseBurgerMenu () {
	if (burgerMenuBtnStatus == "close") {
		burgerMenuBtnStatus = "open";
		headerContainer.classList.add("header__container_open-burger");
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
});



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

		let img800 = "img/projects/" + projects[i].folder + "/800.jpg";
		let title = projects[i].title;

		let projectItem = `<div class="projects__item">
								<img src="img/1x1.png" data-src="${img800}" alt="${title}">
								<div class="projects__item-title">
									<h5>${title}</h5>
								</div>
							</div>`

		projectsItems.insertAdjacentHTML("beforeend", projectItem);



		// Lazy loading for preview image
		let newLazyImg = projectsItems.querySelector(".projects__item:last-child img");

		const newObserver = new IntersectionObserver(
			(entries, observer) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.src = entry.target.dataset.src;
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

	skills.forEach((skill) => {

		let currentSkill = `<div class="skills__item">
								<img src="img/skills/${skill.img}" alt="${skill.name}"> 
								<h4>${skill.name}</h4>
							</div>`

		skillsItems.insertAdjacentHTML("beforeend", currentSkill);
	});
}



let contacts;
fetch('contacts.json')
	.then(response => response.json())
	.then(data => {
		contacts = data;
		generateContacts();
	});

function generateContacts() {
	const contactsItems = document.querySelector(".contacts__items");

	contacts.forEach((contact) => {

		let currentContact = `<a href="${contact.link}" target="_blank" title="${contact.title}" class="contacts__item">
								  <img src="img/contacts/${contact.img}" alt="${contact.title}">
							  </a>`

		contactsItems.insertAdjacentHTML("beforeend", currentContact);
	});
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