import { URLSearchParams } from 'url';
import fetch               from 'isomorphic-fetch';

export default class ApiFetch {
    constructor({ protocol, host, port }) {
        this.baseUrl = `${protocol}://${host}:${port}`;
    }

    get(endpoint, options = {}, apiPrefix = '/api/v1/mobile') {
        const params = new URLSearchParams(options.params);
        const url = `${this.baseUrl}${apiPrefix}/${endpoint}${params.toString() ? `?${params}` : ''}`;

        return fetch(url, {
            ...options,
            method : 'GET'
        });
    }

    post(endpoint, body, options = {}, apiPrefix = '/api/v1/mobile') {
        return fetch(`${this.baseUrl}${apiPrefix}/${endpoint}`, {
            method  : 'POST',
            headers : {
                ...options.headers,
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(body)
        });
    }
}
