const bcrypt = require('bcryptjs');

const UsersService = {
    validatePassword(password) {
        if (password.length < 8 || password.length > 72) {
            return 'Password must be between 8 and 72 characters long';
        }

        if (password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password must not begin or end with empty spaces';
        }

        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/.test(password)) {
            return 'Password must have at least one lowercase and uppercase letter, number, and special character';
        }
    },

    userNameAlreadyExists(db, user_name) {
        return db
            .from('sleuth_users')
            .where({ user_name })
            .first()
            .then(user => !!user);
    },

    hashpassword(password) {
        return bcrypt.hash(password, 12);
    }
};

module.exports = UsersService;