const jwt = require('express-jwt');
const jwt_secret = process.env.JWT_SECRET;

const mongoose = require('mongoose');
const User = require('../models/userModel');
const RefreshToken = require('../models/refreshTokenModel');

module.exports = auth;

function auth(roles = []) {
    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        jwt.expressjwt({ secret: jwt_secret, algorithms: ['HS256'] }),
        async (req, res, next) => {
            // console.log('auth : ', req.auth);
            const account = await User.findById(req.auth.id);
            const refreshTokens = await RefreshToken.find({ user: account.id });

            if (!account || (roles.length && !roles.includes(account.role))) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            req.auth.role = account.role;
            req.auth.ownsToken = token => !!refreshTokens.find(x => x.token === token);
            next();
        }
    ];
}