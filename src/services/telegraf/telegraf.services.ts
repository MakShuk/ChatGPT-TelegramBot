import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';

export class TelegrafServices {
	bot: Telegraf;
	constructor(private token: string) {
		this.token = token;
		this.init();
	}

	async init(): Promise<void> {
		this.bot = new Telegraf(this.token);
		await this.bot.launch();
	}

	async comand(handlerFunc: (ctx: any) => void, comand: string): Promise<void> {
		this.bot.command(comand, async (context) => {
			try {
				await handlerFunc(context);
			} catch (e: any) {
				console.log(`Error while string message' e.messag`);
			}
		});
	}
	async on(): Promise<void> {
		this.bot.on(message('voice'), async (context) => {
			try {
				const userId = context.message.from.id;
				await context.reply(JSON.stringify(context.message.voice, null, 2));
				const link = await context.telegram.getFileLink(context.message.voice.file_id);
				await context.reply(JSON.stringify(link, null, 2));
			} catch (e: any) {
				console.log('Error while voice message', e.message);
			}
		});
	}
}
