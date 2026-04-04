import { deleteAsync } from 'del';

export const reset = () => {
	return deleteAsync([ app.path.buildFolder, app.path.tempFolder ]);
}