import { randomUUID } from 'crypto';
import { Markup }     from 'telegraf';

import { getReaderSensorFromHomieDevice, mapHomieBooleanValueToEmoji } from '../utils/homie.js';

export function buildReadersInlineKeyboard(readersWithHomieDevices, { commandName }) {
    const buttons = readersWithHomieDevices.reduce((acc, { reader, homieDevice }) => {
        const sensor = getReaderSensorFromHomieDevice(homieDevice);
        const sensorValue = sensor.getValue();
        const buttonText = `(${reader.name}) : ${mapHomieBooleanValueToEmoji(sensorValue)}`;
        const actionId = `${commandName}/${randomUUID()}`;
        const button = Markup.button.callback(buttonText, actionId);

        // assign reader to button for getting homie device when create events for each button
        button.reader = reader;

        return [ ...acc, [ button ] ]; // place each button in separate row
    }, []);
    const inlineKeyboard = Markup.inlineKeyboard(buttons);

    return inlineKeyboard;
}
