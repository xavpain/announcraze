const Product = require('../models/productModel');
const User = require('../models/userModel');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const baseUrl = process.env.APP_BASEURL;
const axios = require('axios');
const mongoose = require('mongoose');

async function getCoordinates(postcode) {
    try {
        const response = await axios.get(`https://api.zippopotam.us/fr/${postcode}`);
        const data = response.data;
        const latitude = data['places'][0]['latitude'];
        const longitude = data['places'][0]['longitude'];
        return { "latitude": latitude, "longitude": longitude };
    } catch (error) {
        return null;
    }
}

async function createProduct(userId, params, files) {
    const product = new Product(params);
    product.creator = userId;
    product.pictures = [];
    
    const coordinates = await getCoordinates(params.postcode);
    if (!coordinates) throw 'Invalid postcode';
    product.coordinates = [coordinates.longitude, coordinates.latitude];

    if (files) {
        for (const file of files) {
            const fileName = product._id.toString() + '-' + crypto.randomBytes(8).toString('hex') + path.extname(file.originalname);
            const filePath = path.join(__dirname, '../../files/', fileName);
            await fs.promises.writeFile(filePath, file.buffer);
            product.pictures.push({fileName: fileName, pictureUrl: baseUrl + '/files/' + fileName})
        }
    }
    return await product.save();
}

async function browseProducts(userId, params) {

    if (!mongoose.Types.ObjectId.isValid(userId)) throw 'Invalid id';

    const userAccount = await User.findById(userId);
    if (!userAccount) throw 'User not found';
    const query = {};

    if (userAccount.role !== 'Admin')
    query.isVerified = true;
    if (params.maxPrice) {
        query.price = { $lte: params.maxPrice };
    }
    if (params.text) {
        query.$or = [
            { title: { $regex: new RegExp(params.text, 'i') } },
            { description: { $regex: new RegExp(params.text, 'i') } }
        ];
    }
    if (params.category && params.category in ProductCategories) {
        query.category = params.category;
    }

    if (params.postcode) {
        const coordinates = await getCoordinates(params.postcode);
        if (coordinates) {
            query.coordinates = {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [coordinates.longitude, coordinates.latitude]
                    },
                    $maxDistance: params.maxDistance * 1000000 || 100000000 // default to 100km if no distance provided
                }
            };
        }
    }
    return await Product.find(query);
}

async function getAllUserProducts(userId, targetId) {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(targetId)) throw 'Invalid id';

    const userAccount = await User.findById(userId);
    if (!userAccount) throw 'User not found';

    const targetAccount = await User.findById(targetId);
    if (!targetAccount) throw 'Target user not found';

    if (userAccount.role === 'Admin' || userAccount._id === targetAccount._id)
        return await Product.find({creator: targetId});
    return await Product.find({creator: targetId, isVerified: true});
}

async function getAllProducts(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) throw 'Invalid id';

    const userAccount = await User.findById(userId);

    if (!userAccount) throw 'User not found';
    
    if (userAccount.role === 'Admin')
        return await Product.find();
    return await Product.find({isVerified: true});
    
}

async function getProductById(userId, productId) {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) throw 'Invalid id';
    
    const user = await User.findById(userId);
    if (!user) throw 'User not found';
    
    const product = await Product.findById(productId);
    if (!product) throw 'Product not found';

    if (user.role === 'Admin' || product.status !== 'Active') 
        return await Product.findById(productId);
    throw 'Product is not verified';
}

async function removeProductPics(userId, productId, picsIds) {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) throw 'Invalid id';

    const user = await User.findById(userId);
    if (!user) throw 'User not found';
    
    const product = await Product.findById(productId);
    if (!product) throw 'Product not found';

    if (product.creator.toString() !== userId || user.role !== 'Admin') throw 'User is not product creator nor Admin';

    for (const picId of picsIds) {
        const pic = product.pictures.find(pic => pic.fileName === picId);
        if (!pic) throw 'Picture not found';
        const filePath = path.join(__dirname, '../../files/', picId);
        try {
            await fs.promises.access(filePath, fs.constants.F_OK);
            await fs.promises.unlink(filePath);
        } catch (err) {
            throw 'Error deleting file ' + picId;
        }
    }
    product.pictures = product.pictures.filter(pic => !picsIds.includes(pic.fileName));
    return await product.save();
}

async function addProductPics(userId, productId, files) {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) throw 'Invalid id';

    const user = await User.findById(userId);
    if (!user) throw 'User not found';
    
    const product = await Product.findById(productId);
    if (!product) throw 'Product not found';

    if (product.creator.toString() !== userId) throw 'User is not product creator';
    product.pictures = product.pictures || [];

    if (files) {
        for (const file of files) {
            const fileName = product._id.toString() + '-' + crypto.randomBytes(8).toString('hex') + path.extname(file.originalname);
            const filePath = path.join(__dirname, '../../files/', fileName);
            await fs.promises.writeFile(filePath, file.buffer);
            product.pictures.push({fileName: fileName, pictureUrl: baseUrl + '/files/' + fileName})
        }
    }
    return await product.save();
}

async function updateProduct(userId, productId, params) {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) throw 'Invalid id';

    const user = await User.findById(userId);
    if (!user) throw 'User not found';
    
    const product = await Product.findById(productId);
    if (!product) throw 'Product not found';

    if (product.creator.toString() !== userId) throw 'User is not product creator';
    
    Object.assign(product, params);
    return await product.save();
}

async function deleteProduct(userId, productId) {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) throw 'Invalid id';

    const curUser = await User.findById(userId);
    if (!curUser) throw 'User not found';
    
    const product = await Product.findById(productId);
    if (!product) throw 'Product not found';

    if (curUser.role !== 'Admin' && product.creator.toString() !== userId) throw 'User is not product creator nor Admin';
    
    for (const pic of product.pictures) {
        if (!pic) throw 'Picture not found';
        const filePath = path.join(__dirname, '../../files/', pic.fileName);
        try {
            await fs.promises.access(filePath, fs.constants.F_OK);
            await fs.promises.unlink(filePath);
        } catch (err) {
            throw 'Error deleting file ' + pic.fileName;
        }
    }
    await Product.deleteOne({_id: productId});
    return {};
}

async function verifyProduct(userId, productId) {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) throw 'Invalid id';

    const user = await User.findById(userId);

    if (!user) throw 'User not found';
    if (user.role !== 'Admin') throw 'User is not admin';
    const product = await Product.findById(productId);
    if (!product) throw 'Product not found';
    product.verified = Date.now();
    return await product.save();
}

module.exports = {
    createProduct,
    browseProducts,
    getAllUserProducts,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    verifyProduct,
    removeProductPics,
    addProductPics,
};