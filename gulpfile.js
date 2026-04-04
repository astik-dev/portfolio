import gulp from "gulp";

import { path } from "./gulp/config/path.js";
import { plugins } from "./gulp/config/plugins.js"; 



global.app = {
	isBuild: process.argv.includes("--build"),
	isDev: !process.argv.includes("--build"),
	path: path,
	gulp: gulp,
	plugins: plugins,
}



// Tasks
import { cname } from "./gulp/tasks/cname.js";
import { reset } from "./gulp/tasks/reset.js";
import { fetchData } from "./gulp/tasks/fetchData.js";
import { html } from "./gulp/tasks/html.js";
import { server } from "./gulp/tasks/server.js";
import { scss } from "./gulp/tasks/scss.js";
import { js } from "./gulp/tasks/js.js";
import { images } from "./gulp/tasks/images.js";



function watcher() {
	gulp.watch(path.watch.html, html);
	gulp.watch(path.watch.scss, scss);
	gulp.watch(path.watch.js, js);
	gulp.watch(path.watch.images, images);
}



const mainTasks = gulp.series(fetchData, gulp.parallel(html, scss, js, images));

const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
export const deploy = gulp.series(reset, cname, mainTasks);

gulp.task("default", dev);
