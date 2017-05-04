const cli = require('./lib/cli');
const logger = require('winston');
const program = require('commander');
const database = require('./database');


const env = process.env['NODE_ENV'] || 'development';

require('dotenv').config({path: `.env.${env}` });

program
    .version('1.0.0')
    .option('--create-client', 'Create a new client')
    .option('--create-pub', 'Create a new bar')
    .option('--create-baby', 'Create a new babyfoot')
    .option('--name <name>', 'Give name value')
    .option('--googleId <googleId>', 'Google id')
    .option('--streetNumber <streetNumber>', 'Street number')
    .option('--streetName <streetName>', 'Street name')
    .option('--zipCode <zipCode>', 'zip code')
    .option('--city <city>', 'city')
    .option('--pictureUrl <pictureUrl>', 'pictureUrl')
    .option('--manufacturer <manufacturer>', 'manufacturer')
    .option('--pubId <pubId>', 'pubId')

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
        logger.error(e);
        process.exit(1);
    });