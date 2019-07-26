const express = require('express');
const bodyParser = express.json();
const path = require('path');
const UsersService = require('./users-service');
const AuthService = require('../auth/jwt-auth-service');

const usersRouter = express.Router();

usersRouter
    .route('/')
    .post(bodyParser, (req, res, next) => {
        const { first_name, last_name, user_name, password } = req.body;

        for (const field of ['first_name', 'last_name', 'user_name', 'password']) {
            if (!req.body[field]) {
                return res
                    .status(400)
                    .json({
                        error: `The ${field} field is required`
                    });
            }
        }

        const passwordError = UsersService.validatePassword(password);
        if (passwordError) {
            return res
                .status(400)
                .json({
                    error: passwordError
                });
        }

        UsersService.userNameAlreadyExists(req.app.get('db'), user_name)
            .then(userNameAlreadyExists => {
                if (userNameAlreadyExists) {
                    return res
                        .status(400)
                        .json({
                            error: 'User name already exists'
                        });
                }

                return UsersService.hashpassword(password)
                    .then(hashedPassword => {
                        const newUser = {
                            first_name,
                            last_name,
                            user_name,
                            password: hashedPassword
                        };

                        return UsersService.insertNewUserIntoDatabase(req.app.get('db'), newUser)
                            .then(user => {
                                const sub = user.user_name;
                                const payload = { user_id: user.id };
                                res
                                    .status(201)
                                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                    .json({
                                        authToken: AuthService.createJwt(sub, payload),
                                        user: UsersService.sanitizeUser(user)
                                    });

                            })
                    })
            })
            .catch(next);
    })

module.exports = usersRouter;