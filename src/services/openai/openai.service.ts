import { Configuration, OpenAIApi } from 'openai';
import config from 'config';

export class OpenAi {
	private configuration: Configuration;
	private openai: OpenAIApi;

	constructor(apiKey: string) {
		this.configuration = new Configuration({
			apiKey,
		});
		this.openai = new OpenAIApi(this.configuration);
	}
}
