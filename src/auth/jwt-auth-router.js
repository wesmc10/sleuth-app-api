const express = require('express');
const bodyParser = express.json();
const authRouter = express.Router();
const JwtAuthService = require('./jwt-auth-service');
const UsersService = require('../users/users-service');
const JobsService = require('../jobs/jobs-service');

authRouter
    .route('/login')
    .post(bodyParser, (req, res, next) => {
        const { user_name, password } = req.body;
        const loginUser = { 
            user_name, 
            password 
        };

        for (const field of ['user_name', 'password']) {
            if (!req.body[field]) {
                return res
                    .status(400)
                    .json({
                        error: 'Missing user name or password'
                    });
            }
        }

        JwtAuthService.getUserWithUserName(req.app.get('db'), user_name)
            .then(dbUser => {
                if (!dbUser) {
                    return res
                        .status(400)
                        .json({
                            error: 'Incorrect user name or password'
                        });
                }

                return JwtAuthService.comparePasswords(loginUser.password, dbUser.password)
                    .then(passwordsMatch => {
                        if (!passwordsMatch) {
                            return res
                                .status(400)
                                .json({
                                    error: 'Incorrect user name or password'
                                });
                        }

                        return JwtAuthService.getUserJobs(req.app.get('db'), dbUser.id)
                            .then(jobs => {
                                const sub = dbUser.user_name;
                                const payload = { user_id: dbUser.id };
                                
                                if (jobs.length === 0) {
                                    res
                                        .status(200)
                                        .json({
                                            authToken: JwtAuthService.createJwt(sub, payload),
                                            dbUser: UsersService.sanitizeUser(dbUser)
                                        });
                                } else {
                                    const dbUserJobs = jobs.map(job => JobsService.sanitizeJob(job));
                                    res
                                        .status(200)
                                        .json({
                                            authToken: JwtAuthService.createJwt(sub, payload),
                                            dbUser: UsersService.sanitizeUser(dbUser),
                                            dbUserJobs
                                        });
                                }
                            })
                    })
            })
            .catch(next);
    })

module.exports = authRouter;