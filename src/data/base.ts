import { classToPlain } from 'class-transformer';
import { Db, FilterQuery, FindOneOptions, MongoClient } from 'mongodb';
import Container from 'typedi';
import { ConfigService } from '../services/config';

let database: Promise<Db>;
let connection: MongoClient;
async function db(): Promise<Db> {
    if (!database) {
        const config = Container.get(ConfigService);
        database = MongoClient.connect(config.dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then((c) => {
            connection = c;
            return c.db(config.dbName);
        });
    }

    return database;
}

export async function closeDb() {
    connection?.close();
}


export class BaseDao<T extends object> {
    constructor(private collection: string) { }

    async fetch(_id: string, projection: any = {}): Promise<T | null> {
        const client = await this.init();
        return client.findOne({ _id }, { projection });
    }

    async findFirst(query: FilterQuery<any>, projection: any = {}, sort: any = {}): Promise<T | null> {
        const client = await this.init();
        return client.findOne(query, { projection, sort });
    }

    async save(document: T): Promise<any> {
        const client = await this.init();
        const plain = classToPlain(document);
        return client.insertOne(plain);
    }

    async update(query: FilterQuery<any>, update: any): Promise<any> {
        const client = await this.init();
        return client.updateOne(query, { $set: update });
    }
 
    async deleteAll(query: FilterQuery<any>): Promise<any> {
        const client = await this.init();
        return client.deleteMany(query);
    }

    async init() {
        return db().then((d) => d.collection(this.collection));
    }
}