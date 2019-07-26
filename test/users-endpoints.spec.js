const app = require('../src/app');
const knex = require('knex');
const bcrypt = require('bcryptjs');
const testHelpers = require('./test-helpers');

describe('Users endpoints', () => {
    let db;

    const testUsers = testHelpers.makeTestUsers();
    const testUser = testUsers[0];

    before('create db instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        });

        app.set('db', db);
    });

    after('disconnect from db', () => db.destroy());

    before('clean tables', () => testHelpers.cleanTables(db));

    afterEach('clean tables', () => testHelpers.cleanTables(db));

    describe('POST /api/users', () => {
        
    });
});