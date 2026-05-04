import React from 'react';
import { Lock } from 'lucide-react';

export default function CheckoutSummary({ cart, cartTotal, shippingFee, finalTotal, isSubmitting }) {
    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN') + ' VND';
    };

    return (
        <div className="bg-white border border-[#F1F1F1] rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="font-serif text-lg text-gray-800 mb-6">Tóm tắt đơn hàng</h2>
            
            {/* Products List (compact) */}
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {cart.map(item => (
                    <div key={`${item.id}-${item.selectedSize}`} className="flex items-center gap-3">
                        <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                        />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</p>
                            <p className="text-xs text-gray-500">SL: {item.quantity}</p>
                        </div>
                        <span className="text-sm font-medium text-gray-800">
                            {formatPrice(item.price * item.quantity)}
                        </span>
                    </div>
                ))}
            </div>

            {/* Calculations */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm text-gray-500">
                    <span>Tạm tính</span>
                    <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                    <span>Thuế (0%)</span>
                    <span>0 VND</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                    <span>Phí vận chuyển</span>
                    <span>{formatPrice(shippingFee)}</span>
                </div>
            </div>

            {/* Final Total */}
            <div className="border-t border-gray-100 my-4 pt-4">
                <div className="flex justify-between items-center">
                    <span className="text-base font-medium text-gray-800">Tổng cộng</span>
                    <span className="text-xl font-bold text-gray-800">{formatPrice(finalTotal)}</span>
                </div>
            </div>

            {/* CTA */}
            <button 
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className={`mt-6 w-full bg-[#FFB6C1] text-white py-3.5 rounded-full transition-transform duration-300 flex items-center justify-center font-medium shadow-sm ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'}`}
            >
                {isSubmitting ? 'ĐANG XỬ LÝ...' : 'ĐẶT HÀNG NGAY'}
            </button>

            {/* Security Note */}
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1.5 mt-4">
                <Lock className="w-3.5 h-3.5" />
                Giao dịch được mã hóa an toàn
            </p>
        </div>
    );
}
