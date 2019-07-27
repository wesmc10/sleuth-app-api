const JwtAuthService = require('../auth/jwt-auth-service');

function jwtAuthorization(req, res, next) {
    const authToken = req.get('Authorization') || '';

    let bearerToken;
    if (!authToken.toLowerCase().startsWith('bearer ')) {
        return res
            .status(401)
            .json({
                error: 'Missing bearer token'
            });
    } else {
        bearerToken = authToken.slice(7);
    }

    try {
        const payload = JwtAuthService.verifyJwt(bearerToken);

        JwtAuthService.getUserWithUserName(req.app.get('db'), payload.sub)
            .then(user => {
                if (!user) {
                    return res
                        .status(401)
                        .json({
                            error: 'Unauthorized request'
                        });
                }
                req.user = user;
                next();
            })
            .catch(error => {
                console.error(error);
                next(error);
            })
    } catch(error) {
        res
            .status(401)
            .json({
                error: 'Unauthorized request'
            });
    }
}

module.exports = jwtAuthorization;