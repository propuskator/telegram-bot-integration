import TelegramBotError, { CODES }                          from '../TelegramBotError.js';
import { Workspace, User, AccessSubject, UserTelegramChat } from '../domain-model/models/sequelize/index.js';
import ServiceBase                                          from './ServiceBase.js';

export default class SessionsCreate extends ServiceBase {
    static validationRules = {
        workspaceName : [ 'required', 'string' ],
        email         : [ 'required', 'email' ],
        password      : [ 'required', 'string' ],
        chatId        : [ 'required', 'positive_integer' ]
    };

    async execute({ workspaceName, email, password, chatId }) {
        const loginError = new TelegramBotError(CODES.INVALID_CREDENTIALS);

        const workspace = await Workspace.findOne({ where: { name: workspaceName } });

        if (!workspace) throw loginError;

        const user = await User.findOne({
            where : {
                email,
                workspaceId : workspace.id
            },
            paranoid : false
        });

        if (!user || user.isSoftDeleted() || !await user.checkPassword(password)) throw loginError;

        const accessSubject = await AccessSubject.findOne({
            where : {
                userId      : user.id,
                email       : user.email,
                workspaceId : user.workspaceId
            }
        });

        if (!accessSubject) throw loginError;
        if (!accessSubject.mobileEnabled || !accessSubject.enabled) {
            throw new TelegramBotError(CODES.ACCESS_IS_TEMPORARILY_DENIED, { workspaceName });
        }

        const userTelegramChat = await UserTelegramChat.findOne({
            where : {
                userId : user.id,
                chatId
            }
        });

        if (userTelegramChat) throw new TelegramBotError(CODES.ALREADY_LOGGED_IN);

        await UserTelegramChat.create({ userId: user.id, chatId });
    }
}
