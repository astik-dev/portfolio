import { doc } from "./utils.js";


export function getCookie(cookieName) {
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

export function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    
    doc.cookie = `${name}=${value}; expires=${date.toUTCString()}`;
} 
