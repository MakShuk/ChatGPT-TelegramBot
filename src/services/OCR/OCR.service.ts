import { createWorker, detect } from 'tesseract.js';
import { LoggerService } from '../logger/logger.service';

enum Languages {
	russian = 'rus',
	english = 'eng',
}

export class OcrService {
	private static logger = new LoggerService(this.name);
	private static async detectLanguage(url: string): Promise<Languages> {
		try {
			const result = await detect(url);
			return result.data.script === 'Cyrillic' ? Languages.russian : Languages.english;
		} catch (e) {
			if (e instanceof Error) {
				this.logger.error(e.message);
			}
			return Languages.english;
		}
	}

	static async getTextInPath(url: string): Promise<string> {
		const worker = await createWorker();
		const language = await this.detectLanguage(url);
		await worker.loadLanguage(language);
		await worker.initialize(language);
		const {
			data: { text },
		} = await worker.recognize(url);
		await worker.terminate();
		return text;
	}
}
