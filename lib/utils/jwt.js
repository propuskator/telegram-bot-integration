import { promisify } from 'util';
import jwt           from 'jsonwebtoken';

import config from '../../config/common.js';

const sign = promisify(jwt.sign);

function getSecretKeyForUser(user) {
    return `${config.secret}${user.email}${user.passwordHash}`;
}

export function generateToken(user, options = {}) {
    const payload = { userId: user.id };
    const secretKey = getSecretKeyForUser(user);

    return sign(payload, secretKey, options);
}
