import React, { useState } from 'react';
import { Copy, CheckCircle } from 'lucide-react';

export default function OrderSummary({ orderData }) {
    const [copied, setCopied] = useState(false);
    const { 
        _id, 
        createdAt, 
        items, 
        name,
        phone,
        shippingAddress, 
        paymentMethod, 
        totalAmount 
    } = orderData;

    const handleCopy = () => {
        navigator.clipboard.writeText(_id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatDate = (dateString) => {
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return "Đang xử lý...";
        return d.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-[#F1F1F1] p-6 mt-10 transition-all duration-700 ease-out animate-in fade-in slide-in-from-bottom-4">
            {/* Header */}
            <div className="flex justify-between border-b border-[#F1F1F1] pb-4 mb-4">
                <div>
                    <p className="text-xs text-gray-400 mb-1">MÃ ĐƠN HÀNG</p>
                    <div className="flex items-center space-x-2">
                        <span className="text-[#F472B6] font-bold text-sm sm:text-base">{_id}</span>
                        <button 
                            onClick={handleCopy}
                            className="text-gray-400 hover:text-[#F472B6] transition-colors"
                            title="Copy mã đơn hàng"
                        >
                            {copied ? <CheckCircle className="w-4 h-4 text-[#2ECC71]" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-400 mb-1">NGÀY ĐẶT</p>
                    <p className="text-gray-800 text-sm font-medium">{formatDate(createdAt)}</p>
                </div>
            </div>

            {/* Product List */}
            <div className="mb-6">
                {items?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-4 border-b border-[#F1F1F1] last:border-0">
                        <div className="flex items-center space-x-4">
                            <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-20 h-20 rounded-lg object-cover border border-gray-100"
                            />
                            <div>
                                <h3 className="text-sm font-medium text-gray-800">{item.name}</h3>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {item.selectedSize && (
                                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                            Size: {item.selectedSize}
                                        </span>
                                    )}
                                    {item.selectedGifts && item.selectedGifts.map(gift => (
                                        <span key={gift} className="text-[10px] bg-pink-50 text-[#FFB6C1] px-2 py-0.5 rounded-full">
                                            + {gift}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Số lượng: {item.quantity}</p>
                            </div>
                        </div>
                        <div className="text-gray-700 font-bold text-sm">
                            {(item.price * item.quantity).toLocaleString()}đ
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#F1F1F1]">
                <div>
                    <h4 className="text-xs text-gray-400 mb-2 font-semibold">THÔNG TIN GIAO HÀNG</h4>
                    <p className="text-sm text-gray-800 font-medium">{name}</p>
                    <p className="text-sm text-gray-600 mt-1">{phone}</p>
                    <p className="text-sm text-gray-600 mt-1">{shippingAddress}</p>
                </div>
                <div>
                    <h4 className="text-xs text-gray-400 mb-2 font-semibold">PHƯƠNG THỨC THANH TOÁN</h4>
                    <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-800 flex justify-between items-center border border-gray-100">
                        <span className="font-medium">{paymentMethod || 'Thanh toán khi nhận hàng (COD)'}</span>
                        <span className="font-bold text-[#FFB6C1] text-base">{totalAmount?.toLocaleString()}đ</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
