export const checkTime = (context: any): boolean =>
	context.message.date >= context.session.time
		? ((context.session.time = context.message.date + 6), true)
		: false;
