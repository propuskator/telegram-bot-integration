import { Sequelize } from 'sequelize';

import * as models from './models/sequelize/index.js';

function initSequelizeModels(config) {
    const { database, username, password, dialect, host, port, pool, logging } = config;

    const sequelize = new Sequelize(database, username, password, {
        host,
        port,
        dialect,
        pool,
        logging
    });

    Object
        .values(models)
        .forEach(model => model.init(sequelize, model.options()));
    Object.values(models)
        .forEach(model => model.initRelationsAndHooks(sequelize));

    return models;
}

export function initAllModels({ sequelizeConfig }) {
    const sequelizeModels = initSequelizeModels(sequelizeConfig);

    return {
        sequelize : sequelizeModels
    };
}
