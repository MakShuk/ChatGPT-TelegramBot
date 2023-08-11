import axios, { AxiosError, AxiosResponse, ResponseType } from 'axios';
import { LoggerService } from '../logger/logger.service';
import { WriteStream } from 'fs';

export class AxiosService {
	logger = new LoggerService('AxiosService');
	constructor(private readonly url: string) {}

	async get(responseType?: ResponseType): Promise<AxiosResponse | string> {
		try {
			const response = await axios({
				method: 'get',
				url: this.url,
				responseType: responseType || 'json',
			});
			return response;
		} catch (e) {
			if (e instanceof AxiosError) {
				this.logger.error(e.name);
				return e.name;
			}
			return `${e}`;
			//throw Error('YandexService Erorr');
		}
	}

	async post(data: any): Promise<void> {
		try {
			await axios({
				method: 'post',
				url: this.url,
				data: data,
			});
		} catch (e) {
			if (e instanceof AxiosError) {
				this.logger.error(e.name);
			}
		}
	}

	async getStreamWriteFile(stream: WriteStream): Promise<void> {
		const responseStream = await this.get('stream');
		if (typeof responseStream !== 'string') {
			responseStream.data.pipe(stream);
			await new Promise((resolve) => {
				responseStream.data.on('end', () => {
					this.logger.info('AxiosService: File writing complete');
					resolve('end');
				});
			});
		}
	}
}
