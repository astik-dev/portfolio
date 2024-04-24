import { dqs } from "../utils.js";
import { removeEmptyItems } from "./removeEmptyItems.js";
import imageCreator from "../imageCreator.js";


function contactsItemHTML({link, title, img, imgWEBP}) {

    const fallback = `contacts/${img}`;

	const imgElem = imgWEBP
        ? imageCreator.newWebpPic("external", `contacts/${imgWEBP}`, fallback, title)
        : imageCreator.newImg("external", fallback, title);

    return `
        <a href="${link}" target="_blank" title="${title}" class="contacts__item">
            ${imgElem}
        </a>
    `;
}

export function loadContacts(contacts) {
	
    const contactsItems = dqs(".contacts__items");

	removeEmptyItems(".contacts__item_empty", contactsItems);

	contacts.forEach((contact) => {
		contactsItems.insertAdjacentHTML(
            "beforeend",
            contactsItemHTML(contact)
        );
	});
}
