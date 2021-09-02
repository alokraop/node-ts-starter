import 'reflect-metadata';
import Container from 'typedi';
import { createServer } from '../src/server';
import { ConfigService } from '../src/services/config';
import { Express } from 'express';
import { closeDb } from '../src/data/base';

export function getApp(): Express {
    const config = Container.get(ConfigService);

    return createServer(config);
}

export function shutdown() {
    return closeDb();
}