import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function ProfileInfo() {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        dob: user?.dob || '',
        gender: user?.gender || ''
    });

    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Cập nhật lại form nếu user trong Context thay đổi
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                dob: user.dob || '',
                gender: user.gender || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            dob: user?.dob || '',
            gender: user?.gender || ''
        });
        setIsEditing(false);
    };

    const handleSave = async () => {
        try {
            const userId = user._id || user.id;
            const response = await fetch(`/api/users/profile/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    dob: formData.dob,
                    gender: formData.gender
                })
            });

            const data = await response.json();
            if (response.ok && data.success) {
                updateUser(data);
                setIsEditing(false);
                toast.success("Cập nhật thông tin cá nhân thành công!");
            } else {
                toast.error(data.message || "Lỗi khi cập nhật thông tin");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin cá nhân:", error);
            toast.error("Không thể kết nối đến máy chủ");
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            toast.error("Vui lòng điền đầy đủ các trường mật khẩu!");
            return;
        }
        
        if (passwordData.newPassword.length < 6) {
            toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
            return;
        }
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
            return;
        }
        
        try {
            const userId = user._id || user.id;
            const response = await fetch(`/api/users/profile/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    password: passwordData.newPassword,
                    currentPassword: passwordData.currentPassword
                })
            });
            
            const data = await response.json();
            if (response.ok && data.success) {
                toast.success("Thay đổi mật khẩu thành công!");
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setShowPasswordForm(false);
            } else {
                toast.error(data.message || "Lỗi khi đổi mật khẩu");
            }
        } catch (error) {
            console.error("Lỗi khi đổi mật khẩu:", error);
            toast.error("Không thể kết nối đến máy chủ");
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-[#F1F1F1] p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-serif text-gray-800">Thông tin cá nhân</h2>
                {isEditing ? (
                    <div className="flex gap-2">
                        <button 
                            onClick={handleCancel}
                            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm hover:bg-gray-200 transition-colors"
                        >
                            Hủy
                        </button>
                        <button 
                            onClick={handleSave}
                            className="bg-[#2ECC71] text-white px-4 py-2 rounded-full text-sm hover:scale-105 transition-transform shadow-sm"
                        >
                            Lưu thay đổi
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="bg-[#8C5D5D] text-white px-4 py-2 rounded-full text-sm hover:scale-105 transition-transform shadow-sm"
                    >
                        Chỉnh sửa thông tin
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="border-b border-gray-100 pb-4">
                    <label className="block text-xs text-gray-400 mb-1">Họ và tên</label>
                    {isEditing ? (
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full text-sm text-gray-700 font-medium border rounded p-2 focus:outline-none focus:border-[#F472B6]" />
                    ) : (
                        <p className="text-sm text-gray-700 font-medium">{formData.name}</p>
                    )}
                </div>
                <div className="border-b border-gray-100 pb-4">
                    <label className="block text-xs text-gray-400 mb-1">Email</label>
                    {isEditing ? (
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full text-sm text-gray-700 font-medium border rounded p-2 focus:outline-none focus:border-[#F472B6] bg-gray-50" disabled />
                    ) : (
                        <p className="text-sm text-gray-700 font-medium">{formData.email}</p>
                    )}
                </div>
                <div className="border-b border-gray-100 pb-4">
                    <label className="block text-xs text-gray-400 mb-1">Số điện thoại</label>
                    {isEditing ? (
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full text-sm text-gray-700 font-medium border rounded p-2 focus:outline-none focus:border-[#F472B6]" placeholder="Nhập số điện thoại..." />
                    ) : (
                        <p className="text-sm text-gray-700 font-medium">
                            {formData.phone || <span className="text-gray-400 italic font-normal">Chưa cập nhật</span>}
                        </p>
                    )}
                </div>
                <div className="border-b border-gray-100 pb-4">
                    <label className="block text-xs text-gray-400 mb-1">Ngày sinh</label>
                    {isEditing ? (
                        <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full text-sm text-gray-700 font-medium border rounded p-2 focus:outline-none focus:border-[#F472B6]" />
                    ) : (
                        <p className="text-sm text-gray-700 font-medium">
                            {formData.dob || <span className="text-gray-400 italic font-normal">Chưa cập nhật</span>}
                        </p>
                    )}
                </div>
                <div className="border-b border-gray-100 pb-4 md:col-span-2 lg:col-span-1">
                    <label className="block text-xs text-gray-400 mb-1">Giới tính</label>
                    {isEditing ? (
                        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full text-sm text-gray-700 font-medium border rounded p-2 focus:outline-none focus:border-[#F472B6]">
                            <option value="">Chọn giới tính</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Nam">Nam</option>
                            <option value="Khác">Khác</option>
                        </select>
                    ) : (
                        <p className="text-sm text-gray-700 font-medium">
                            {formData.gender || <span className="text-gray-400 italic font-normal">Chưa cập nhật</span>}
                        </p>
                    )}
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 my-8"></div>
            
            {/* Khối Đổi Mật Khẩu */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800">Bảo mật tài khoản</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Thay đổi mật khẩu định kỳ để bảo vệ tài khoản tốt nhất</p>
                    </div>
                    <button 
                        type="button"
                        onClick={() => {
                            setShowPasswordForm(!showPasswordForm);
                            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                        }}
                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                            showPasswordForm 
                                ? 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200' 
                                : 'bg-[#FFB6C1]/10 text-[#FFB6C1] border-[#FFB6C1]/20 hover:bg-[#FFB6C1] hover:text-white'
                        }`}
                    >
                        {showPasswordForm ? 'Hủy bỏ' : 'Đổi mật khẩu'}
                    </button>
                </div>
                
                {showPasswordForm && (
                    <form onSubmit={handlePasswordChange} className="mt-6 bg-gray-50/50 rounded-2xl p-5 border border-gray-100 animate-in slide-in-from-top-4 duration-300 space-y-4 max-w-xl">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Mật khẩu hiện tại</label>
                            <input 
                                type="password" 
                                required
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                placeholder="Nhập mật khẩu hiện tại..."
                                className="sm:col-span-2 text-sm text-gray-700 font-medium border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#FFB6C1]/20 focus:border-[#FFB6C1] transition-all bg-white"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Mật khẩu mới</label>
                            <input 
                                type="password" 
                                required
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                placeholder="Tối thiểu 6 ký tự..."
                                className="sm:col-span-2 text-sm text-gray-700 font-medium border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#FFB6C1]/20 focus:border-[#FFB6C1] transition-all bg-white"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Xác nhận mật khẩu</label>
                            <input 
                                type="password" 
                                required
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                placeholder="Nhập lại mật khẩu mới..."
                                className="sm:col-span-2 text-sm text-gray-700 font-medium border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#FFB6C1]/20 focus:border-[#FFB6C1] transition-all bg-white"
                            />
                        </div>
                        
                        <div className="flex justify-end pt-2">
                            <button 
                                type="submit"
                                className="px-6 py-3 bg-[#FFB6C1] text-white hover:bg-[#734A4A] rounded-xl text-xs font-bold uppercase tracking-widest shadow-md hover:shadow-lg transition-all"
                            >
                                Xác nhận đổi mật khẩu
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
