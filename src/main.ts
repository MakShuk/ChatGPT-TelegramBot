import config from 'config';
import { TelegrafServices } from './services/telegraf/telegraf.services';
import { voiceAction } from './bot-scripts/voiceAction';
import { messageAction } from './bot-scripts/messageAction';
import { newContext, startComand } from './bot-scripts/comand';

const start = async (): Promise<void> => {
	const maksLifeBot = new TelegrafServices(config.get('TELEGRAM_TOKEN'));
	maksLifeBot.useSession();
	maksLifeBot.comand(startComand, 'start');
	maksLifeBot.comand(newContext, 'new');
	maksLifeBot.speechToAction(voiceAction);
	maksLifeBot.textToAction(messageAction);
};

start();
