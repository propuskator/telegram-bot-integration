import { validate }     from '../utils/common.js';
import { Logger }       from '../utils/logger/index.js';
import TelegramBotError from '../TelegramBotError.js';

export default class ServiceBase {
    constructor({ context = {} } = {}) {
        this.context = context;
        this.logger = Logger(this.constructor.name);
    }

    run(params = {}) {
        const cleanParams = this.validate(params, this.constructor.validationRules);

        return this.execute(cleanParams);
    }

    validate(data, rules) {
        const { isValid, validData, errors } = validate(data, rules);

        // throw first occurred error as it is redundant to display several errors
        // to Telegram user in one or several messages
        if (!isValid) {
            const [ [ errorField, errorCode ] ] = Object.entries(errors);

            throw new TelegramBotError(errorCode, { field: errorField });
        }

        return validData;
    }

    async execute() {
        throw new Error('execute method should be implemented');
    }
}
