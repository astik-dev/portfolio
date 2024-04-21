import { dqs } from "./utils.js";
import { toggleBurgerMenu } from "./burgerMenu.js";


export function smoothScroll(elemSelector) {
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
