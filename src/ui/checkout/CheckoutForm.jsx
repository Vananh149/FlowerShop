import React, { useState, useEffect } from 'react';
import { Truck, CreditCard, Banknote, Plus, Edit2, Check, MapPin, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function CheckoutForm({ 
    shippingMethod, setShippingMethod, 
    paymentMethod, setPaymentMethod, 
    onSubmit, finalTotal
}) {
    const { user, updateUser } = useAuth();
    
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

    // Địa chỉ phụ / Modal States
    const [showModal, setShowModal] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [addressForm, setAddressForm] = useState({
        name: '',
        phone: '',
        email: '',
        addressLine: '',
        isDefault: false
    });

    // 🌟 1. Tự động điền địa chỉ mặc định của người dùng khi load trang thanh toán
    useEffect(() => {
        if (user) {
            const defaultAddr = (user.addresses || []).find(addr => addr.isDefault);
            if (defaultAddr) {
                setFormData(prev => ({
                    ...prev,
                    fullName: defaultAddr.name || '',
                    address: defaultAddr.addressLine || '',
                    phone: defaultAddr.phone || '',
                    email: defaultAddr.email || user.email || ''
                }));
            } else if (user.name || user.phone || user.email) {
                // Nếu chưa có địa chỉ mặc định nào, lấy thông tin cá nhân cơ bản làm dự phòng
                setFormData(prev => ({
                    ...prev,
                    fullName: user.name || '',
                    phone: user.phone || '',
                    email: user.email || ''
                }));
            }
        }
    }, [user]);

    // 🌟 2. Hàm xử lý khi khách click chọn nhanh một địa chỉ khác trong danh sách đã lưu
    const selectSavedAddress = (addr) => {
        setFormData(prev => ({
            ...prev,
            fullName: addr.name || '',
            address: addr.addressLine || '',
            phone: addr.phone || '',
            email: addr.email || ''
        }));
        setErrors({}); // Xóa sạch thông báo lỗi cũ
    };

    const handleAddNewClick = () => {
        setAddressForm({
            name: '',
            phone: '',
            email: '',
            addressLine: '',
            isDefault: (user?.addresses || []).length === 0
        });
        setEditingIndex(null);
        setShowModal(true);
    };

    const handleEditAddress = (index) => {
        const addr = user.addresses[index];
        setAddressForm({
            name: addr.name || '',
            phone: addr.phone || '',
            email: addr.email || '',
            addressLine: addr.addressLine || '',
            isDefault: addr.isDefault || false
        });
        setEditingIndex(index);
        setShowModal(true);
    };

    // 🌟 3. Hàm lưu địa chỉ mới/sửa trực tiếp tại trang thanh toán và đồng bộ MongoDB
    const handleSaveAddress = async (e) => {
        e.preventDefault();

        if (!addressForm.name || !addressForm.phone || !addressForm.email || !addressForm.addressLine) {
            toast.error("Vui lòng điền đầy đủ thông tin địa chỉ!");
            return;
        }

        let updatedAddresses = [...(user?.addresses || [])];

        if (addressForm.isDefault) {
            updatedAddresses = updatedAddresses.map(addr => ({ ...addr, isDefault: false }));
        }

        const isDefaultFinal = updatedAddresses.length === 0 ? true : addressForm.isDefault;
        const newAddress = { ...addressForm, isDefault: isDefaultFinal };

        if (editingIndex !== null) {
            updatedAddresses[editingIndex] = newAddress;
        } else {
            updatedAddresses.push(newAddress);
        }

        try {
            const userId = user._id || user.id;
            const response = await fetch(`/api/users/profile/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ addresses: updatedAddresses })
            });

            const data = await response.json();
            if (response.ok && data.success) {
                updateUser(data); // Cập nhật lại AuthContext và LocalStorage
                
                // 🌟 Tự động chọn luôn địa chỉ vừa lưu vào các trường input thanh toán
                setFormData(prev => ({
                    ...prev,
                    fullName: newAddress.name,
                    phone: newAddress.phone,
                    email: newAddress.email,
                    address: newAddress.addressLine
                }));
                
                setShowModal(false);
                setEditingIndex(null);
                toast.success(editingIndex !== null ? "Cập nhật địa chỉ thành công!" : "Thêm địa chỉ mới thành công!");
            } else {
                toast.error(data.message || "Lỗi khi lưu địa chỉ");
            }
        } catch (error) {
            console.error("Lỗi khi lưu địa chỉ:", error);
            toast.error("Không thể kết nối đến máy chủ");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
                <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
                    <h2 className="flex items-center gap-3 font-semibold text-gray-800">
                        <span className="bg-[#FFB6C1] text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">1</span>
                        Thông tin giao hàng
                    </h2>
                    {user && (
                        <button
                            type="button"
                            onClick={handleAddNewClick}
                            className="text-xs text-[#FFB6C1] hover:text-[#734A4A] font-bold flex items-center gap-1 transition-colors"
                        >
                            <Plus size={14} /> Thêm địa chỉ mới
                        </button>
                    )}
                </div>

                {/* Sổ địa chỉ đã lưu */}
                {user?.addresses && user.addresses.length > 0 && (
                    <div className="mb-6 pb-6 border-b border-gray-100">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                            Chọn nhanh địa chỉ nhận hàng đã lưu:
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {user.addresses.map((addr, index) => {
                                const isSelected = 
                                    formData.fullName === addr.name && 
                                    formData.address === addr.addressLine && 
                                    formData.phone === addr.phone && 
                                    formData.email === addr.email;
                                return (
                                    <div 
                                        key={addr._id || index}
                                        onClick={() => selectSavedAddress(addr)}
                                        className={`p-3.5 border rounded-xl cursor-pointer relative transition-all ${
                                            isSelected 
                                                ? 'border-[#FFB6C1] bg-[#FFF5F7] shadow-sm' 
                                                : 'border-gray-100 bg-gray-50/50 hover:border-pink-200'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1.5 flex-wrap pr-10">
                                            <span className="font-semibold text-gray-800 text-xs">{addr.name}</span>
                                            <span className="text-gray-300 text-xs">|</span>
                                            <span className="text-gray-600 text-xs">{addr.phone}</span>
                                        </div>
                                        <p className="text-[11px] text-gray-500 line-clamp-2 pr-6">{addr.addressLine}</p>
                                        
                                        {addr.isDefault && (
                                            <span className="absolute bottom-2 right-2 border border-[#FFB6C1] text-[#FFB6C1] text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-white">
                                                Mặc định
                                            </span>
                                        )}
                                        
                                        <div className="absolute top-2 right-2">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditAddress(index);
                                                }}
                                                className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-[#FFB6C1] transition-colors"
                                                title="Sửa địa chỉ"
                                            >
                                                <Edit2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Họ và tên người nhận</label>
                        <input 
                            type="text" 
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Nhập họ và tên người nhận..." 
                            className={`w-full border ${errors.fullName ? 'border-red-400' : 'border-gray-200'} rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-pink-300 transition-shadow`}
                        />
                        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Địa chỉ nhận hoa</label>
                        <input 
                            type="text" 
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Địa chỉ giao hàng chi tiết..." 
                            className={`w-full border ${errors.address ? 'border-red-400' : 'border-gray-200'} rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-pink-300 transition-shadow`}
                        />
                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Số điện thoại nhận hoa</label>
                            <input 
                                type="tel" 
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Số điện thoại nhận hàng..." 
                                className={`w-full border ${errors.phone ? 'border-red-400' : 'border-gray-200'} rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-pink-300 transition-shadow`}
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Email liên hệ</label>
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Địa chỉ email liên hệ..." 
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

            {/* Address Form Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]" onClick={() => setShowModal(false)}></div>
                    
                    {/* Modal Content */}
                    <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 lg:p-8 animate-in zoom-in-95 fade-in duration-200 text-left">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-serif text-gray-800">
                                {editingIndex !== null ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}
                            </h3>
                            <button 
                                type="button"
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingIndex(null);
                                }} 
                                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] text-gray-400 font-bold mb-1.5 uppercase tracking-wider">Họ và tên</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={addressForm.name} 
                                    onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                                    className="w-full text-sm text-gray-700 font-medium border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#FFB6C1]/20 focus:border-[#FFB6C1] transition-all" 
                                    placeholder="Nhập họ và tên..."
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-gray-400 font-bold mb-1.5 uppercase tracking-wider">Số điện thoại</label>
                                <input 
                                    type="tel" 
                                    required 
                                    value={addressForm.phone} 
                                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                    className="w-full text-sm text-gray-700 font-medium border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#FFB6C1]/20 focus:border-[#FFB6C1] transition-all" 
                                    placeholder="Nhập số điện thoại nhận hàng..."
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-gray-400 font-bold mb-1.5 uppercase tracking-wider">Email</label>
                                <input 
                                    type="email" 
                                    required 
                                    value={addressForm.email} 
                                    onChange={(e) => setAddressForm({ ...addressForm, email: e.target.value })}
                                    className="w-full text-sm text-gray-700 font-medium border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#FFB6C1]/20 focus:border-[#FFB6C1] transition-all" 
                                    placeholder="Nhập địa chỉ email..."
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-gray-400 font-bold mb-1.5 uppercase tracking-wider">Địa chỉ chi tiết</label>
                                <textarea 
                                    required 
                                    rows="3"
                                    value={addressForm.addressLine} 
                                    onChange={(e) => setAddressForm({ ...addressForm, addressLine: e.target.value })}
                                    className="w-full text-sm text-gray-700 font-medium border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#FFB6C1]/20 focus:border-[#FFB6C1] transition-all resize-none" 
                                    placeholder="Nhập số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                                />
                            </div>
                            
                            <div className="flex items-center gap-2 py-2">
                                <input 
                                    type="checkbox" 
                                    id="isDefaultCheckout"
                                    checked={addressForm.isDefault}
                                    onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                                    className="rounded border-gray-300 text-[#FFB6C1] focus:ring-[#FFB6C1] w-4 h-4"
                                />
                                <label htmlFor="isDefaultCheckout" className="text-xs text-gray-600 font-medium select-none cursor-pointer">
                                    Thiết lập làm địa chỉ mặc định
                                </label>
                            </div>
                            
                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingIndex(null);
                                    }}
                                    className="flex-1 py-3 bg-gray-50 text-gray-500 hover:bg-gray-100 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
                                >
                                    Hủy
                                </button>
                                <button 
                                    type="button"
                                    onClick={handleSaveAddress}
                                    className="flex-1 py-3 bg-[#FFB6C1] text-white hover:bg-[#734A4A] rounded-xl text-xs font-bold uppercase tracking-widest shadow-md transition-all"
                                >
                                    Lưu địa chỉ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}
