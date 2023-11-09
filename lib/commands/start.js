import { help as handleHelpCommand } from './help.js';

export async function start(ctx) {
    await ctx.reply('Welcome to Propuskator bot');
    await handleHelpCommand(ctx);
}
