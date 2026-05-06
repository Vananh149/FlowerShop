import React, { useState } from 'react';
import { ShoppingCart, Gift, Leaf, Clock } from 'lucide-react';

export default function ProductInfo({ product, onAddToCart }) {
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('Tiêu chuẩn');
    const [isGift, setIsGift] = useState(false);

    const sizes = ['Tiêu chuẩn', 'Lớn', 'Đặc biệt'];

    const handleAddToCart = () => {
        onAddToCart(quantity, selectedSize);
    };

    return (
        <div className="flex flex-col h-full justify-center">
            {/* Tiêu đề & Giá */}
            <h1 className="text-3xl font-serif text-gray-800">{product.name}</h1>
            <p className="text-xl font-bold text-[#FFB6C1] mt-2">{product.priceFormatted}</p>
            
            {/* Mô tả */}
            <p className="text-sm text-gray-500 mt-4 leading-relaxed">
                {product.description}
            </p>

            {/* Biến thể: Kích thước */}
            <div className="mt-8">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Kích thước</h3>
                <div className="flex flex-wrap gap-3">
                    {sizes.map((size) => (
                        <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2 text-sm rounded-full border transition-all ${
                                selectedSize === size 
                                    ? 'border-[#FFB6C1] text-[#FFB6C1] bg-[#FFB6C1]/5 font-medium shadow-sm' 
                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chọn số lượng */}
            <div className="mt-6 flex items-center border border-gray-200 rounded-full overflow-hidden w-fit bg-white">
                <button 
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >-</button>
                <span className="w-12 text-center text-sm font-medium text-gray-800">{quantity}</span>
                <button 
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                    onClick={() => setQuantity(quantity + 1)}
                >+</button>
            </div>

            {/* Buttons */}
            <div className="mt-6">
                <button 
                    onClick={handleAddToCart}
                    className="w-full bg-[#FFB6C1] text-white py-3 rounded-full hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-2 font-medium shadow-sm"
                >
                    <ShoppingCart className="w-5 h-5" />
                    Thêm vào giỏ hàng
                </button>
                
                <label className="mt-4 flex items-center gap-3 cursor-pointer group">
                    <input 
                        type="checkbox" 
                        checked={isGift}
                        onChange={(e) => setIsGift(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-[#FFB6C1] focus:ring-[#FFB6C1] focus:ring-offset-0 accent-[#FFB6C1] cursor-pointer"
                    />
                    <div className="flex items-center gap-2 text-sm text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                        <Gift className={`w-4 h-4 ${isGift ? 'text-[#FFB6C1]' : 'text-gray-400'}`} />
                        Gửi như một món quà
                    </div>
                </label>
            </div>

            {/* Dịch vụ */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-100 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-green-600" />
                    <span>Nguồn gốc bền vững</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span>Giao hàng trong ngày</span>
                </div>
            </div>
        </div>
    );
}
