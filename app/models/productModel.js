const mongoose = require('mongoose');
const ProductCategories = require('../middleware/enums').ProductCategories;

const ProductSchema = new mongoose.Schema({
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    title: {
        type: String,
        required: true,
    },
    description: String,
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date,
    price: {
        type: Number,
        required: true
    },
    coordinates: {
        type: [Number], // [longitude, latitude]
        index: '2dsphere'
    },
    category: {
        type: String,
        enum: ProductCategories,
        default: 'Other',
        required: true
    },
    pictures: [{
        pictureUrl: String,
        fileName: String
    }],
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Sold'],
        default: 'Active',
    },
    verified: Date,
});

ProductSchema.index({ coordinates: '2dsphere' });
ProductSchema.virtual('isVerified').get(function () {
    return !!(this.verified);
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
