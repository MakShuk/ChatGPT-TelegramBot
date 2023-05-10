import { Configuration, OpenAIApi } from 'openai';
import config from 'config';

class OpenAi {
	private configuration: Configuration;
	private openai: OpenAIApi;

	constructor() {
		this.configuration = new Configuration({
			apiKey: config.get('CHATGPT_TOKEN'),
		});
		this.openai = new OpenAIApi(this.configuration);
	}
}

export const openai = new OpenAi();
