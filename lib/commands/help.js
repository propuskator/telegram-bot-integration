import ShowHelp from '../services/ShowHelp.js';

export function help(ctx) {
    const { parsedCommands } = ctx;

    const helpText = new ShowHelp().run({ commands: parsedCommands });

    return ctx.reply(helpText);
}
