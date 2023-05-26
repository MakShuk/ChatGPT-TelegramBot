import { code } from 'telegraf/format';
import { FileService } from '../services/file/fileService';

export const checkTime = (context: any): boolean =>
	context.message.date >= context.session.time
		? ((context.session.time = context.message.date + 6), true)
		: false;

export const splitTextAndCode = async (messageText: string, context: any): Promise<void> => {
	console.log(messageText);
	const lines = messageText.split('```');
	for (let i = 0; i <= lines.length; i++) {
		if (i === 0 || i % 2 === 0) {
			lines[i] ? await context.reply(lines[i]) : null;
		} else {
			lines[i] ? await context.reply(code(lines[i])) : null;
		}
	}
};

export const saveLog = async (message: any): Promise<void> => {
	const logFile = new FileService(`log.txt`, './../../../log/');
	let truncateString = 'Voice message...';
	if (message.text !== undefined) {
		truncateString = message.text.length > 100 ? message.text.slice(0, 100) + '...' : message.text;
	}
	const log = {
		id: message.from.id || null,
		name: message.from.first_name || null,
		message: truncateString || null,
	};
	logFile.appendFile(`${JSON.stringify(log)}/n`);
};
