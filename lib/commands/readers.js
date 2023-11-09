import CollectReadersWithHomieDevices     from '../services/CollectReadersWithHomieDevices.js';
import { buildReadersInlineKeyboard }     from '../utils/readers.js';
import * as actions                       from '../actions/index.js';
import handleBotError                     from '../handleBotError.js';
import { getReaderSensorFromHomieDevice } from '../utils/homie.js';

export async function readers(ctx, { editMessage = false, messageId }) {
    const {
        session : { homie, token, commandsData: { readers: { actionsEmitter, homieListenersOffCallbacks } } },
        chat    : { id: chatId }
    } = ctx;

    actionsEmitter.removeAllListeners();

    if (!editMessage) {
        homieListenersOffCallbacks.forEach(removeListener => removeListener());
        homieListenersOffCallbacks.length = 0;
    }

    const readersWithHomieDevices = await new CollectReadersWithHomieDevices({ context: { homie, token } }).run();
    const keyboard = buildReadersInlineKeyboard(readersWithHomieDevices, { commandName: 'readers' });
    const messageText = 'Access Points:';
    const messageExtra = {
        'reply_markup' : keyboard.reply_markup
    };
    const message = !editMessage ?
        await ctx.reply(messageText, messageExtra) :
        await ctx.telegram.editMessageText(chatId, messageId, null, messageText, messageExtra);

    const buttons = keyboard.reply_markup.inline_keyboard;

    buttons.forEach(buttonsRow => {
        buttonsRow.forEach(({ callback_data: actionId, reader }) => {
            const homieDevice = homie.getDeviceById(reader.code);
            const sensor = getReaderSensorFromHomieDevice(homieDevice);
            const publishEventName = sensor._getPublishEventName();

            if (!editMessage) {
                const onSensorPublishValue = async data => { // eslint-disable-line func-style
                    const [ field ] = Object.keys(data);

                    if (field === 'value') {
                        await readers(ctx, {
                            editMessage : true,
                            messageId   : message.message_id
                        });
                    }
                };

                homie.on(publishEventName, onSensorPublishValue);

                // collect function to remove this listener on next /readers command call
                homieListenersOffCallbacks.push(() => homie.off(publishEventName, onSensorPublishValue));
            }

            // register listener which will be called on callback button press
            actionsEmitter.once(actionId, actionCtx => actions // eslint-disable-line more/no-then
                .onReaderSelect(actionCtx, {
                    homieDevice,
                    sensor,
                    reader,
                    token
                })
                .then(() => readers(actionCtx, { editMessage: true, messageId: message.message_id }))
                .catch(err => handleBotError(err, actionCtx)));
        });
    });
}
