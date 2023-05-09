import { Logger, ILogObj } from 'tslog';
import { ILogger } from './logger.interface';

export class LoggerService implements ILogger {
	logger: Logger<ILogObj>;

	constructor() {
		this.logger = new Logger({ hideLogPositionForProduction: true, type: 'pretty' });
	}

	log(...args: unknown[]): void {
		this.logger.info(...args);
	}

	error(...args: unknown[]): void {
		this.logger.error(...args);
	}

	warn(...args: unknown[]): void {
		this.logger.warn(...args);
	}
	info(...args: unknown[]): void {
		this.logger.info(...args);
	}
	trace(...args: unknown[]): void {
		this.logger.trace(...args);
	}
}

export const l = new LoggerService();
