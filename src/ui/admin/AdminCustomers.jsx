import React, { useState, useEffect } from 'react';
import { Search, Trash2, Shield, User, MapPin, Calendar, Mail, Phone, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminCustomers() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/users');
            const data = await response.json();
            if (response.ok && data.success) {
                setUsers(data.data || []);
            } else {
                toast.error(data.message || "Lỗi tải dữ liệu khách hàng");
            }
        } catch (error) {
            console.error("Lỗi tải khách hàng:", error);
            toast.error("Không thể kết nối đến máy chủ");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteUser = async (id) => {
        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (response.ok && data.success) {
                toast.success(data.message || "Xóa tài khoản khách hàng thành công!");
                setUsers(users.filter(u => u._id !== id));
                setConfirmDeleteId(null);
            } else {
                toast.error(data.message || "Không thể xóa tài khoản");
            }
        } catch (error) {
            console.error("Lỗi khi xóa người dùng:", error);
            toast.error("Không thể kết nối đến máy chủ");
        }
    };

    // Lọc người dùng theo từ khóa tìm kiếm
    const filteredUsers = users.filter(user => {
        const name = (user.name || '').toLowerCase();
        const email = (user.email || '').toLowerCase();
        const phone = (user.phone || '').toLowerCase();
        const keyword = searchTerm.toLowerCase();
        return name.includes(keyword) || email.includes(keyword) || phone.includes(keyword);
    });

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Tiêu đề & Nút làm mới */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-serif text-gray-800">Quản lý khách hàng</h1>
                    <p className="text-xs text-gray-400 mt-1">Quản lý danh sách tài khoản khách hàng đăng ký trên hệ thống Floré</p>
                </div>
                <button 
                    onClick={fetchUsers}
                    className="p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm hover:bg-pink-50 hover:text-[#FFB6C1] transition-all flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider"
                    title="Làm mới dữ liệu"
                >
                    <RefreshCw size={14} className={loading ? "animate-spin text-[#FFB6C1]" : ""} />
                    {loading ? "Đang tải..." : "Tải lại"}
                </button>
            </div>

            {/* Thanh Tìm kiếm & Thống kê */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Search Bar */}
                <div className="lg:col-span-2 relative">
                    <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                    <input 
                        type="text"
                        placeholder="Tìm kiếm khách hàng bằng tên, email hoặc số điện thoại..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FFB6C1]/20 focus:border-[#FFB6C1] transition-all shadow-sm"
                    />
                </div>
                {/* Stats cards */}
                <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tổng số tài khoản</p>
                        <p className="text-2xl font-serif font-bold text-[#8C5D5D]">{users.length}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center text-[#FFB6C1]">
                        <User size={24} />
                    </div>
                </div>
            </div>

            {/* Danh sách Khách hàng */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="py-20 text-center">
                        <RefreshCw className="animate-spin text-[#FFB6C1] mx-auto w-8 h-8 mb-3" />
                        <p className="text-sm text-gray-400">Đang tải danh sách tài khoản khách hàng...</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="py-20 text-center">
                        <User className="text-gray-300 mx-auto w-12 h-12 mb-3" />
                        <p className="text-sm text-gray-400">Không tìm thấy khách hàng nào phù hợp</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-6">Khách hàng</th>
                                    <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Liên hệ</th>
                                    <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Thông tin cá nhân</th>
                                    <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Vai trò</th>
                                    <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Số địa chỉ đã lưu</th>
                                    <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right pr-6">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredUsers.map((user) => {
                                    const isAdmin = user.isAdmin || user.role === 'admin';
                                    const isSelf = currentUser?._id === user._id || currentUser?.id === user._id;
                                    return (
                                        <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                                            {/* Khách hàng (Avatar + Tên) */}
                                            <td className="p-4 pl-6">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm border ${
                                                        isAdmin 
                                                            ? 'bg-red-50 text-red-500 border-red-100' 
                                                            : 'bg-pink-50 text-[#FFB6C1] border-pink-100'
                                                    }`}>
                                                        {user.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-gray-800 text-sm block">{user.name}</span>
                                                        <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                                                            <Calendar size={10} /> Đăng ký: {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            
                                            {/* Liên hệ (Email + Số điện thoại) */}
                                            <td className="p-4">
                                                <div className="space-y-1">
                                                    <span className="text-xs text-gray-600 flex items-center gap-1.5">
                                                        <Mail size={12} className="text-gray-400" /> {user.email}
                                                    </span>
                                                    {user.phone ? (
                                                        <span className="text-xs text-gray-600 flex items-center gap-1.5">
                                                            <Phone size={12} className="text-gray-400" /> {user.phone}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-gray-300 italic">Chưa cập nhật số điện thoại</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Thông tin cá nhân (Ngày sinh + Giới tính) */}
                                            <td className="p-4">
                                                <div className="space-y-0.5 text-xs text-gray-600">
                                                    <p>Ngày sinh: {user.dob || <span className="text-gray-300 italic">Chưa có</span>}</p>
                                                    <p>Giới tính: {user.gender || <span className="text-gray-300 italic">Chưa có</span>}</p>
                                                </div>
                                            </td>

                                            {/* Vai trò */}
                                            <td className="p-4">
                                                {isAdmin ? (
                                                    <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-red-100 uppercase tracking-wide">
                                                        <Shield size={10} /> Quản trị viên
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 bg-gray-50 text-gray-600 text-[10px] font-medium px-2.5 py-1 rounded-full border border-gray-100 uppercase tracking-wide">
                                                        Khách hàng
                                                    </span>
                                                )}
                                            </td>

                                            {/* Số lượng địa chỉ đã lưu */}
                                            <td className="p-4">
                                                <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                                                    <MapPin size={12} className="text-[#FFB6C1]" /> {(user.addresses || []).length} địa chỉ
                                                </span>
                                            </td>

                                            {/* Thao tác (Xóa) */}
                                            <td className="p-4 text-right pr-6">
                                                {isSelf ? (
                                                    <span className="text-[10px] text-gray-400 italic">Tài khoản của bạn</span>
                                                ) : isAdmin ? (
                                                    <span className="text-[10px] text-gray-400 italic">Không thể xóa Admin khác</span>
                                                ) : confirmDeleteId === user._id ? (
                                                    <div className="flex items-center justify-end gap-1.5 animate-in fade-in duration-200">
                                                        <button 
                                                            onClick={() => setConfirmDeleteId(null)}
                                                            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded text-[10px] font-bold uppercase tracking-wider transition-colors"
                                                        >
                                                            Hủy
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteUser(user._id)}
                                                            className="px-2.5 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-[10px] font-bold uppercase tracking-wider shadow-sm transition-all"
                                                        >
                                                            Xác nhận xóa
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setConfirmDeleteId(user._id)}
                                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                        title="Xóa tài khoản khách hàng"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
