import { capitalizeFirstLetter } from './utils/common.js';

export const CODES = {
    'WRONG_EMAIL'                  : 'WRONG_EMAIL',
    'REQUIRED'                     : 'REQUIRED',
    'INVALID_CREDENTIALS'          : 'INVALID_CREDENTIALS',
    'ALREADY_LOGGED_IN'            : 'ALREADY_LOGGED_IN',
    'AUTHENTICATION_FAILED'        : 'AUTHENTICATION_FAILED',
    'NOT_LOGGED_IN'                : 'NOT_LOGGED_IN',
    'ACCESS_IS_TEMPORARILY_DENIED' : 'ACCESS_IS_TEMPORARILY_DENIED'
};

export default class TelegramBotError {
    constructor(code, payload = {}) {
        this.message = this.constructor.getErrorMessageByCode(code, payload) || 'Error occurred';
    }

    static errorMessagesByCodes = {
        [CODES.WRONG_EMAIL]                  : () => 'Wrong email',
        [CODES.REQUIRED]                     : ({ field }) => capitalizeFirstLetter(`${field} is required`),
        [CODES.INVALID_CREDENTIALS]          : () => 'Invalid credentials',
        [CODES.ALREADY_LOGGED_IN]            : () => 'You are already logged in',
        [CODES.AUTHENTICATION_FAILED]        : () => 'Authentication failed, please log in',
        [CODES.NOT_LOGGED_IN]                : () => 'You are not logged in',
        [CODES.ACCESS_IS_TEMPORARILY_DENIED] : ({ workspaceName }) =>
            `Access for "${workspaceName}" workspace is temporarily denied`
    };

    static getErrorMessageByCode(code, payload) {
        const getErrorMessageByCode = this.errorMessagesByCodes[code];

        return getErrorMessageByCode && getErrorMessageByCode(payload);
    }
}
