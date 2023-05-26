import { code as telegrafCodeFormat } from 'telegraf/format';

export const startCommand = async (ctx: any): Promise<void> => {
	ctx.session.messages = [];

	await ctx.reply(`🌸 Добро пожаловать!

    🤖 Я бот и умею отвечать на текстовые и голосовые сообщения. 

    🎤 Для отправки голосового сообщения нажмите на символ микрофона рядом с текстовым полем.

    💬 Если вы хотите начать новую беседу, просто введите команду /new.

    👩‍💻 Я готов помочь вам в любое время, просто напишите мне!`);
};

export const newContext = async (ctx: any): Promise<void> => {
	ctx.session.messages = [];

	await ctx.reply(telegrafCodeFormat('Контекст сброшен'));
};
