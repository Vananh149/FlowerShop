import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true // Mỗi người dùng chỉ có một giỏ hàng duy nhất
    },
    items: [
        {
            id: String,      // ID của sản phẩm hoa
            name: String,    // Tên hoa
            price: Number,   // Giá hoa
            image: String,   // Link ảnh hoa
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
