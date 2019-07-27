const xss = require('xss');
const dateFns = require('date-fns');

const JobsService = {
    insertNewJobIntoDatabase(db, newJob) {
        return db
            .insert(newJob)
            .into('sleuth_jobs')
            .returning('*')
            .then(([ job ]) => job);
    },

    sanitizeJob(job) {
        return {
            id: job.id,
            company: xss(job.company),
            position: xss(job.position),
            job_location: xss(job.job_location),
            salary: xss(job.salary),
            date_applied: dateFns.format(job.date_applied, 'YYYY-MM-DD'),
            interview_date: dateFns.format(job.interview_date, 'YYYY-MM-DD'),
            application_status: job.application_status,
            notes: xss(job.notes),
            user_id: job.user_id
        };
    },

    getJobById(db, id) {
        return db
            .select('*')
            .from('sleuth_jobs')
            .where({ id })
            .first();
    }
};

module.exports = JobsService;