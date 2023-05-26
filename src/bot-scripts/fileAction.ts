import { code } from 'telegraf/format';
import { checkTime, saveLog, splitTextAndCode } from './utils';
import { openai } from '../services/openai/openai.service';
import { FileService } from '../services/file/fileService';
import { AxiosService } from '../services/axios/axios.service';

export const fileAction = async (ctx: any): Promise<void> => {
	ctx.session ??= {};
	ctx.session.messages ??= [];
	ctx.session.time ??= 0;

	if (!checkTime(ctx)) {
		await ctx.reply(code('🚧 Не успеваю за вами...'));
		return;
	}

	await ctx.reply(code('Думаю над ответом...'));

	const userId = ctx.message.from.id;
	console.log('UserID: ', ctx.message.document.file_id);
	console.log('ctx.message: ', ctx.message);
	const document = new FileService(
		`${userId}-${ctx.message.document.file_name}`,
		'./../../../document',
	);
	const stream = document.createWriteStream();
	const link = await ctx.telegram.getFileLink(ctx.message.document.file_id);

	const documentRespoce = new AxiosService(link);
	await documentRespoce.getStreamWriteFile(stream);

	const contentInFile = await document.readFile();
	document.delete();
	const serviceMessages = `Сделай этот код лучше.
	Выведи пример правильного кода. Объясни внесенные правки в виде отдельного списка по пунктам,
   отметь номер правки в коде.
	Проверь правильность названий переменных, найди все опечатки если они есть.
	Проверь, что все переменные написаны в стиле Camel case;`;

	ctx.session.messages.push(openai.getAssistantMessage(serviceMessages));
	ctx.session.messages.push(openai.getUserMessage(contentInFile));

	saveLog(ctx.message);

	const openaiAnswer = await openai.chat(ctx.session.messages);

	ctx.session.messages.push(openai.getAssistantMessage(openaiAnswer.content));

	await splitTextAndCode(openaiAnswer.content, ctx);
};
