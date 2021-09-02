import 'reflect-metadata';

import Container from 'typedi';
import { createServer } from './server';
import { ConfigService } from './services/config';
import { Server } from 'net';
import { logger } from './util/logger';

let webServer: Server;

function startServer() {
    const config = Container.get(ConfigService);
    const server = createServer(config);
    webServer = server.listen(config.port, () => logger.info(`Running on port ${config.port}`));
}

const onTerminate = () => {
    webServer.close((err) => {
        if (err) logger.error(err.message);
        process.exit(0);
    });
};

startServer();

process.on('SIGTERM', onTerminate);
process.on('SIGINT', onTerminate);
