import config from 'config';
import { TelegrafServices } from './services/telegraf/telegraf.services';
import { FileService } from './services/file/fileService';
import { l } from './services/logger/logger.service';
import { AxiosService } from './services/axios/axios.service';
import { convector } from './services/ogg/oggConverter';
import { openai } from './services/openai/openai.service';
import { code } from 'telegraf/format';

const startComand = async (context: any): Promise<void> => {
	context.session ??= {};
	context.session.message ??= [];
	context.session.message = [];
	//	l.warn(context.session.message);
	await context.reply('Отравте голосовое и текствое сообщение');
};
const newContext = async (context: any): Promise<void> => {
	context.session ??= {};
	context.session.message ??= [];
	context.session.message = [];
	//	l.warn(context.session.message);
	await context.reply(code('Контекст сброшен'));
};

const voiceAction = async (context: any): Promise<void> => {
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

	context.session ??= {};
	context.session.messages ??= [];

	context.session.messages.push(openai.getUserMessage(text));

	const openaiAnswer = await openai.chat(context.session.messages);

	context.session.messages.push(openai.getAssistantMessage(openaiAnswer.content));

	await context.reply(code(openaiAnswer.content));
};

const messageAction = async (context: any): Promise<void> => {
	await context.reply(code('Думаю над ответом...'));
	context.session ??= {};
	context.session.messages ??= [];
	context.session.messages.push(openai.getUserMessage(context.message.text));

	const openaiAnswer = await openai.chat(context.session.messages);
	context.session.messages.push(openai.getAssistantMessage(openaiAnswer.content));

	await context.reply(code(openaiAnswer.content));
};

const start = async (): Promise<void> => {
	const maksLifeBot = new TelegrafServices(config.get('TELEGRAM_TOKEN'));
	maksLifeBot.useSession();
	maksLifeBot.comand(startComand, 'start');
	maksLifeBot.comand(newContext, 'new');
	maksLifeBot.speechToAction(voiceAction);
	maksLifeBot.textToAction(messageAction);
};

start();
