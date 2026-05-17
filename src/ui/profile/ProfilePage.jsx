import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import ProfileInfo from './ProfileInfo';
import OrderList from './OrderList';
import toast from 'react-hot-toast';
import { MapPin, Check, Edit2, Trash2, X, Mail, MessageSquare, Calendar, RefreshCw } from 'lucide-react';

export default function ProfilePage() {
    const { user, updateUser, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.tab || 'info');

    // Quản lý địa chỉ state
    const [showModal, setShowModal] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [addressForm, setAddressForm] = useState({
        name: '',
        phone: '',
        email: '',
        addressLine: '',
        isDefault: false
    });

    useEffect(() => {
        if (location.state?.tab) {
            setActiveTab(location.state.tab);
        }
    }, [location.state]);

    // Hộp thư liên hệ state & logic
    const [userContacts, setUserContacts] = useState([]);
    const [loadingContacts, setLoadingContacts] = useState(false);
    const [hasNewReply, setHasNewReply] = useState(false);

    const fetchUserContacts = async () => {
        if (!user?.email) return;
        setLoadingContacts(true);
        try {
            const response = await fetch('/api/contacts');
            const data = await response.json();
            if (response.ok && data.success) {
                // Lọc tin nhắn của người dùng dựa theo email (chuẩn hóa loại bỏ dấu cách và chữ hoa/thường)
                const filtered = (data.data || []).filter(
                    c => c.email.trim().toLowerCase() === user.email.trim().toLowerCase()
                );
                setUserContacts(filtered);
            }
        } catch (error) {
            console.error("Lỗi khi tải hộp thư liên hệ:", error);
        } finally {
            setLoadingContacts(false);
        }
    };

    // Tự động tải liên hệ khi đổi Email để check xem có phản hồi mới từ ban đầu
    useEffect(() => {
        fetchUserContacts();
    }, [user?.email]);

    useEffect(() => {
        if (activeTab === 'contacts') {
            fetchUserContacts();
        }
    }, [activeTab]);

    // Kiểm tra xem có phản hồi mới chưa đọc
    useEffect(() => {
        if (userContacts.length > 0) {
            const replied = userContacts.filter(c => c.isReplied);
            if (replied.length > 0) {
                const latestReplied = replied[0];
                const lastSeenId = localStorage.getItem(`seen_reply_${user._id || user.id}`);
                setHasNewReply(lastSeenId !== latestReplied._id);
            }
        }
    }, [userContacts, user?._id, user?.id]);

    // Đánh dấu đã đọc khi chuyển sang Tab Hộp thư liên hệ
    useEffect(() => {
        if (activeTab === 'contacts' && userContacts.length > 0) {
            const replied = userContacts.filter(c => c.isReplied);
            if (replied.length > 0) {
                localStorage.setItem(`seen_reply_${user._id || user.id}`, replied[0]._id);
                setHasNewReply(false);
            }
        }
    }, [activeTab, userContacts, user?._id, user?.id]);

    const handleLogout = () => {
        logout(); // Assuming this clears state and localStorage
        navigate('/');
    };

    const handleAddClick = () => {
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

    const handleDeleteAddress = async (indexToDelete) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này không?")) return;

        let updatedAddresses = (user?.addresses || []).filter((_, idx) => idx !== indexToDelete);

        // Nếu xóa địa chỉ mặc định, đặt địa chỉ đầu tiên làm mặc định
        if (user?.addresses[indexToDelete]?.isDefault && updatedAddresses.length > 0) {
            updatedAddresses[0].isDefault = true;
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
                updateUser(data);
                toast.success("Xóa địa chỉ thành công!");
            } else {
                toast.error(data.message || "Lỗi khi xóa địa chỉ");
            }
        } catch (error) {
            console.error("Lỗi khi xóa địa chỉ:", error);
            toast.error("Không thể kết nối đến máy chủ");
        }
    };

    const handleSetDefaultAddress = async (indexToSet) => {
        let updatedAddresses = (user?.addresses || []).map((addr, idx) => ({
            ...addr,
            isDefault: idx === indexToSet
        }));

        try {
            const userId = user._id || user.id;
            const response = await fetch(`/api/users/profile/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ addresses: updatedAddresses })
            });

            const data = await response.json();
            if (response.ok && data.success) {
                updateUser(data);
                toast.success("Đặt làm địa chỉ mặc định thành công!");
            } else {
                toast.error(data.message || "Lỗi khi thiết lập địa chỉ mặc định");
            }
        } catch (error) {
            console.error("Lỗi khi thiết lập mặc định:", error);
            toast.error("Không thể kết nối đến máy chủ");
        }
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();

        if (!addressForm.name || !addressForm.phone || !addressForm.email || !addressForm.addressLine) {
            toast.error("Vui lòng điền đầy đủ thông tin địa chỉ!");
            return;
        }

        let updatedAddresses = [...(user?.addresses || [])];

        // Nếu là địa chỉ mặc định mới, chuyển các địa chỉ cũ sang false
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
                updateUser(data);
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

    return (
        <div className="bg-[#FDFCFB] min-h-screen py-10">
            <div className="w-full px-6 md:px-10 lg:px-16">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Sidebar 
                            activeTab={activeTab} 
                            setActiveTab={setActiveTab} 
                            handleLogout={handleLogout} 
                            hasNewReply={hasNewReply}
                        />
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {activeTab === 'info' && (
                            <ProfileInfo />
                        )}
                        {activeTab === 'orders' && (
                            <OrderList />
                        )}
                        {activeTab === 'address' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-[#F1F1F1] p-6 lg:p-8 animate-in fade-in duration-500">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
                                    <h2 className="text-xl font-serif text-[#333333]">Địa chỉ của tôi</h2>
                                    <button 
                                        onClick={handleAddClick}
                                        className="bg-[#FFB6C1] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#734A4A] hover:scale-105 transition-all shadow-sm"
                                    >
                                        + Thêm địa chỉ mới
                                    </button>
                                </div>
                                
                                {/* Address List */}
                                {user?.addresses && user.addresses.length > 0 ? (
                                    <div className="space-y-4">
                                        {user.addresses.map((addr, index) => (
                                            <div key={addr._id || index} className={`border rounded-xl p-5 relative transition-all ${
                                                addr.isDefault 
                                                    ? 'border-[#FFB6C1] bg-[#FFF5F7]' 
                                                    : 'border-gray-100 bg-white hover:border-[#FFB6C1]'
                                            }`}>
                                                <div className="absolute top-5 right-5 flex gap-4 text-xs font-semibold">
                                                    {!addr.isDefault && (
                                                        <button 
                                                            onClick={() => handleSetDefaultAddress(index)}
                                                            className="text-gray-400 hover:text-[#8C5D5D] transition-colors"
                                                        >
                                                            Đặt mặc định
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => handleEditAddress(index)}
                                                        className="text-[#FFB6C1] hover:text-[#734A4A] transition-colors flex items-center gap-1"
                                                    >
                                                        <Edit2 size={13} /> Sửa
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteAddress(index)}
                                                        className="text-red-400 hover:text-red-600 transition-colors flex items-center gap-1"
                                                    >
                                                        <Trash2 size={13} /> Xóa
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                    <h3 className="font-semibold text-gray-800 text-base">{addr.name}</h3>
                                                    <span className="text-gray-300 hidden sm:inline">|</span>
                                                    <span className="text-gray-600 text-sm">{addr.phone}</span>
                                                    {addr.email && (
                                                        <>
                                                            <span className="text-gray-300 hidden sm:inline">|</span>
                                                            <span className="text-gray-500 text-sm">{addr.email}</span>
                                                        </>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 mb-3">{addr.addressLine}</p>
                                                {addr.isDefault && (
                                                    <span className="inline-flex items-center gap-1 border border-[#FFB6C1] text-[#FFB6C1] text-[10px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider bg-white">
                                                        <Check size={10} /> Mặc định
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl">
                                        <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-400 text-sm">Bạn chưa lưu địa chỉ nhận hàng nào.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'contacts' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-[#F1F1F1] p-6 lg:p-8 animate-in fade-in duration-500 text-left">
                                <div className="border-b border-gray-100 pb-4 mb-6 flex justify-between items-center gap-4">
                                    <div>
                                        <h2 className="text-xl font-serif text-[#333333]">Hộp thư liên hệ</h2>
                                        <p className="text-xs text-gray-400 mt-1">Xem câu hỏi, góp ý bạn đã gửi và phản hồi từ đội ngũ Floré</p>
                                    </div>
                                    <button 
                                        onClick={fetchUserContacts}
                                        className="p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm hover:bg-pink-50 hover:text-[#FFB6C1] transition-all flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider"
                                    >
                                        <RefreshCw size={12} className={loadingContacts ? "animate-spin text-[#FFB6C1]" : ""} />
                                        Tải lại
                                    </button>
                                </div>
                                
                                {loadingContacts ? (
                                    <div className="text-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFB6C1] mx-auto mb-3"></div>
                                        <p className="text-gray-400 text-xs">Đang kiểm tra tin nhắn của bạn...</p>
                                    </div>
                                ) : userContacts.length > 0 ? (
                                    <div className="space-y-6">
                                        {userContacts.map((contact) => (
                                            <div key={contact._id} className="border border-gray-100 rounded-2xl p-5 hover:border-pink-200 transition-all duration-300 bg-white">
                                                <div className="flex justify-between items-start gap-4 flex-wrap">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-1.5">
                                                            <MessageSquare size={14} className="text-[#FFB6C1]" /> {contact.subject}
                                                        </h3>
                                                        <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
                                                            <Calendar size={10} /> Đã gửi ngày: {new Date(contact.createdAt).toLocaleString('vi-VN')}
                                                        </span>
                                                    </div>
                                                    
                                                    {contact.isReplied ? (
                                                        <span className="bg-emerald-50 text-emerald-750 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wider">
                                                            Đã phản hồi
                                                        </span>
                                                    ) : (
                                                        <span className="bg-amber-50 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-100 uppercase tracking-wider">
                                                            Chờ phản hồi
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="mt-4 bg-gray-50/50 rounded-xl p-3.5 border border-gray-50 text-xs text-gray-600 whitespace-pre-line leading-relaxed">
                                                    {contact.message}
                                                </div>

                                                {contact.isReplied && contact.replyMessage && (
                                                    <div className="mt-4 bg-emerald-50/30 rounded-xl p-4 border border-emerald-100/30 animate-in slide-in-from-bottom-2 duration-300">
                                                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                                                            Phản hồi từ Floré:
                                                        </span>
                                                        <p className="text-xs text-emerald-800 italic leading-relaxed">
                                                            "{contact.replyMessage}"
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl">
                                        <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-400 text-sm">Hộp thư trống. Bạn chưa gửi liên hệ nào.</p>
                                        <a href="/contact" className="inline-block mt-3 text-xs font-bold text-[#FFB6C1] hover:text-[#734A4A] uppercase tracking-wider">
                                            Gửi câu hỏi ngay &rarr;
                                        </a>
                                    </div>
                                )}
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
                    <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 lg:p-8 animate-in zoom-in-95 fade-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-serif text-gray-800">
                                {editingIndex !== null ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}
                            </h3>
                            <button 
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingIndex(null);
                                }} 
                                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSaveAddress} className="space-y-4">
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
                                    id="isDefault"
                                    checked={addressForm.isDefault}
                                    onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                                    className="rounded border-gray-300 text-[#FFB6C1] focus:ring-[#FFB6C1] w-4 h-4"
                                />
                                <label htmlFor="isDefault" className="text-xs text-gray-600 font-medium select-none cursor-pointer">
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
                                    type="submit"
                                    className="flex-1 py-3 bg-[#FFB6C1] text-white hover:bg-[#734A4A] rounded-xl text-xs font-bold uppercase tracking-widest shadow-md transition-all"
                                >
                                    Lưu địa chỉ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
