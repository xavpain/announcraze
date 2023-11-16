const Joi = require('joi');
const validateRequest = require('../middleware/validateRequest');

function createProductSchema(req, res, next) {
    schema = Joi.object({
        title: Joi.string().required().min(8).max(128),
        description: Joi.string().max(1024),
        postcode: Joi.string().required(),
        price: Joi.number().positive().required(),
        category: Joi.string().required(), // no need to check if it's in the enum, because it's already defaulted in the model
    });
    validateRequest(req, next, schema);
}

function updateProductSchema(req, res, next) {
    schema = Joi.object({
        title: Joi.string().min(8).max(128),
        description: Joi.string().max(1024),
        postcode: Joi.string(),
        price: Joi.number().positive(),
        status: Joi.string().valid('Active', 'Inactive'),
        category: Joi.string(), // no need to check if it's in the enum, because it's already defaulted in the model
    });
    validateRequest(req, next, schema);
}

function createPropositionSchema(req, res, next) {
    propositionSchema = Joi.object({
        price: Joi.number().positive(),
        text: Joi.string().max(1024),
    });
    validateRequest(req, next, propositionSchema);

}

function browseProductsSchema(req, res, next) {
    schema = Joi.object({
        text: Joi.string().min(8).max(128),
        postcode: Joi.string(),
        maxPrice: Joi.number().positive(),
        maxDistance: Joi.number().positive(),
        category: Joi.string(), // no need to check if it's in the enum, because it's already defaulted in the model
    });
    validateRequest(req, next, schema);
}

function removeProductPics(req, res, next) {
    schema = Joi.object({
        pictureNames: Joi.array().items(Joi.string().required())
    });
    validateRequest(req, next, schema);
}

module.exports = ValidationSchemas = {
    createProductSchema,
    updateProductSchema,
    browseProductsSchema,
    removeProductPics,
    createPropositionSchema
};