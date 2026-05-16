import React, { useState } from 'react';
import { Truck, CreditCard, Banknote, QrCode } from 'lucide-react';

export default function CheckoutForm({ 
    shippingMethod, setShippingMethod, 
    paymentMethod, setPaymentMethod, 
    onSubmit, finalTotal
}) {
    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        phone: '',
        email: '',
        deliveryDate: '',
        deliveryTime: '08:00 - 10:00',
        cardType: 'Sinh nhật',
        message: ''
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
        if (!formData.deliveryDate) newErrors.deliveryDate = 'Vui lòng chọn ngày giao hàng';
        
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

            {/* Khối 3: Thời gian giao hàng */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F1F1F1]">
                <h2 className="flex items-center gap-3 font-semibold text-gray-800 mb-6">
                    <span className="bg-[#FFB6C1] text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">3</span>
                    Thời gian giao hàng mong muốn
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Ngày giao</label>
                        <input 
                            type="date" 
                            name="deliveryDate"
                            min={new Date().toISOString().split('T')[0]}
                            value={formData.deliveryDate}
                            onChange={handleChange}
                            className={`w-full border ${errors.deliveryDate ? 'border-red-400' : 'border-gray-200'} rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-pink-300 transition-shadow`}
                        />
                        {errors.deliveryDate && <p className="text-red-500 text-xs mt-1">{errors.deliveryDate}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Khung giờ</label>
                        <select 
                            name="deliveryTime"
                            value={formData.deliveryTime}
                            onChange={handleChange}
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-pink-300 transition-shadow bg-white"
                        >
                            <option>08:00 - 10:00</option>
                            <option>10:00 - 12:00</option>
                            <option>13:00 - 15:00</option>
                            <option>15:00 - 17:00</option>
                            <option>18:00 - 20:00</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Khối 4: Thiệp & Lời nhắn */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F1F1F1]">
                <h2 className="flex items-center gap-3 font-semibold text-gray-800 mb-6">
                    <span className="bg-[#FFB6C1] text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">4</span>
                    Thiệp chúc mừng & Lời nhắn
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Loại thiệp</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {['Sinh nhật', 'Khai trương', 'Valentine', 'Cảm ơn', 'Khác'].map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, cardType: type }))}
                                    className={`px-3 py-2 text-xs rounded-lg border transition-all ${formData.cardType === type ? 'bg-pink-50 border-pink-200 text-pink-600 font-medium' : 'border-gray-100 text-gray-500 hover:border-pink-100'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Lời nhắn trên thiệp</label>
                        <textarea 
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Nhập lời nhắn bạn muốn gửi đến người nhận..." 
                            rows="3"
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-pink-300 transition-shadow resize-none"
                        ></textarea>
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

            {/* Khối 5: Phương thức thanh toán */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F1F1F1]">
                <h2 className="flex items-center gap-3 font-semibold text-gray-800 mb-6">
                    <span className="bg-[#FFB6C1] text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">5</span>
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
                    <div className="flex flex-col border rounded-xl overflow-hidden transition-all border-gray-200">
                        <div 
                            onClick={() => setPaymentMethod('card')}
                            className={`flex items-center gap-3 p-4 cursor-pointer transition-all ${paymentMethod === 'card' ? 'bg-pink-50 border-b border-pink-100' : 'hover:bg-gray-50'}`}
                        >
                            <CreditCard className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-[#FFB6C1]' : 'text-gray-400'}`} />
                            <span className={`text-sm ${paymentMethod === 'card' ? 'text-gray-900 font-medium' : 'text-gray-800'}`}>Thẻ tín dụng / Ghi nợ / Chuyển khoản</span>
                        </div>
                        {paymentMethod === 'card' && (
                            <div className="p-6 bg-white animate-in slide-in-from-top-2 fade-in duration-200">
                                <div className="flex flex-col items-center border border-gray-100 rounded-xl p-6 bg-gray-50">
                                    <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 mb-4 flex items-center justify-center">
                                        <img 
                                            src={`https://img.vietqr.io/image/970436-0123456789-compact2.png?amount=${finalTotal}&addInfo=${encodeURIComponent('Thanh toan don hang ' + formData.phone)}&accountName=CUA%20HANG%20FLORE`} 
                                            alt="QR Code Thanh Toán" 
                                            className="w-48 h-48 object-contain"
                                        />
                                    </div>
                                    <h3 className="font-semibold text-gray-800 mb-2">Ngân hàng Vietcombank</h3>
                                    <div className="text-sm text-gray-600 space-y-2 w-full max-w-xs">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Chủ tài khoản:</span>
                                            <span className="font-medium text-gray-800">CỬA HÀNG FLORÉ</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Số tài khoản:</span>
                                            <span className="font-medium text-gray-800">0123456789</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
                                            <span className="text-gray-500">Số tiền:</span>
                                            <span className="font-bold text-[#FFB6C1] text-lg">
                                                {finalTotal?.toLocaleString('vi-VN')}đ
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-start pt-2">
                                            <span className="text-gray-500">Nội dung:</span>
                                            <span className="font-medium text-gray-800 text-right w-2/3 break-words">
                                                Thanh toan don hang {formData.phone || '...'}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-6 text-center">
                                        Quét mã QR bằng ứng dụng ngân hàng hoặc ví điện tử để thanh toán
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
}
