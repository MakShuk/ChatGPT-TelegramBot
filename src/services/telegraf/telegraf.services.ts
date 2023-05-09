import { Telegraf } from 'telegraf';

export class TelegrafServices {
	bot: Telegraf;
	constructor(private token: string) {
		this.token = token;
	}

	init(): void {
		this.bot = new Telegraf(this.token);
	}
}
