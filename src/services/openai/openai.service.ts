import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import config from 'config';
import { ReadStream } from 'node:fs';

class OpenAi {
	private configuration: Configuration;
	private openai: OpenAIApi;

	constructor() {
		this.configuration = new Configuration({
			apiKey: config.get('CHATGPT_TOKEN'),
		});
		this.openai = new OpenAIApi(this.configuration);
	}

	async chat(text: string, role: 'system' | 'user' | 'assistant' = 'user'): Promise<any> {
		try {
			const messages = [{ role: role, content: text }];
			const responce = await this.openai.createChatCompletion({ model: 'gpt-3.5-turbo', messages });
			return responce.data.choices[0].message;
		} catch (error) {
			console.log(`Error while transcription: ${error}`);
		}
	}

	async transcription(readStream: any): Promise<string> {
		try {
			const responce = await this.openai.createTranscription(readStream, 'whisper-1');
			return responce.data.text;
		} catch (error) {
			console.log(`Error while transcription: ${error}`);
			return `Error while transcription: ${error}`;
		}
	}
}

export const openai = new OpenAi();
