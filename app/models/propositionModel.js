const mongoose = require('mongoose');

const PropositionSchema = new mongoose.Schema({
    buyer: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    seller: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
    price: {type: Number},
    text: {type: String},
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending',
    },
});

const Proposition = mongoose.model('Proposition', PropositionSchema);

module.exports = Proposition;
