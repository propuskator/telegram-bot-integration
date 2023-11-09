import { Markup } from 'telegraf';

import SessionsCreate from '../services/SessionsCreate.js';

export async function login(ctx) {
    const {
        message : { chat: { id: chatId } },
        wizard  : {
            state : {
                loginData : { workspaceName, email, password },
                messagesIdsToDelete
            }
        },
        logger
    } = ctx;

    try {
        await new SessionsCreate().run({
            workspaceName,
            email,
            password,
            chatId
        });

        await ctx.reply('Successfully logged in');

        const keyboardWithMainCommands = Markup.keyboard([ '/access_points' ]);

        await ctx.reply('Main commands:', {
            'reply_markup' : keyboardWithMainCommands.resize(true).reply_markup
        });
    } finally {
        await Promise // eslint-disable-line more/no-then
            .allSettled(messagesIdsToDelete.map(messageId => ctx.deleteMessage(messageId)))
            .then(results => results.forEach(({ status, reason }) => {
                if (status === 'rejected') {
                    logger.warn(`/login command message delete error occurs, reason: ${reason}`);
                }
            }));
    }
}
