import AccessTokenReader from '../domain-model/models/backend/AccessTokenReader.js';
import ServiceBase       from './ServiceBase.js';

export default class CollectReadersWithHomieDevices extends ServiceBase {
    async execute() {
        const { homie, token } = this.context;
        const accessTokenReaders = await AccessTokenReader.getListOfAvailableReaders(token);
        const readersWithHomieDevices = accessTokenReaders.reduce((acc, reader) => {
            try {
                const homieDevice = homie.getDeviceById(reader.code);
                const readerWithHomieDevice = {
                    reader,
                    homieDevice
                };

                return [ ...acc, readerWithHomieDevice ];
            } catch {
                this.logger.warn(`collecting homie devices error: device with id="${reader.code}" not found`);

                return acc;
            }
        }, []);

        return readersWithHomieDevices;
    }
}
