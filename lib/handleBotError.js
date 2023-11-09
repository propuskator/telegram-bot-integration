import TelegramBotError from './TelegramBotError.js';

export default function handleBotError(err, ctx) {
    const { logger } = ctx;
    // retrieve message from common message or from callback message
    const message = ctx.update.message || ctx.update.callback_query.message;

    logger.warn(`Error occurred: ${JSON.stringify({
        errorMessage : err.message,
        messageId    : message.message_id,
        fromId       : message.from.id,
        chatId       : message.chat.id
    })}`);

    return ctx.reply(err instanceof TelegramBotError ? err.message : 'Error occurred');
}
