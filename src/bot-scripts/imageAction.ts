import { code } from 'telegraf/format';
import { checkTime, saveLog, splitTextAndCode } from './utils';
import { openai } from '../services/openai/openai.service';
import { FileService } from '../services/file/fileService';
import { AxiosService } from '../services/axios/axios.service';
import { LoggerService } from '../services/logger/logger.service';
import { extname } from 'path';
import { OcrService } from '../services/OCR/OCR.service';

const logger = new LoggerService('imageAction');

const defaultСontext = `Выдели суть`;

export const imageAction = async (ctx: any): Promise<void> => {
	ctx.session ??= {};
	ctx.session.messages ??= [];
	ctx.session.time ??= 0;

	if (!checkTime(ctx)) {
		await ctx.reply(code('🚧 Не успеваю за вами...'));
		return;
	}

	await ctx.reply(code('Думаю над ответом...'));

	const userId = ctx.message.from.id;
	const file = await ctx.telegram.getFile(ctx.message.photo.slice(-1)[0].file_id);

	const photo = new FileService(
		`${userId}${extname(file.file_path || '.jpeg')}`,
		'./../../../document',
	);
	const photoStream = photo.createWriteStream();

	const fileUrl = `https://api.telegram.org/file/bot${ctx.telegram.token}/${file.file_path}`;
	const documentRespoce = new AxiosService(fileUrl);
	await documentRespoce.getStreamWriteFile(photoStream);
	const text = await OcrService.getTextInPath(photo.path);
	photo.delete();

	const serviceMessages = ctx.message.caption || defaultСontext;

	ctx.session.messages.push(openai.getAssistantMessage(serviceMessages));
	ctx.session.messages.push(openai.getUserMessage(text));

	saveLog(ctx.message);

	const openaiAnswer = await openai.chat(ctx.session.messages);

	ctx.session.messages.push(openai.getAssistantMessage(openaiAnswer.content));

	await splitTextAndCode(openaiAnswer.content, ctx);
};
