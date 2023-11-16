const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Roles = require('../middleware/enums').Roles;

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date,
    passwordReset: Date,
    role: {
        enum: Roles,
        type: String,
        default: 'User',
        required: true
    },
    resetToken: {
        token: String,
        expires: Date
    },
    passwordReset: Date,
    verificationToken: String,
    verified: Date,
});

UserSchema.virtual('isVerified').get(function () {
    return !!(this.verified || this.passwordReset);
});

UserSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hashedPassword;
    }
});

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.hashedPassword);
  };

const User = mongoose.model('User', UserSchema);

module.exports = User;
