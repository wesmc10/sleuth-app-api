const jwt = require('jsonwebtoken');
const config = require('../config');

const JwtAuthService = {
    createJwt(subject, payload) {
        return jwt.sign(payload, config.JWT_SECRET, {
            subject,
            algorithm: 'HS256'
        });
    },

    verifyJwt(token) {
        return jwt.verify(token, config.JWT_SECRET, {
            algorithms: ['HS256']
        });
    },

    getUserWithUserName(db, user_name) {
        return db
            .from('sleuth_users')
            .where({ user_name })
            .first();
    }
};

module.exports = JwtAuthService;