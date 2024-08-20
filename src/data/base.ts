import { instanceToPlain } from 'class-transformer';
import { Db, Document, Filter, FindOptions, MongoClient, OptionalUnlessRequiredId } from 'mongodb';
import Container from 'typedi';
import { ConfigService } from '../services/config';

let database: Promise<Db>;
let connection: MongoClient;
async function db(): Promise<Db> {
    if (!database) {
        const config = Container.get(ConfigService);
        database = MongoClient.connect(config.dbUrl).then((c) => {
            connection = c;
            return c.db(config.dbName);
        });
    }

    return database;
}

export async function closeDb() {
    connection?.close();
}


export class BaseDao<T extends Document> {
    constructor(private collection: string) { }

    async fetch(_id: string | number, projection: any = {}) {
        const client = await this.init();
        const query = { _id } as Filter<T>;
        return client.findOne(query, { projection }) as Promise<T | null>;
    }

    async findFirst(query: Filter<T>, projection?: any, sort?: any) {
        const client = await this.init();
        return client.findOne(query, { projection, sort }) as Promise<T | null>;
    }

    async findAll(query: Filter<T> = {}, options: FindOptions<any> = {}) {
        const client = await this.init();
        let cursor = client.find(query, options);
        return cursor.toArray() as Promise<T[]>;
    }

    async save(document: T): Promise<any> {
        const client = await this.init();
        const plain = instanceToPlain(document) as OptionalUnlessRequiredId<T>;
        return client.insertOne(plain);
    }

    async upsert(query: Filter<T>, update: any): Promise<any> {
        const client = await this.init();
        return client.updateOne(query, { $set: update }, { upsert: true });
    }

    async update(query: Filter<T>, update: any): Promise<any> {
        const client = await this.init();
        return client.updateOne(query, { $set: update });
    }

    async updateAll(query: Filter<T>, update: any): Promise<any> {
        const client = await this.init();
        return client.updateMany(query, { $set: update });
    }

    async delete(_id: string | number): Promise<any> {
        const client = await this.init();
        const query = { _id } as Filter<T>;
        return client.deleteOne(query);
    }

    async deleteAll(query: Filter<T>): Promise<any> {
        const client = await this.init();
        return client.deleteMany(query);
    }

    async init() {
        return db().then((d) => d.collection<T>(this.collection));
    }
}