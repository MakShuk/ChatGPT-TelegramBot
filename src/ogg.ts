import axios from 'axios';
import { createWriteStream } from 'fs';
import { dirname, resolve } from 'path';

//const __dirname = dirname(fileURLToPath(import.meta.url));

class OggConvector {
	//constructor() {}
	//toMp3() {}
	async create(url: string, filename: string): Promise<void> {
		try {
			const oggPath = resolve(__dirname, '../voices', `${filename}.ogg`);
			const response = await axios({
				method: 'get',
				url,
				responseType: 'stream',
			});
			return new Promise((resolve) => {
				const stream = createWriteStream(oggPath);
				response.data.pipe(stream);
				stream.on('finish', () => resolve());
			});
		} catch (e: any) {
			console.log(e.message);
		}
	}
}

export const ogg = new OggConvector();
