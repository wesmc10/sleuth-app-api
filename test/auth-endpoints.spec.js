const app = require('../src/app');
const knex = require('knex');
const testHelpers = require('./test-helpers');
const jwt = require('jsonwebtoken');

describe('Auth endpoints', () => {
    let db;

    const testUsers = testHelpers.makeTestUsers();
    const testUser = testUsers[0];
    const testJobs = testHelpers.makeTestJobs();

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

    describe('POST /api/auth/login', () => {
        context('happy path, user has no jobs', () => {
            beforeEach('insert users into db', () => {
                testHelpers.seedUsers(db, testUsers);
            });

            it('responds with 200, logs in, creates the jwt, and returns jwt and user', () => {
                const userValidation = {
                    user_name: testUser.user_name,
                    password: testUser.password
                };

                const subject = testUser.user_name;
                const payload = { user_id: testUser.id };
                const expectedJwt = jwt.sign(payload, process.env.JWT_SECRET, {
                    subject,
                    algorithm: 'HS256'
                });

                return supertest(app)
                    .post('/api/auth/login')
                    .send(userValidation)
                    .expect(200)
                    .expect(res => {
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('authToken');
                        expect(res.body.authToken).to.be.a('string');
                        expect(res.body.authToken).to.eql(expectedJwt);
                        expect(res.body).to.have.property('dbUser');
                        expect(res.body.dbUser).to.have.property('id');
                        expect(res.body).to.not.have.property('dbUserJobs');
                    })
            });
        });

        context('happy path, user has jobs', () => {
            beforeEach('insert users into db', () => {
                testHelpers.seedUsers(db, testUsers);
            });

            beforeEach('insert jobs into db', () => {
                return db
                    .insert(testJobs)
                    .into('sleuth_jobs');
            });

            it('responds with 200, logs in, creates the jwt, and returns jwt, user, and user jobs', () => {
                const userValidation = {
                    user_name: testUser.user_name,
                    password: testUser.password
                };

                const subject = testUser.user_name;
                const payload = { user_id: testUser.id };
                const expectedJwt = jwt.sign(payload, process.env.JWT_SECRET, {
                    subject,
                    algorithm: 'HS256'
                });

                return supertest(app)
                    .post('/api/auth/login')
                    .send(userValidation)
                    .expect(200)
                    .expect(res => {
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('authToken');
                        expect(res.body.authToken).to.be.a('string');
                        expect(res.body.authToken).to.eql(expectedJwt);
                        expect(res.body).to.have.property('dbUser');
                        expect(res.body.dbUser).to.have.property('id');
                        expect(res.body).to.have.property('dbUserJobs');
                        expect(res.body.dbUserJobs).to.be.an('array');
                    })
            });
        });
    });
});