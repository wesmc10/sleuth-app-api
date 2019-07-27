const app = require('../src/app');
const knex = require('knex');
const bcrypt = require('bcryptjs');
const testHelpers = require('./test-helpers');

describe('Users endpoints', () => {
    let db;

    const testUsers = testHelpers.makeTestUsers();

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
        context('happy path', () => {
            it('responds with 201, stores and sanitizes user, hashes password, and creates authToken', () => {
                const newUser = {
                    first_name: 'first-name',
                    last_name: 'last-name',
                    user_name: 'user-name',
                    password: '$#21REwq'
                };

                return supertest(app)
                    .post('/api/users')
                    .send(newUser)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.be.an('object').that.has.property('authToken');
                        expect(res.body).to.be.an('object').that.has.property('user');
                        expect(res.body.user).to.have.property('id');
                        expect(res.body.user).to.be.an('object');
                        expect(res.body.authToken).to.be.a('string');
                        expect(res.body.user.id).to.be.a('number');
                        expect(res.body.user.first_name).to.eql(newUser.first_name);
                        expect(res.body.user.last_name).to.eql(newUser.last_name);
                        expect(res.body.user.user_name).to.eql(newUser.user_name);
                        expect(res.body.user).to.not.have.property('password');
                        expect(res.headers.location).to.eql(`/api/users/${res.body.user.id}`);
                    })
                    .expect(res => 
                        db
                            .from('sleuth_users')
                            .where({ id: res.body.user.id })
                            .select('*')
                            .first()
                            .then(user => {
                                expect(user.first_name).to.eql(newUser.first_name);
                                expect(user.last_name).to.eql(newUser.last_name);
                                expect(user.user_name).to.eql(newUser.user_name);
                                expect(user).to.be.an('object').that.has.property('id');

                                return bcrypt.compare(newUser.password, user.password);
                            })
                            .then(passwordsMatch => {
                                expect(passwordsMatch).to.be.true;
                            })
                    )
            });
        });
    });
});