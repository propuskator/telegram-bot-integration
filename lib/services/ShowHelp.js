import ServiceBase from './ServiceBase.js';

export default class ShowHelp extends ServiceBase {
    static validationRules = {
        commands : [ 'required', { 'list_of_objects' : [ {
            command     : [ 'required', 'string' ],
            description : [ 'required', 'string' ]
        } ] } ]
    };

    execute({ commands }) {
        const helpText = commands.reduce((acc, { command, description }) => {
            return acc + `/${command} - ${description}\n`; // eslint-disable-line prefer-template
        }, '');

        return helpText;
    }
}
