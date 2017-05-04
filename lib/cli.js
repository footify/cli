const logger = require('winston');
const dataApi = require('@footify/data-api');
const httpHelper = require('@footify/http-helper');

function processCommand(program) {
    let command = null;

    if (program.createClient) {
        command = createClient(program.name);
    } else if (program.createPub) {
        command = createPub(program.name,
            program.streetNumber,
            program.streetName,
            program.zipCode,
            program.city,
            program.pictureUrl)
    } else if (program.createBaby) {
        command = createBabyfoot(program.pubId,
            program.name,
            program.pictureUrl,
            program.manufacturer);
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

function createPub(name, stNumber, stName, zipCode, city, pictureUrl) {
    return dataApi.pubRepository.create({
        name: name,
        street_number: stNumber,
        street_name: stName,
        zip_code: zipCode,
        city: city,
        picture_url: pictureUrl
    }).then((bar) => {
        if (!bar) {
            throw new Error('Could not create pub');
        }
        return httpHelper.algoliaHelper.addObjToIndex(['global', 'pub'], {
            name: bar.name,
            type: 'pub',
            id: bar._id.toString()
        }).then(() => {
            logger.info('Bar successfully created:');
            logger.info(JSON.stringify(bar, null, 2));
            return bar;
        });
    });
}

function createBabyfoot(pubId, name, pictureUrl, manufacturer) {
    return dataApi.babyfootRepository.create({
        pub: pubId,
        name: name,
        pictureUrl: pictureUrl,
        manufacturer: manufacturer
    }).then((baby) => {
        if (!baby) {
            throw new Error('Could not create babyfoot')
        }
        logger.info('Babyfoot successfuly created:');
        logger.info(JSON.stringify(baby, null, 2));
        return baby;
    });
}

module.exports.processCommand = processCommand;
