const app = require('../src/app');
const knex = require('knex');
const testHelpers = require('./test-helpers');
const dateFns = require('date-fns');

describe.only('Jobs endpoints', () => {
    let db;

    const testUsers = testHelpers.makeTestUsers();
    const testUser = testUsers[3];
    const testJobs = testHelpers.makeTestJobs();
    const testJob = testJobs[0];

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

    describe('POST /api/jobs', () => {
        context('happy path', () => {
            beforeEach('insert users into db', () => {
                return db
                    .insert(testUsers)
                    .into('sleuth_users');
            });

            it('responds with 201, and stores and sanitizes the job', () => {
                const newJob = {
                    company: 'job-company',
                    position: 'job-position',
                    job_location: 'job-location',
                    salary: '$55,000',
                    date_applied: '2019-07-21',
                    interview_date: '2019-08-02',
                    application_status: 'Phone',
                    notes: 'job-notes',
                    user_id: 4
                };

                return supertest(app)
                    .post('/api/jobs')
                    .send(newJob)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('id');
                        expect(res.body).to.be.an('object');
                        expect(res.body.company).to.eql(newJob.company);
                        expect(res.body.position).to.eql(newJob.position);
                        expect(res.body.job_location).to.eql(newJob.job_location);
                        expect(res.body.salary).to.eql(newJob.salary);
                        expect(res.body.date_applied).to.eql(newJob.date_applied);
                        expect(res.body.interview_date).to.eql(newJob.interview_date);
                        expect(res.body.application_status).to.eql(newJob.application_status);
                        expect(res.body.notes).to.eql(newJob.notes);
                        expect(res.body.user_id).to.eql(newJob.user_id);
                        expect(res.headers.location).to.eql(`/api/jobs/${res.body.id}`);
                    })
                    .expect(res =>
                        db
                            .from('sleuth_jobs')
                            .where({ id: res.body.id })
                            .select('*')
                            .first()
                            .then(job => {
                                expect(job).to.be.an('object').that.has.property('id');
                                expect(job.company).to.eql(newJob.company);
                                expect(job.position).to.eql(newJob.position);
                                expect(job.job_location).to.eql(newJob.job_location);
                                expect(job.salary).to.eql(newJob.salary);
                                expect(dateFns.format(job.date_applied, 'YYYY-MM-DD')).to.eql(newJob.date_applied);
                                expect(dateFns.format(job.interview_date, 'YYYY-MM-DD')).to.eql(newJob.interview_date);
                                expect(job.application_status).to.eql(newJob.application_status);
                                expect(job.notes).to.eql(newJob.notes);
                                expect(job.user_id).to.eql(newJob.user_id);
                            })
                    )
            });
        });
    });

    describe('GET /api/jobs/:job_id', () => {
        context('happy path', () => {
            beforeEach('insert users into db', () => {
                return db
                    .insert(testUsers)
                    .into('sleuth_users');
            });

            beforeEach('insert jobs into db', () => {
                return db
                    .insert(testJobs)
                    .into('sleuth_jobs');
            });

            it('responds with 200 and sanitizes and returns the specified job', () => {
                const jobId = 1;
                const selectedJob = testJob;

                return supertest(app)
                    .get(`/api/jobs/${jobId}`)
                    .set('Authorization', testHelpers.makeAuthorizationHeader(testUser))
                    .expect(200, selectedJob);
            });
        });
    });
});