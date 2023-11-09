import { createHash } from 'crypto';
import { Validator }  from 'livr';

export function validate(data, rules) {
    const validator = new Validator(rules);
    const validData = validator.validate(data);

    return validData ?
        {
            isValid : true,
            validData,
            errors  : {}
        } :
        {
            isValid   : false,
            validData : {},
            errors    : validator.getErrors()
        };
}

export function capitalizeFirstLetter(str) {
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}

export function createSha256Hash(data) {
    return createHash('sha256').update(data).digest('hex');
}
