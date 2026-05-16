import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter product name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please enter product description']
    },
    price: {
        type: Number,
        required: [true, 'Please enter product price'],
        maxLength: [10, 'Price too high'],
        default: 0
    },
    image: {
        type: String,
        required: [true, 'Please provide product image URL']
    },
    category: {
        type: String,
        required: [true, 'Please select category for this product']
    },
    type: {
        type: String,
        required: [true, 'Please enter flower type']
    },
    tag: {
        type: String,
        default: ''
    },
    oldPrice: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        default: 10
    },
    occasion: {
        type: String,
        default: ''
    },
    isPopular: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Product = mongoose.model('Product', productSchema);
export default Product;
