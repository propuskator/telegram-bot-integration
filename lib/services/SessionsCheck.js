import TelegramBotError, { CODES } from '../TelegramBotError.js';
import { UserTelegramChat }        from '../domain-model/models/sequelize/index.js';
import ServiceBase                 from './ServiceBase.js';

export default class SessionsDelete extends ServiceBase {
    static validationRules = {
        chatId : [ 'required', 'positive_integer' ]
    };

    async execute({ chatId }) {
        const userTelegramChat = await UserTelegramChat.findOne({ where: { chatId } });

        if (!userTelegramChat) throw new TelegramBotError(CODES.AUTHENTICATION_FAILED);

        return {
            status : 1,
            data   : {
                userId : userTelegramChat.userId
            }
        };
    }
}
