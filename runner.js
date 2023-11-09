import { start, stop }  from './bot.js';
import config           from './config/common.js';
import dbConfig         from './config/db.js';
import { Logger }       from './lib/utils/logger/index.js';
import * as DomainModel from './lib/domain-model/index.js';

const {
    env = 'development',
    bot : { updateMode }
}                = config;
const useWebhook = updateMode === 'webhook';
const logger     = Logger('[APP]');

async function shutdown(signal) {
    await stop({ useWebhook, signal });

    process.exit(0);
}

async function main() {
    process
        .once('SIGINT', async () => {
            logger.info('SIGINT signal was caught');

            await shutdown('SIGINT');
        })
        .once('SIGTERM', async () => {
            logger.info('SIGTERM signal was caught');

            await shutdown('SIGTERM');
        });

    const sequelizeConfig = dbConfig[env];

    DomainModel.initAllModels({ sequelizeConfig });

    await start({ useWebhook });
}

main().catch(err => {
    console.error(err);

    process.exit(1);
});
