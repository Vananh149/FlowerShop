import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CartSummary({ cartTotal, cartCount }) {
    const navigate = useNavigate();
    const shippingFee = 0; // Miễn phí giao hàng như đã thỏa thuận

    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN') + ' VND';
    };

    const handleCheckout = () => {
        if (cartCount > 0) {
            navigate('/checkout');
        }
    };

    return (
        <>
            <div className="bg-white border border-[#F1F1F1] rounded-2xl p-6 shadow-sm sticky top-24">
                <h2 className="font-serif text-lg text-gray-800 mb-6">Tóm tắt đơn hàng</h2>
                
                <div className="space-y-4">
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Tạm tính ({cartCount} sản phẩm)</span>
                        <span>{formatPrice(cartTotal)}</span>
                    </div>
                </div>

                <div className="border-t border-gray-100 my-4 pt-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-800">Tổng cộng</span>
                        <span className="text-lg font-bold text-gray-800">{formatPrice(cartTotal + shippingFee)}</span>
                    </div>
                </div>

                <button 
                    onClick={handleCheckout}
                    className="mt-6 w-full bg-[#FFB6C1] text-white py-3 rounded-full hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-2 font-medium shadow-sm"
                >
                    THANH TOÁN 
                    <ArrowRight className="w-4 h-4" />
                </button>

                <div className="space-y-3 mt-8 pt-6 border-t border-gray-50 text-xs text-gray-500">
                    <p className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        Giao hàng nhanh trong 2–4 giờ
                    </p>
                    <p className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        Cam kết hoa tươi trong 7 ngày
                    </p>
                </div>
            </div>
        </>
    );
}
