const logger = require('winston');
const dataApi = require('@footify/data-api');

function processCommand(program) {
    let command = null;

    if (program.createClient) {
        command = createClient(program.createClient);
    }

    if (command) {
        return command
            .then(() => {
                logger.info('Done');
            });
    }
}

function createClient(name) {
    return dataApi.clientRepository.create(name)
        .then((client) => {
            if (!client) {
                throw new Error('Could not create client');
            }
            logger.info('Client successfully created:');
            logger.info(JSON.stringify(client, null, 2));
            return client;
        });
}

module.exports.processCommand = processCommand;