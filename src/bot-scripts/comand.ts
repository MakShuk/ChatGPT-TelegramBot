import { code } from 'telegraf/format';

export const startComand = async (context: any): Promise<void> => {
	context.session = {
		message: [],
	};
	await context.reply(
		code(`💬 Отправьте голосовое или текстовое сообщение, чтобы cбросить контекст /new`),
	);
};
export const newContext = async (context: any): Promise<void> => {
	context.session = {
		message: [],
	};
	await context.reply(code('Контекст сброшен'));
};
