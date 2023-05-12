import { code, fmt } from 'telegraf/format';
import { checkTime } from './checkTime';
import { openai } from '../services/openai/openai.service';
import { l } from '../services/logger/logger.service';

export const messageAction = async (context: any): Promise<void> => {
	context.session ??= {};
	context.session.messages ??= [];
	context.session.time ??= 0;
	if (!checkTime(context)) {
		await context.reply(code('🚧 Не успеваю за вами...'));
		return;
	}

	await context.reply(code('Думаю над ответом...'));

	context.session.messages.push(openai.getUserMessage(context.message.text));

	const openaiAnswer = await openai.chat(context.session.messages);
	context.session.messages.push(openai.getAssistantMessage(openaiAnswer.content));
	//l.warn(splitTextAndCode(openaiAnswer.content));
	await context.reply(openaiAnswer.content);
	//await splitTextAndCode(openaiAnswer.content, context);
};

/* async function splitTextAndCode(messageText: string, context: any): Promise<void> {
	// Разделяем текст на строки
	const lines = messageText.split('```');

	for (let i = 0; i <= lines.length; i++) {
		if (i === 0 || i % 2 === 0) {
			await context.reply(lines[i]);
		} else {
			await context.reply(code(lines[i]));
		}
	}
}
 */
