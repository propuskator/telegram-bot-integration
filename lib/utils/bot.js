// disable eslint for the next line because of 12.x Node.js in base CI image
import { readFile } from 'fs/promises'; // eslint-disable-line import/no-unresolved

export async function readAndParseCommands(commandsFilePath) {
    const commandsFileString = await readFile(commandsFilePath, { encoding: 'utf-8' });
    const commandsObj = JSON.parse(commandsFileString);
    const parsedCommands = Object
        .entries(commandsObj)
        .map(([ command, description ]) => ({ command, description }));

    return parsedCommands;
}
