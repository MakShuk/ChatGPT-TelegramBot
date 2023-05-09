//import { Telegraf } from 'telegraf';
//import { message } from 'telegraf/filters';
import config from 'config';
//import { ogg } from './ogg.js';

import { TelegrafServices } from './services/telegraf/telegraf.services';

const startComand = async (context: any): Promise<void> => {
	await context.reply(JSON.stringify(context.message, null, 2));
};
const idComand = async (context: any): Promise<void> => {
	await context.reply(JSON.stringify(context.message.from.id, null, 2));
};

const start = async (): Promise<void> => {
	const maksLifeBot = new TelegrafServices(config.get('TELEGRAM_TOKEN'));
	maksLifeBot.comand(startComand, 'start');
	maksLifeBot.comand(startComand, 'id');
};

start();

/* 
const bot = new Telegraf(config.get('TELEGRAM_TOKEN'));

bot.on(message('voice'), async (context) => {
	try {
		const userId = context.message.from.id;
		await context.reply(JSON.stringify(context.message.voice, null, 2));
		const link = await context.telegram.getFileLink(context.message.voice.file_id);
		await context.reply(JSON.stringify(link, null, 2));
	} catch (e: any) {
		console.log('Error while voice message', e.message);
	}
});

bot.command('start', async (context) => {
	await context.reply(JSON.stringify(context.message, null, 2));
});

bot.launch();
 */
/* process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM')); */
