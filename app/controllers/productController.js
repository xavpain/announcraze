const productsService = require('../services/products');


function createProduct(req, res, next) {
    productsService.createProduct(req.auth.id, req.body, req.files)
        .then(product => res.json(product))
        .catch(err => next(err));
}

function deleteProduct(req, res, next) {
    productsService.deleteProduct(req.auth.id, req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getProductById(req, res, next) {
    productsService.getProductById(req.auth.id, req.params.id)
        .then(product => res.json(product))
        .catch(err => next(err));
}
        
function removeProductPics(req, res, next) {
    productsService.removeProductPics(req.auth.id, req.params.id, req.body.pictureNames)
        .then(product => res.json(product))
        .catch(err => next(err));
}

function addProductPics(req, res, next) {
    productsService.addProductPics(req.auth.id, req.params.id, req.files)
        .then(product => res.json(product))
        .catch(err => next(err));
}

function updateProduct(req, res, next) {
    productsService.updateProduct(req.auth.id, req.params.id, req.body)
        .then(product => res.json(product))
        .catch(err => next(err));
}

function getAllProductsFromTarget(req, res, next) {
    productsService.getAllUserProducts(req.auth.id, req.params.id)
        .then(products => res.json(products))
        .catch(err => next(err));
}

function getAllProductsFromUser(req, res, next) {
    productsService.getAllUserProducts(req.auth.id, req.auth.id)
        .then(products => res.json(products))
        .catch(err => next(err));
}

function verifyProduct(req, res, next) {
    productsService.verifyProduct(req.auth.id, req.params.id)
        .then(product => res.json(product))
        .catch(err => next(err));
}

function browseProducts(req, res, next) {
    productsService.browseProducts(req.auth.id, req.body)
        .then(products => res.json(products))
        .catch(err => next(err));
}

module.exports = productController = {
    createProduct,
    updateProduct,
    removeProductPics,
    addProductPics,
    verifyProduct,
    getAllProductsFromTarget,
    getAllProductsFromUser,
    getProductById,
    browseProducts,
    deleteProduct
}