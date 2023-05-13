import { code } from 'telegraf/format';

export const startComand = async (context: any): Promise<void> => {
	context.session = {
		message: [],
	};
	await context.reply(
		`🌸 Добро пожаловать!

		🤖 Я бот и умею отвечать на текстовые и голосовые сообщения. 
		
		🎤 Для отправки голосового сообщения нажмите на символ микрофона рядом с текстовым полем.
		
		💬 Если вы хотите начать новую беседу, просто введите команду /new.
		
		👩‍💻 Я готов помочь вам в любое время, просто напишите мне!`,
	);
	//code(`💬 Отправьте голосовое или текстовое сообщение /n, чтобы cбросить контекст /new`),
};
export const newContext = async (context: any): Promise<void> => {
	context.session = {
		message: [],
	};
	await context.reply(code('Контекст сброшен'));
};
