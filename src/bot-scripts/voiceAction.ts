import { code } from 'telegraf/format';
import { checkTime } from './checkTime';
import { FileService } from '../services/file/fileService';
import { AxiosService } from '../services/axios/axios.service';
import { convector } from '../services/ogg/oggConverter';
import { openai } from '../services/openai/openai.service';
import { l } from '../services/logger/logger.service';

export const voiceAction = async (context: any): Promise<void> => {
	context.session ??= {};
	context.session.messages ??= [];

	context.session.time ??= 0;
	if (!checkTime(context)) {
		await context.reply(code('🚧 Не успеваю за вами...'));
		return;
	}

	await context.reply(code('Думаю над ответом...'));

	const userId = context.message.from.id;
	const oggFile = new FileService(`${userId}.ogg`, './../../../voices');
	const mp3File = new FileService(`${userId}.mp3`, './../../../voices');
	const stream = oggFile.createWriteStream();

	const link = await context.telegram.getFileLink(context.message.voice.file_id);
	const oggRespoce = new AxiosService(link);
	await oggRespoce.getStreamWriteFile(stream);
	await convector.convertToMp3(oggFile.path, mp3File.path);

	l.info(await oggFile.delete());
	const text = await openai.transcription(mp3File.createReadStream());
	l.info(await mp3File.delete());

	context.session.messages.push(openai.getUserMessage(text));

	const openaiAnswer = await openai.chat(context.session.messages);

	context.session.messages.push(openai.getAssistantMessage(openaiAnswer.content));

	await context.reply(openaiAnswer.content);
};
