import { code } from 'telegraf/format';
import { checkTime, saveLog, splitTextAndCode } from './utils';
import { openai } from '../services/openai/openai.service';

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
	saveLog(context.message);
	const openaiAnswer = await openai.chat(context.session.messages);
	context.session.messages.push(openai.getAssistantMessage(openaiAnswer.content));
	await splitTextAndCode(openaiAnswer.content, context);
};
