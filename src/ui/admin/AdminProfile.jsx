import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, ShieldCheck, Lock, Save, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminProfile() {
    const { user } = useAuth();
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return toast.error("Mật khẩu mới không khớp!");
        }
        
        // Giả lập API đổi mật khẩu (Bạn có thể làm thêm BE sau)
        toast.success("Đã cập nhật mật khẩu thành công!");
        setIsChangingPassword(false);
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    return (
        <div className="max-w-4xl animate-[fadeIn_0.5s_ease-out]">
            <h1 className="text-3xl font-serif text-gray-800 mb-8">Thông tin cá nhân</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Avatar & Basic Info Card */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
                        <div className="w-24 h-24 rounded-full bg-pink-50 flex items-center justify-center text-[#FFB6C1] text-4xl font-serif font-bold mx-auto mb-4 border-4 border-white shadow-md">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
                        <p className="text-xs text-[#FFB6C1] font-bold uppercase tracking-widest mt-1">Quản trị viên</p>
                        
                        <div className="mt-8 pt-8 border-t border-gray-50 flex flex-col gap-4 text-left">
                            <div className="flex items-center gap-3 text-gray-500">
                                <Mail size={18} className="text-gray-300" />
                                <span className="text-sm">{user?.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-500">
                                <ShieldCheck size={18} className="text-gray-300" />
                                <span className="text-sm">Quyền: Toàn phần</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Settings */}
                <div className="md:col-span-2 space-y-6">
                    {/* General Settings */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-pink-50 rounded-xl text-[#FFB6C1]">
                                <User size={20} />
                            </div>
                            <h3 className="font-bold text-gray-800">Cài đặt tài khoản</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Họ và tên</label>
                                <input 
                                    type="text" value={user?.name} disabled
                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm text-gray-400 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Email đăng nhập</label>
                                <input 
                                    type="email" value={user?.email} disabled
                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm text-gray-400 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Change Password */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 transition-all">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-50 rounded-xl text-orange-400">
                                    <Lock size={20} />
                                </div>
                                <h3 className="font-bold text-gray-800">Bảo mật & Mật khẩu</h3>
                            </div>
                            {!isChangingPassword && (
                                <button 
                                    onClick={() => setIsChangingPassword(true)}
                                    className="text-xs font-bold text-[#FFB6C1] hover:underline uppercase tracking-wider"
                                >
                                    Đổi mật khẩu
                                </button>
                            )}
                        </div>

                        {isChangingPassword ? (
                            <form onSubmit={handlePasswordChange} className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Mật khẩu hiện tại</label>
                                    <div className="relative">
                                        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                        <input 
                                            required type="password" value={passwords.currentPassword}
                                            onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                                            className="w-full bg-gray-50 border-none rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-orange-100 outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Mật khẩu mới</label>
                                        <input 
                                            required type="password" value={passwords.newPassword}
                                            onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-100 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Xác nhận mật khẩu</label>
                                        <input 
                                            required type="password" value={passwords.confirmPassword}
                                            onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-100 outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button 
                                        type="button" onClick={() => setIsChangingPassword(false)}
                                        className="flex-1 py-3 bg-gray-100 rounded-xl text-gray-500 font-bold text-xs uppercase"
                                    >
                                        Hủy
                                    </button>
                                    <button 
                                        type="submit"
                                        className="flex-1 py-3 bg-orange-400 text-white rounded-xl font-bold text-xs uppercase shadow-md flex items-center justify-center gap-2"
                                    >
                                        <Save size={16} /> Lưu mật khẩu
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <p className="text-sm text-gray-400 italic">Nhấn đổi mật khẩu để cập nhật bảo mật cho tài khoản của bạn.</p>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
