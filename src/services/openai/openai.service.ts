import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import config from 'config';
import { IMessage } from './openai.service.interface';
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

	async chat(messages: any): Promise<any> {
		try {
			const responce = await this.openai.createChatCompletion({
				model: 'gpt-3.5-turbo',
				messages,
				/*	max_tokens: 50,
				temperature: 0.5, */
			});
			return responce.data.choices[0].message;
		} catch (error) {
			console.log(`Error while transcription: ${error}`);
		}
	}

	async transcription(readStream: ReadStream): Promise<string> {
		try {
			const stream = readStream as unknown as File;
			const responce = await this.openai.createTranscription(stream, 'whisper-1');
			return responce.data.text;
		} catch (error) {
			console.log(`Error while transcription: ${error}`);
			return `Error while transcription: ${error}`;
		}
	}

	getUserMessage(message: string): IMessage {
		return {
			role: 'user',
			content: message,
		};
	}

	getAssistantMessage(message: string): IMessage {
		return {
			role: 'assistant',
			content: message,
		};
	}
}

export const openai = new OpenAi();
