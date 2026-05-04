import React, { useState } from 'react';
import { Truck, CreditCard, Banknote } from 'lucide-react';

export default function CheckoutForm({ 
    shippingMethod, setShippingMethod, 
    paymentMethod, setPaymentMethod, 
    onSubmit 
}) {
    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        phone: '',
        email: ''
    });
    
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Xóa lỗi khi type
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ và tên';
        if (!formData.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ';
        if (!formData.phone.trim() || !/^\d{10,11}$/.test(formData.phone)) newErrors.phone = 'Số điện thoại không hợp lệ';
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    return (
        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Khối 1: Thông tin giao hàng */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F1F1F1]">
                <h2 className="flex items-center gap-3 font-semibold text-gray-800 mb-6">
                    <span className="bg-[#FFB6C1] text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">1</span>
                    Thông tin giao hàng
                </h2>
                <div className="space-y-4">
                    <div>
                        <input 
                            type="text" 
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Họ và tên" 
                            className={`w-full border ${errors.fullName ? 'border-red-400' : 'border-gray-200'} rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-pink-300 transition-shadow`}
                        />
                        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>
                    <div>
                        <input 
                            type="text" 
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Địa chỉ giao hàng chi tiết" 
                            className={`w-full border ${errors.address ? 'border-red-400' : 'border-gray-200'} rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-pink-300 transition-shadow`}
                        />
                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <input 
                                type="tel" 
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Số điện thoại" 
                                className={`w-full border ${errors.phone ? 'border-red-400' : 'border-gray-200'} rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-pink-300 transition-shadow`}
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>
                        <div>
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email liên hệ" 
                                className={`w-full border ${errors.email ? 'border-red-400' : 'border-gray-200'} rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-pink-300 transition-shadow`}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Khối 2: Phương thức giao hàng */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F1F1F1]">
                <h2 className="flex items-center gap-3 font-semibold text-gray-800 mb-6">
                    <span className="bg-[#FFB6C1] text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">2</span>
                    Phương thức giao hàng
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div 
                        onClick={() => setShippingMethod('express')}
                        className={`flex justify-between items-center p-4 border rounded-xl cursor-pointer transition-all ${shippingMethod === 'express' ? 'border-[#FFB6C1] bg-pink-50' : 'border-gray-200 hover:border-pink-200'}`}
                    >
                        <div className="flex items-center gap-3">
                            <Truck className={`w-5 h-5 ${shippingMethod === 'express' ? 'text-[#FFB6C1]' : 'text-gray-400'}`} />
                            <span className="text-sm text-gray-800">Giao hỏa tốc (2-4 giờ)</span>
                        </div>
                        <span className="text-sm font-medium text-gray-800">50.000đ</span>
                    </div>
                    <div 
                        onClick={() => setShippingMethod('standard')}
                        className={`flex justify-between items-center p-4 border rounded-xl cursor-pointer transition-all ${shippingMethod === 'standard' ? 'border-[#FFB6C1] bg-pink-50' : 'border-gray-200 hover:border-pink-200'}`}
                    >
                        <div className="flex items-center gap-3">
                            <Truck className={`w-5 h-5 ${shippingMethod === 'standard' ? 'text-[#FFB6C1]' : 'text-gray-400'}`} />
                            <span className="text-sm text-gray-800">Giao tiêu chuẩn (Ngày mai)</span>
                        </div>
                        <span className="text-sm font-medium text-gray-800">15.000đ</span>
                    </div>
                </div>
            </div>

            {/* Khối 3: Phương thức thanh toán */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F1F1F1]">
                <h2 className="flex items-center gap-3 font-semibold text-gray-800 mb-6">
                    <span className="bg-[#FFB6C1] text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">3</span>
                    Phương thức thanh toán
                </h2>
                <div className="flex flex-col gap-4">
                    <div 
                        onClick={() => setPaymentMethod('cod')}
                        className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-[#FFB6C1] bg-pink-50' : 'border-gray-200 hover:border-pink-200'}`}
                    >
                        <Banknote className={`w-5 h-5 ${paymentMethod === 'cod' ? 'text-[#FFB6C1]' : 'text-gray-400'}`} />
                        <span className="text-sm text-gray-800">Thanh toán khi nhận hàng (COD)</span>
                    </div>
                    <div 
                        onClick={() => setPaymentMethod('card')}
                        className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-[#FFB6C1] bg-pink-50' : 'border-gray-200 hover:border-pink-200'}`}
                    >
                        <CreditCard className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-[#FFB6C1]' : 'text-gray-400'}`} />
                        <span className="text-sm text-gray-800">Thẻ tín dụng / Ghi nợ</span>
                    </div>
                </div>
            </div>
        </form>
    );
}
