import ReaderError, { CODES } from '../ReaderError.js';
import TelegramBotError       from '../TelegramBotError.js';
import AccessTokenReader      from '../domain-model/models/backend/AccessTokenReader.js';

export async function onReaderSelect(ctx, { homieDevice, sensor, reader, token }) {
    return new Promise(async (resolve) => { // eslint-disable-line no-async-promise-executor
        const publishEventName = sensor._getPublishEventName();
        const homieDeviceCurrentState = homieDevice.getState();
        const sensorCurrentValue = sensor.getValue();
        const sensorTargetValue = sensorCurrentValue === 'true' ? 'false' : 'true';
        const targetValueForMessageText = sensorTargetValue === 'true' ? 'On' : 'Off';
        const onSensorPublishValue = async data => { // eslint-disable-line func-style
            const [ field ] = Object.keys(data);

            if (field === 'value') {
                await ctx.answerCbQuery(`Successfully ${targetValueForMessageText}`);

                resolve();
            }
        };

        try {
            if (homieDeviceCurrentState !== 'ready') throw new ReaderError(CODES.OFFLINE);

            sensor._homie.once(publishEventName, onSensorPublishValue);

            await AccessTokenReader.openOrClose(reader.id, token);
        } catch (err) {
            sensor._homie.off(publishEventName, onSensorPublishValue);

            if (err instanceof TelegramBotError) {
                await ctx.answerCbQuery(err.message, { 'show_alert': true });
            } else {
                ctx.logger.warn(`onReaderSelect action error occurs: ${err.message} ${err.stack}`);

                await ctx.answerCbQuery(`Error with ${targetValueForMessageText}`);
            }

            resolve();
        }
    });
}

export function onAction(ctx) {
    const {
        update : {
            'callback_query' : { data: actionIdWithCommand }
        },
        session : { commandsData }
    } = ctx;

    const [ command ] = actionIdWithCommand.split('/');
    const { actionsEmitter } = commandsData[command];

    actionsEmitter.emit(actionIdWithCommand, ctx);
}
