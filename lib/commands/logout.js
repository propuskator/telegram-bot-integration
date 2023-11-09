import SessionsDelete from '../services/SessionsDelete.js';

export async function logout(ctx) {
    const {
        session : { userId },
        chat    : { id: chatId }
    } = ctx;

    await new SessionsDelete().run({
        userId,
        chatId
    });

    delete ctx.session; // eslint-disable-line no-param-reassign

    await ctx.reply('Successfully logged out');
}
