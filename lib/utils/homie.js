import homieConstants from '../constants/homie.js';

const { ACCESS_TOKEN_READER_NODE_ID, ACCESS_TOKEN_READER_SENSOR_ID } = homieConstants;

export function mapHomieBooleanValueToEmoji(homieValue) {
    return homieValue === 'true' ? '🟢' : '🔴';
}

export function getReaderSensorFromHomieDevice(homieDevice) {
    return homieDevice
        .getNodeById(ACCESS_TOKEN_READER_NODE_ID)
        .getSensorById(ACCESS_TOKEN_READER_SENSOR_ID);
}
