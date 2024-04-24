import { dqs } from "../utils.js";
import { removeEmptyItems } from "./removeEmptyItems.js";
import imageCreator from "../imageCreator.js";


export function loadContacts(contacts) {
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
