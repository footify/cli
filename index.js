const cli = require('./lib/cli');
const logger = require('winston');
const program = require('commander');
const database = require('./database');


const env = process.env['NODE_ENV'] || 'development';

require('dotenv').config({path: `.env.${env}` });

program
    .version('1.0.0')
    .option('--create-client <name>', 'Create a new client')
    .parse(process.argv);

database.connectToDb()
    .then(() => {
        return cli.processCommand(program);
    })
    .then(() => {
        console.log('Done');
        process.exit(0);
    })
    .catch((e) => {
        logger.error(e.message);
        process.exit(1);
    });