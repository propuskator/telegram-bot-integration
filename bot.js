import { createServer }  from 'http';
import { promisify }     from 'util';
import { fileURLToPath } from 'url';
import path              from 'path';

import { Telegraf, session, Scenes } from 'telegraf';
import MqttTransport                 from 'homie-sdk/lib/Broker/mqtt/index.js';
import HomieCloud                    from 'homie-sdk/lib/homie/HomieCloud/index.js';

import config                   from './config/common.js';
import { Logger }               from './lib/utils/logger/index.js';
import { readAndParseCommands } from './lib/utils/bot.js';
import * as commands            from './lib/commands/index.js';
import * as middleware          from './lib/middleware/index.js';
import * as scenes              from './lib/scenes/index.js';
import * as actions             from './lib/actions/index.js';
import { LOGIN_SCENE_ID }       from './lib/scenes/login.js';
import handleBotError           from './lib/handleBotError.js';

const {
    bot  : configBot,
    mqtt : configMqtt
} = config;

const logger = Logger('Bot');
const bot    = new Telegraf(configBot.token);

const CURR_DIR_PATH      = path.dirname(fileURLToPath(import.meta.url));
const COMMANDS_FILE_PATH = path.join(CURR_DIR_PATH, 'etc', 'commands.json');

let server = null; // webhook server

function extendContext({ homieCloud, parsedCommands }) {
    const { context } = bot;

    context.homieCloud = homieCloud;
    context.parsedCommands = parsedCommands;
    context.logger = logger;
}

async function init({ homieCloud }) {
    await homieCloud.init();

    const parsedCommands = await readAndParseCommands(COMMANDS_FILE_PATH);

    await bot.telegram.setMyCommands(parsedCommands);

    extendContext({ homieCloud, parsedCommands });

    // detailed info about scenes is here: https://github.com/telegraf/telegraf/issues/705#issuecomment-549056045
    const stage = new Scenes.Stage(Object.values(scenes));

    bot
        .use(session()) // scenes should not work without session middleware
        .use(stage.middleware())
        .start(commands.start)
        .command('login', Scenes.Stage.enter(LOGIN_SCENE_ID))
        .command('access_points', middleware.checkSession, commands.readers) // access points are the access token readers in terms of access-control(Propuskator) app
        .command('logout', middleware.checkSession, commands.logout)
        .action(/.+/, middleware.checkSession, actions.onAction)
        .help(commands.help)
        .catch(handleBotError);
}

export async function start({ useWebhook = true } = {}) {
    const mqttTransport = new MqttTransport({
        uri      : configMqtt.uri,
        username : configMqtt.username,
        password : configMqtt.password
    });
    const homieCloud = new HomieCloud({ transport: mqttTransport });

    await init({ homieCloud });

    if (!useWebhook) {
        logger.info('Starting in polling mode');

        return bot.launch();
    }

    // start bot listening to updates using webhook,
    // see details here: https://github.com/telegraf/telegraf#webhook
    const webhookPath = `/${configBot.token}`;
    const webhookUrl = `${configBot.baseUrl}${webhookPath}`;

    const isWebhookSet = await bot.telegram.setWebhook(webhookUrl); // details: https://core.telegram.org/bots/api#setwebhook

    if (!isWebhookSet) {
        logger.error('Failed to set webhook');

        throw new Error('Failed to start bot');
    }

    logger.info('Webhook was set successfully');

    const webhookCallback = bot.webhookCallback(webhookPath);

    server = createServer(webhookCallback);
    server.closeAsync = promisify(server.close);

    const { port } = configBot;

    server.listen(port, () => {
        logger.info(`Webhook server: STARTING AT PORT [${port}]`);
    });
}

export async function stop({ useWebhook = true, signal } = {}) {
    bot.stop(signal);

    if (useWebhook) {
        logger.info('Closing webhook server...');

        await bot.telegram.deleteWebhook();
        await server.closeAsync();
    }
}

export default bot;
