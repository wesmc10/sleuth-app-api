const express = require('express');
const path = require('path');
const bodyParser = express.json();
const JobsService = require('./jobs-service');
const jwtAuthorization = require('../middleware/jwt-auth');

const jobsRouter = express.Router();

jobsRouter
    .route('/')
    .post(bodyParser, (req, res, next) => {
        const { 
            company,
            position, 
            job_location, 
            salary, 
            date_applied, 
            interview_date, 
            application_status, 
            notes, 
            user_id } = req.body;

        for (const field of ['company', 'position', 'job_location', 'date_applied', 'application_status', 'user_id']) {
            if (!req.body[field]) {
                return res
                    .status(400)
                    .json({
                        error: `The '${field}' field is required`
                    });
            }
        }

        const newJob = {
            company,
            position,
            job_location,
            salary,
            date_applied,
            interview_date,
            application_status,
            notes,
            user_id
        };

        JobsService.insertNewJobIntoDatabase(req.app.get('db'), newJob)
            .then(job => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${job.id}`))
                    .json(JobsService.sanitizeJob(job));
            })
            .catch(next);
    })

jobsRouter
    .route('/:job_id')
    .all(jwtAuthorization)
    .all(checkIfJobExists)
    .get((req, res) => {
        res
            .status(200)
            .json(JobsService.sanitizeJob(res.job));
    })

    async function checkIfJobExists(req, res, next) {
        try {
            const job = await JobsService.getJobById(req.app.get('db'), req.params.job_id);

            if (!job) {
                return res
                    .status(404)
                    .json({
                        error: 'Job does not exist'
                    });
            }
            res.job = job;
            next();
        }
        catch(error) {
            next(error);
        }
    }

module.exports = jobsRouter;