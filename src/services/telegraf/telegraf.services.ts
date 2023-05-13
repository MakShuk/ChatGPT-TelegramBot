import { Telegraf, session } from 'telegraf';
import { message } from 'telegraf/filters';
import { l } from '../logger/logger.service';

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
				l.error(`Comand ${comand} Error while message ${e}`);
			}
		});
	}
	async speechToAction(handlerFunc: (ctx: any) => void): Promise<void> {
		this.bot.on(message('voice'), async (context) => {
			try {
				await handlerFunc(context);
			} catch (e: any) {
				l.error(`Error while speechToAction message ${e}`);
			}
		});
	}

	async textToAction(handlerFunc: (ctx: any) => void): Promise<void> {
		this.bot.on(message('text'), async (context) => {
			try {
				await handlerFunc(context);
			} catch (e: any) {
				l.error(`Error while textToAction message ${e}`);
			}
		});
	}

	useSession(): void {
		this.bot.use(session());
	}
}
