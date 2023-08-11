import { code } from 'telegraf/format';
import { checkTime, saveLog, splitTextAndCode } from './utils';
import { openai } from '../services/openai/openai.service';
import { FileService } from '../services/file/fileService';
import { AxiosService } from '../services/axios/axios.service';

const defaultСontext = `Структурируй текст`;

export const fileAction = async (ctx: any): Promise<void> => {
	ctx.session ??= {};
	ctx.session.messages ??= [];
	ctx.session.time ??= 0;

	if (!checkTime(ctx)) {
		await ctx.reply(code('🚧 Не успеваю за вами...'));
		return;
	}
	console.log(ctx.message.document);

	await ctx.reply(code('Думаю над ответом...'));

	const userId = ctx.message.from.id;

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
	const serviceMessages = ctx.message.caption || defaultСontext;
	console.log(serviceMessages);

	ctx.session.messages.push(openai.getAssistantMessage(serviceMessages));
	ctx.session.messages.push(openai.getUserMessage(contentInFile));

	saveLog(ctx.message);

	console.log(ctx.session.messages);
	const openaiAnswer = await openai.chat(ctx.session.messages);

	ctx.session.messages.push(openai.getAssistantMessage(openaiAnswer.content));

	await splitTextAndCode(openaiAnswer.content, ctx);
};
