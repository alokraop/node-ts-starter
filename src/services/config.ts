import { Service } from "typedi";

@Service()
export class ConfigService {
    port: number;
    logLevel: string;
    requestTimeout: number;

    dbName: string;
    dbUrl: string;

    signingKey: string;

    constructor() {
        this.port = parseInt(process.env.PORT || '7777', 10);
        this.logLevel = process.env.LOG_LEVEL || 'info';
        this.requestTimeout = parseInt(process.env.REQUEST_TIMEOUT || '20000', 10);
        this.dbUrl = process.env.DB_URL ?? 'mongodb://localhost:27017';
        this.dbName = process.env.DB_NAME ?? 'starter';
        this.signingKey = process.env.SIGNING_KEY ?? 'qwertyuiopasdfghjklzxcvbnm123456';
    }
}