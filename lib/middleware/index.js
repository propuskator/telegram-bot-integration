/* eslint-disable no-param-reassign,require-atomic-updates */
import EventEmitter from 'events';

import SessionsCheck       from '../services/SessionsCheck.js';
import { User, AdminUser } from '../domain-model/models/sequelize/index.js';
import { generateToken }   from '../utils/jwt.js';

export async function checkSession(ctx, next = () => {}) {
    const { update, homieCloud, session } = ctx;
    // retrieve chat id from common message or from callback message
    const chatId = update.message?.chat.id || update.callback_query.message.chat.id;

    const { data: { userId } } = await new SessionsCheck().run({ chatId });
    const user = await User.findOne({ where: { id: userId } });
    const workspaceAdminUser = await AdminUser.findOne({ where: { workspaceId: user.workspaceId } });
    const rootTopic = workspaceAdminUser.rootTopic;
    const homie = await homieCloud.initNewHomie(rootTopic);

    // ctx.session object was created by Telegraf's session middleware
    // its should be replaced with logical nullish assignment in the future:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_nullish_assignment
    session.userId = session.userId ?? userId;
    session.homie = session.homie ?? homie;
    session.token = session.token ?? await generateToken(user);
    session.commandsData = session.commandsData ?? {
        readers : {
            actionsEmitter             : new EventEmitter(),
            homieListenersOffCallbacks : []
        }
    };

    return next();
}
