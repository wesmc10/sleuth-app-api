const express = require('express');
const path = require('path');
const bodyParser = express.json();
const JobsService = require('./jobs-service');

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
                    .json({
                        job: JobsService.sanitizeJob(job)
                    });
            })
            .catch(next);
    })

module.exports = jobsRouter;