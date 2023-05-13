import { code } from 'telegraf/format';

export const checkTime = (context: any): boolean =>
	context.message.date >= context.session.time
		? ((context.session.time = context.message.date + 6), true)
		: false;

export const splitTextAndCode = async (messageText: string, context: any): Promise<void> => {
	const lines = messageText.split('```');
	for (let i = 0; i <= lines.length; i++) {
		if (i === 0 || i % 2 === 0) {
			lines[i] ? await context.reply(lines[i]) : null;
		} else {
			lines[i] ? await context.reply(code(lines[i])) : null;
		}
	}
};
