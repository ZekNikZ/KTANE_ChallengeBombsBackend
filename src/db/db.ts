import { Connection, createConnection } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import entities from './models';

type ConnectionType = 'production' | 'local' | 'test';

const defaultConfig: PostgresConnectionOptions = {
    type: 'postgres',
    entities,
};

const config: { [key in ConnectionType]: PostgresConnectionOptions } = {
    production: {
        ...defaultConfig,
        url: process.env.DATABASE_URL,
        logging: true,
        synchronize: false,
        ssl: true,
        extra: {
            ssl: {
                rejectUnauthorized: false,
            },
        },
    },
    local: {
        ...defaultConfig,
        url: process.env.DATABASE_URL,
        logging: true,
        synchronize: true,
    },
    test: {
        ...defaultConfig,
        url: process.env.TEST_DATABASE_URL,
        logging: false,
        synchronize: true,
        dropSchema: true,
    },
};

let conn: Connection;

export async function setup(type: ConnectionType): Promise<void> {
    conn = await createConnection(config[type]);
    console.log('PG connected.');
}

export async function shutdown(): Promise<void> {
    await conn.close();
    console.log('PG closed.');
}

export function db(): Connection {
    return conn;
}

export default db;
