import Container from 'typedi';
import { createLogger, format, transports } from 'winston';
import { ConfigService } from '../services/config';

function initLogger() {
    const config = Container.get(ConfigService);
    return createLogger({
        level: config.logLevel,
        format: format.json(),
        transports: [new transports.Console()]
    });
}
export const logger = initLogger();
