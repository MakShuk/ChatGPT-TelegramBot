import fs from 'fs/promises';
import { WriteStream, createWriteStream, createReadStream, ReadStream } from 'fs';
import { resolve } from 'path';

export class FileService {
	path: string;
	constructor(private fileName: string, catalog: string) {
		this.path = resolve(__dirname, catalog, `${fileName}`);
	}

	async writeJsonFile(data: any): Promise<void> {
		try {
			const dataJson = JSON.stringify(data);
			await fs.writeFile(this.fileName, dataJson);
			console.log(`Data written to ${this.fileName}`);
		} catch (error) {
			console.error(error);
		}
	}
	writeFile(data: any): void {
		fs.writeFile(this.fileName, data)
			.then(() => console.log(`Data written to ${this.fileName}`))
			.catch((err) => console.error(err));
	}

	async readJsonFile(): Promise<any> {
		try {
			const data = await fs.readFile(this.path, { encoding: 'utf-8' });
			const jsonData = JSON.parse(data);
			return jsonData;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	async readFile(): Promise<any> {
		try {
			const data = await fs.readFile(this.path, { encoding: 'utf-8' });
			return data;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	createWriteStream(): WriteStream {
		return createWriteStream(this.path);
	}

	createReadStream(): ReadStream {
		return createReadStream(this.path);
	}

	delete(): Promise<string> {
		return new Promise((resolve, reject) => {
			fs.unlink(this.path)
				.then(() => resolve(`File delete ${this.path}`))
				.catch((err) => reject(err));
		});
	}
	async appendFile(text: string): Promise<void> {
		try {
			await fs.appendFile(this.fileName, `${text}\n`);
			console.log('Лог сохранён!');
		} catch (error) {
			console.error('Ошибка при добавлении в файл:', error);
		}
	}
}
