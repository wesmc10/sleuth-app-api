function makeTestUsers() {
    return [
        {
            id: 1,
            first_name: 'user-one-first--name',
            last_name: 'user-one-last-name',
            user_name: 'user-one-user-name',
            password: '!2#4QwEr'
        },

        {
            id: 2,
            first_name: 'user-two-first--name',
            last_name: 'user-two-last-name',
            user_name: 'user-two-user-name',
            password: '$3@1ReWq'
        },

        {
            id: 3,
            first_name: 'user-three-first--name',
            last_name: 'user-three-last-name',
            user_name: 'user-three-user-name',
            password: '1@3$qWeR'
        },

        {
            id: 4,
            first_name: 'user-four-first--name',
            last_name: 'user-four-last-name',
            user_name: 'user-four-user-name',
            password: '4#2!rEwQ'
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

module.exports = {
    makeTestUsers,
    cleanTables
};