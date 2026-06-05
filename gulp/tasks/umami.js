import fs from "fs";
import * as prettier from "prettier";

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
	
	// u.js is minified and produces noisy Git diffs on the gh-pages branch.
	// This pretty-printed version is written alongside it so changes remain
	// reviewable after GitHub Actions deploys the build. Not served to users.
	fs.writeFileSync(
		`${app.path.build.js}/u.pretty.js`,
		await prettier.format(umamiTrackerScript, { parser: "babel", useTabs: true })
	);
}
