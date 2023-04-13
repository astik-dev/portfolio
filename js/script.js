const headerContainer = document.querySelector(".header__container");
let burgerMenuBtnStatus = "close";



function findParent (eventTarget, className, NumberOfParents) {
	if (eventTarget.classList.contains(className)) {
		openCloseBurgerMenu();
	} else if (NumberOfParents != 0) {
		findParent (eventTarget.parentNode, className, NumberOfParents-1);
	} else {
		return false;
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



document.addEventListener("click", (event) => {
	findParent (event.target, "header__burger", 3);
});