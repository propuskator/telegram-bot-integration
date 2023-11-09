import backendClient                 from '../../../backendClient.js';
import { Logger }                    from '../../../utils/logger/index.js';
import TelegramBotError              from '../../../TelegramBotError.js';
import ReaderError, { CODES }        from '../../../ReaderError.js';
import errorTypesToReaderErrorsCodes from '../../../constants/accessBackendErrorTypesToReaderErrorsCodes.js';

const logger = Logger('AccessTokenReader');

export default class AccessTokenReader {
    static async getListOfAvailableReaders(token) {
        const response = await backendClient.get('access-token-readers', {
            headers : {
                'X-AuthToken' : token
            }
        });
        const { status, data } = await response.json();

        if (status === 0) {
            logger.warn(`getListOfAvailableReaders error: ${JSON.stringify({
                response : {
                    status,
                    data
                }
            })}`);

            throw new TelegramBotError();
        }

        return data;
    }

    // open or close access token reader depend on current state(open if it is closed and vise versa)
    static async openOrClose(id, token) {
        const response = await backendClient.post(`access-token-readers/${id}/open`, {}, {
            headers : {
                'X-AuthToken' : token
            }
        });

        const { status, type } = await response.json();

        if (status === 0) {
            const errorCode = errorTypesToReaderErrorsCodes[type] || CODES.OFFLINE;

            throw new ReaderError(errorCode);
        }
    }
}
