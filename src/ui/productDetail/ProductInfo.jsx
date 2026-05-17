import React, { useState } from 'react';
import { ShoppingCart, Gift, Leaf, Clock } from 'lucide-react';

export default function ProductInfo({ product, onAddToCart }) {
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('Tiêu chuẩn');
    const [selectedGifts, setSelectedGifts] = useState([]);

    const sizes = ['Tiêu chuẩn', 'Lớn', 'Đặc biệt'];
    const gifts = [
        { id: 'bear', name: 'Gấu bông Teddy', price: 150000, image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&q=80&w=200' },
        { id: 'choco', name: 'Hộp Socola Ferrero', price: 250000, image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80&w=200' },
        { id: 'candle', name: 'Nến thơm tinh dầu', price: 180000, image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=200' }
    ];

    const handleAddToCart = () => {
        onAddToCart(quantity, selectedSize, selectedGifts);
    };

    const toggleGift = (giftName) => {
        setSelectedGifts(prev => 
            prev.includes(giftName) ? prev.filter(name => name !== giftName) : [...prev, giftName]
        );
    };

    // Tính giá thực tế dựa trên Kích thước & Quà tặng đã chọn
    const calculateCurrentPrice = () => {
        let total = product.price;
        if (selectedSize === 'Lớn') total += 150000;
        if (selectedSize === 'Đặc biệt') total += 300000;
        
        selectedGifts.forEach(giftName => {
            const gift = gifts.find(g => g.name === giftName);
            if (gift) total += gift.price;
        });
        return total;
    };

    return (
        <div className="flex flex-col h-full">
            {/* Tiêu đề & Giá */}
            <h1 className="text-3xl font-serif text-gray-800">{product.name}</h1>
            <p className="text-xl font-bold text-[#FFB6C1] mt-2">{calculateCurrentPrice().toLocaleString('vi-VN')}đ</p>
            
            {/* Mô tả */}
            <p className="text-sm text-gray-500 mt-4 leading-relaxed">
                {product.description}
            </p>

            {/* Biến thể: Kích thước */}
            <div className="mt-8">
                <h3 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wider text-[10px]">Kích thước</h3>
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
                            {size === 'Lớn' && <span className="ml-1 text-[10px] text-gray-400">(+150k)</span>}
                            {size === 'Đặc biệt' && <span className="ml-1 text-[10px] text-gray-400">(+300k)</span>}
                        </button>
                    ))}
                </div>
            </div>

            {/* Mua kèm quà tặng */}
            <div className="mt-8">
                <h3 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wider text-[10px]">Mua kèm quà tặng</h3>
                <div className="space-y-2">
                    {gifts.map(gift => (
                        <div 
                            key={gift.id}
                            onClick={() => toggleGift(gift.name)}
                            className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all ${selectedGifts.includes(gift.name) ? 'border-[#FFB6C1] bg-pink-50' : 'border-gray-100 hover:border-pink-100'}`}
                        >
                            <div className="flex items-center gap-3">
                                <img src={gift.image} alt={gift.name} className="w-10 h-10 object-cover rounded-lg" />
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-700 font-medium">{gift.name}</span>
                                    <span className="text-[11px] text-gray-400">Giao kèm hoa tươi</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-medium text-gray-900">+{gift.price.toLocaleString('vi-VN')}đ</span>
                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedGifts.includes(gift.name) ? 'bg-[#FFB6C1] border-[#FFB6C1]' : 'border-gray-300'}`}>
                                    {selectedGifts.includes(gift.name) && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chọn số lượng & Buttons */}
            <div className="mt-8 flex gap-4">
                <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-white">
                    <button 
                        className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >-</button>
                    <span className="w-10 text-center text-sm font-medium text-gray-800">{quantity}</span>
                    <button 
                        className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                        onClick={() => setQuantity(quantity + 1)}
                    >+</button>
                </div>
                <button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-[#FFB6C1] text-white py-3 rounded-full hover:bg-[#F0A2B0] transition-all flex items-center justify-center gap-2 font-medium shadow-sm"
                >
                    <ShoppingCart className="w-5 h-5" />
                    Thêm vào giỏ hàng
                </button>
            </div>

            {/* Hướng dẫn chăm sóc hoa */}
            <div className="mt-10 p-5 bg-green-50/50 rounded-2xl border border-green-100">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-green-800 mb-3">
                    <Leaf className="w-4 h-4" />
                    Hướng dẫn chăm sóc hoa tươi
                </h3>
                <ul className="space-y-2 text-[13px] text-green-700/80">
                    <li className="flex gap-2">
                        <span className="font-bold text-green-600">•</span>
                        Cắt bớt cành 1-2cm theo góc 45 độ trước khi cắm vào bình.
                    </li>
                    <li className="flex gap-2">
                        <span className="font-bold text-green-600">•</span>
                        Thay nước sạch mỗi ngày và rửa sạch bình.
                    </li>
                    <li className="flex gap-2">
                        <span className="font-bold text-green-600">•</span>
                        Tránh đặt hoa ở nơi có ánh nắng trực tiếp hoặc gần điều hòa.
                    </li>
                </ul>
            </div>
        </div>
    );
}
