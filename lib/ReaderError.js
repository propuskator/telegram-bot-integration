import TelegramBotError from './TelegramBotError.js';

export const CODES = {
    'OFFLINE'          : 'OFFLINE',
    'NOT_FOUND'        : 'NOT_FOUND',
    'TIMEOUT'          : 'TIMEOUT',
    'ACCESS_FORBIDDEN' : 'ACCESS_FORBIDDEN'
};

export default class ReaderError extends TelegramBotError {
    static errorMessagesByCodes = {
        [CODES.OFFLINE]          : () => 'The reader is currently offline',
        [CODES.NOT_FOUND]        : () => 'The reader is not found',
        [CODES.TIMEOUT]          : () => 'The reader on/off timeout exceeded',
        [CODES.ACCESS_FORBIDDEN] : () => 'Access forbidden'
    };
}
