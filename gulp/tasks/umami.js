import fs from "fs";

export const umami = async () => {

	let umamiTrackerScript = "";

	try {
		const response = await fetch("https://cloud.umami.is/script.js");
		if (!response.ok) {
			throw new Error(`Error ${response.status} - ${response.statusText}`);
		};
		umamiTrackerScript = await response.text();
	} catch (error) {
		console.error(error);
	}

	fs.mkdirSync(app.path.build.js, { recursive: true });
	fs.writeFileSync(`${app.path.build.js}/u.js`, umamiTrackerScript);
}
