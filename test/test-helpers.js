const jwt = require('jsonwebtoken');

function makeTestUsers() {
    return [
        {
            id: 1,
            first_name: 'user-one-first-name',
            last_name: 'user-one-last-name',
            user_name: 'user-one-user-name',
            password: '!2#4QwEr'
        },

        {
            id: 2,
            first_name: 'user-two-first-name',
            last_name: 'user-two-last-name',
            user_name: 'user-two-user-name',
            password: '$3@1ReWq'
        },

        {
            id: 3,
            first_name: 'user-three-first-name',
            last_name: 'user-three-last-name',
            user_name: 'user-three-user-name',
            password: '1@3$qWeR'
        },

        {
            id: 4,
            first_name: 'user-four-first-name',
            last_name: 'user-four-last-name',
            user_name: 'user-four-user-name',
            password: '4#2!rEwQ'
        }
    ];
}

function makeTestJobs() {
    return [
        {
            id: 1,
            company: 'job-one-company',
            position: 'job-one-position',
            job_location: 'job-one-location',
            salary: '$50,000',
            date_applied: '2019-07-26',
            interview_date: '2019-08-01',
            application_status: 'Phone',
            notes: 'job-one-notes',
            user_id: 4
        },

        {
            id: 2,
            company: 'job-two-company',
            position: 'job-two-position',
            job_location: 'job-two-location',
            salary: '$60,000',
            date_applied: '2019-07-11',
            interview_date: '2019-08-03',
            application_status: 'On-site',
            notes: 'job-two-notes',
            user_id: 3
        },

        {
            id: 3,
            company: 'job-three-company',
            position: 'job-three-position',
            job_location: 'job-three-location',
            salary: '$70,000',
            date_applied: '2019-07-03',
            interview_date: '2019-08-10',
            application_status: 'Technical',
            notes: 'job-three-notes',
            user_id: 2
        },

        {
            id: 4,
            company: 'job-four-company',
            position: 'job-four-position',
            job_location: 'job-four-location',
            salary: '$80,000',
            date_applied: '2019-07-20',
            interview_date: '2019-08-14',
            application_status: 'On-site',
            notes: 'job-four-notes',
            user_id: 1
        }
    ];
}

function cleanTables(db) {
    return db
        .transaction(trx =>
            trx.raw(
                `TRUNCATE
                    sleuth_jobs,
                    sleuth_users
                `    
            )
            .then(() =>
                Promise.all([
                    trx.raw(`ALTER SEQUENCE sleuth_jobs_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`ALTER SEQUENCE sleuth_users_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`SELECT setval('sleuth_jobs_id_seq', 0)`),
                    trx.raw(`SELECT setval('sleuth_users_id_seq', 0)`)
                ])
            )
        )
}

function makeAuthorizationHeader(user, secret=process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
        subject: user.user_name,
        algorithm: 'HS256'
    });
    return `Bearer ${token}`;
}

module.exports = {
    makeTestUsers,
    makeTestJobs,
    cleanTables,
    makeAuthorizationHeader
};