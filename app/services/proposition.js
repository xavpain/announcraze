const User = require('../models/userModel');
const Proposition = require('../models/propositionModel');
const Product = require('../models/productModel');
const mongoose = require('mongoose');

async function createProposition(userId, productId, params) {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) throw 'Invalid id';

    const user = await User.findById(userId);
    if (!user) throw 'User not found';

    const product = await Product.findById(productId);
    if (!product) throw 'Product not found';

    if (!product.verified) throw 'Product is not verified';
    if (product.status !== 'Active') throw 'Product is not active';
    if (product.creator.toString() === userId) throw 'User is product creator';

    const proposition = new Proposition({
        buyer: userId,
        seller: product.creator,
        product: productId,
    });
    if (params.price) proposition.price = params.price;
    if (params.text) proposition.text = params.text;
    return await proposition.save();
}

async function viewPropositions(userId, productId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) throw 'Invalid user id';
    const user = await User.findById(userId);
    if (!user) throw 'User not found';

    if (!productId) return await Proposition.find({
        $or: [
            { buyer: userId },
            { seller: userId }
        ]
    });
    if (!mongoose.Types.ObjectId.isValid(productId)) throw 'Invalid product id';
    const product = await Product.findById(productId);
    if (!product) throw 'Product not found';

    if (product.creator.toString() !== userId) throw 'User is not product creator';

    return await Proposition.find({product: productId});
}

async function changeProposition(userId, propositionId, params)
{
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(propositionId)) throw 'Invalid id';

    const user = await User.findById(userId);
    if (!user) throw 'User not found';

    const proposition = await Proposition.findById(propositionId);
    if (!proposition) throw 'Proposition not found';

    if (proposition.status === 'pending') {
        if (params.price) proposition.price = params.price;
        if (params.text) proposition.text = params.text;
    }
    return await proposition.save();
}

async function endProposition(userId, propositionId, choice) {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(propositionId)) throw 'Invalid id';

    const user = await User.findById(userId);
    if (!user) throw 'User not found';

    const proposition = await Proposition.findById(propositionId);
    if (!proposition) throw 'Proposition not found';

    if (proposition.status !== 'Pending') throw 'Proposition is not pending';
    if (proposition.seller.toString() !== userId) throw 'User is not seller';
    proposition.status = choice;
    if (proposition.status === 'Accepted') {
        const product = await Product.findById(proposition.product);
    
        if (!product) throw 'Product not found';
        product.status = 'Sold';
        await product.save();
    }
    return await proposition.save();
}

module.exports = {
    createProposition,
    viewPropositions,
    changeProposition,
    endProposition
};