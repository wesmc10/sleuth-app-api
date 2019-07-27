function jwtAuthorization(req, res, next) {
    const authToken = req.get('Authorization') || '';
}

module.exports = jwtAuthorization;