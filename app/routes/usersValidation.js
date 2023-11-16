const Joi = require('joi');
const validateRequest = require('../middleware/validateRequest');

function registerSchema(req, res, next) {
  schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(18).required(),
    password: Joi.string()
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
      .min(8).max(32).required().messages({'string.pattern.base': 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number' }),
    repeatPassword: Joi.any().equal(Joi.ref('password'))
      .required()
      .label('repeatPassword')
      .messages({ 'any.only': '{{#label}} does not match' }),
    email: Joi.string().email().required(),
    fullName: Joi.string().required()
  });
  validateRequest(req, next, schema);
}

function verifyEmailSchema(req, res, next) {
  const schema = Joi.object({
      token: Joi.string().required()
  });
  if (req.query.token) {
    req.body.token = req.query.token;
  }
  validateRequest(req, next, schema);
}

function resetPasswordSchema(req, res, next) {
  const schema = Joi.object({
      token: Joi.string().required(),
      password: Joi.string()
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
      .min(8).max(32).required().messages({'string.pattern.base': 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number' }),
    repeatPassword: Joi.any().equal(Joi.ref('password'))
      .required()
      .label('repeatPassword')
      .messages({ 'any.only': '{{#label}} does not match' }),
  });
  validateRequest(req, next, schema);
}

function changePasswordSchema(req, res, next) {
  const schema = Joi.object({
      password: Joi.string()
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
      .min(8).max(32).required().messages({'string.pattern.base': 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number' }),
    repeatPassword: Joi.any().equal(Joi.ref('password'))
      .required()
      .label('repeatPassword')
      .messages({ 'any.only': '{{#label}} does not match' }),
  });
  validateRequest(req, next, schema);
}

function forgotPasswordSchema(req, res, next) {
  const schema = Joi.object({
      email: Joi.string().email().required()
  });
  validateRequest(req, next, schema);
}

function loginSchema(req, res, next) {
  const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8).max(32)
  });
  validateRequest(req, next, schema);
}

module.exports = ValidationSchemas = {
  registerSchema,
  verifyEmailSchema,
  resetPasswordSchema,
  loginSchema,
  forgotPasswordSchema,
  changePasswordSchema
};