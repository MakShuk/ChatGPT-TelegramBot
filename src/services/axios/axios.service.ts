import axios, { ResponseType } from 'axios';
import { l } from '../logger/logger.service';
import { WriteStream } from 'fs';

export class AxiosService {
	constructor(private url: string) {
		this.url = url;
	}

	async get(responseType?: ResponseType): Promise<any> {
		try {
			const response = await axios({
				method: 'get',
				url: this.url,
				responseType: responseType || 'json',
			});
			return response;
		} catch (e: any) {
			l.error(`Error get AxiosService method: ${e.messag}`);
		}
	}

	async post(data: any): Promise<void> {
		try {
			await axios({
				method: 'post',
				url: this.url,
				data: data,
			});
		} catch (e: any) {
			l.error(`Error post AxiosService method: ${e.messag}`);
		}
	}

	async getStreamWriteFile(stream: WriteStream): Promise<void> {
		const response = await this.get('stream');
		response.data.pipe(stream);
	}
}
