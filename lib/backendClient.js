import config   from '../config/common.js';
import ApiFetch from './utils/api/ApiFetch.js';

const configServiceBackend = config.services.backend;
const backendClient        = new ApiFetch({
    protocol : configServiceBackend.protocol,
    host     : configServiceBackend.host,
    port     : configServiceBackend.port
});

export default backendClient;
