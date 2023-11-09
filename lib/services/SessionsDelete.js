import TelegramBotError, { CODES } from '../TelegramBotError.js';
import { UserTelegramChat }        from '../domain-model/models/sequelize/index.js';
import ServiceBase                 from './ServiceBase.js';

export default class SessionsDelete extends ServiceBase {
    static validationRules = {
        userId : [ 'required', 'positive_integer' ],
        chatId : [ 'required', 'positive_integer' ]
    };

    async execute({ userId, chatId }) {
        const userTelegramChat = await UserTelegramChat.findOne({
            where : {
                userId,
                chatId
            }
        });

        if (!userTelegramChat) throw new TelegramBotError(CODES.NOT_LOGGED_IN);

        await userTelegramChat.destroy();
    }
}
