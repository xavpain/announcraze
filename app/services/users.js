const User = require('../models/userModel');
const RefreshToken = require('../models/refreshTokenModel');
const crypto = require("crypto");
const Roles = require('../middleware/enums').Roles;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { sendVerificationEmail, sendAlreadyRegisteredEmail, sendPasswordResetEmail } = require('./email');

async function register(params, origin) {
    if (await User.findOne({ email: params.email })) {
        return await sendAlreadyRegisteredEmail(params.email, origin);
    }
    if (await User.findOne({ username: params.username })) {
        throw 'Username "' + params.username + '" is already registered';
    }
    const account = new User(params);

    // first registered account is an admin
    const isFirstAccount = (await User.countDocuments({})) === 0;
    account.role = isFirstAccount ? Roles.Admin : Roles.User;
    account.verificationToken = crypto.randomBytes(40).toString('hex');
    account.hashedPassword = bcrypt.hashSync(params.password, 10);
    await account.save();

    // send email
    await sendVerificationEmail(account, origin);
}

function basicDetails(account) {
    const { id, username, fullName, email, role, created, updated, isVerified } = account;
    return { id, username, fullName, email, role, created, updated, isVerified };
}

async function login({ email, password, ipAddress }) {
    const account = await User.findOne({ email: email });

    if (!account || !bcrypt.compareSync(password, account.hashedPassword)) {
        throw 'Username or password is incorrect';
    }
    if (!account.isVerified) {
        throw 'Account not verified. Please check your email for verification instructions';
    }
    const jwtToken = jwt.sign({ sub: account.id, id: account.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = new RefreshToken({
        user: account.id,
        token: crypto.randomBytes(40).toString('hex'),
        expires: new Date(Date.now() + 7*24*60*60*1000),
        createdByIp: ipAddress
    });

    await refreshToken.save();

    return {
        ...basicDetails(account),
        jwtToken,
        refreshToken: refreshToken.token
    };
}

async function getRefreshToken(token) {
    const refreshToken = await RefreshToken.findOne({ token }).populate('user');
    if (!refreshToken || !refreshToken.isActive) throw 'Invalid token';
    return refreshToken;
}

async function refreshToken({ token, ipAddress }) {
    const refreshToken = await getRefreshToken(token);
    const account = refreshToken.user;
 
    const newRefreshToken = new RefreshToken({
        user: account.id,
        token: crypto.randomBytes(40).toString('hex'),
        expires: new Date(Date.now() + 7*24*60*60*1000),
        createdByIp: ipAddress
    });
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    refreshToken.replacedByToken = newRefreshToken.token;
    await refreshToken.save();
    await newRefreshToken.save();

    const jwtToken = jwt.sign({ sub: account.id, id: account.id }, config.secret, { expiresIn: '15m' });

    return {
        ...basicDetails(account),
        jwtToken,
        refreshToken: newRefreshToken.token
    };
}

async function revokeToken({ token, ipAddress }) {
    const refreshToken = await getRefreshToken(token);

    // revoke token and save
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    await refreshToken.save();
}

async function create(params) {
    // validate
    if (await User.findOne({ email: params.email })) {
        throw 'Email "' + params.email + '" is already registered';
    }

    const account = new User(params);
    account.verified = Date.now();

    // hash password
    account.passwordHash = bcrypt.hashSync(params.password, 10);

    // save account
    await account.save();

    return basicDetails(account);
}

async function forgotPassword({ email }, origin) {
    const account = await User.findOne({ email });

    if (!account) throw 'No account with this email address';
    
    account.resetToken = {
        token: crypto.randomBytes(40).toString('hex'),
        expires: new Date(Date.now() + 24*60*60*1000) //24H until expiration
    };
    await account.save();

    await sendPasswordResetEmail(account, origin);
}

async function resetPassword({ token, password }) {
    const account = await User.findOne({
        'resetToken.token': token,
        'resetToken.expires': { $gt: Date.now() }
    });

    if (!account) throw 'Invalid token';

    account.hashedPassword = bcrypt.hashSync(password, 10);
    account.passwordReset = Date.now();
    account.resetToken = undefined;

    await account.save();
}

async function changePassword(id, { password }) {
    const account = await User.findById(id);

    if (!account) throw 'Account not found';
    account.hashedPassword = bcrypt.hashSync(password, 10);
    account.passwordReset = Date.now();
    account.resetToken = undefined;

    await account.save();
}

async function verifyEmail({ token }) {
    const account = await User.findOne({ verificationToken: token });

    if (!account) throw 'Verification failed';

    account.verified = Date.now();
    account.verificationToken = undefined;
    await account.save();
}

module.exports = {register, create, verifyEmail, forgotPassword, resetPassword, login, refreshToken, revokeToken, changePassword};