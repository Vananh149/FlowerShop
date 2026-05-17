import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

    return (
        <div className="bg-[#FDFCFB] min-h-screen py-12 md:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header Profile */}
                <div className="flex flex-col items-center mb-10 animate-[fadeIn_0.5s_ease-out]">
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-pink-100 text-[#FFB6C1] flex items-center justify-center text-4xl font-serif font-bold mb-4 shadow-sm border-4 border-white">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                            initial
                        )}
                    </div>
                    <h1 className="text-3xl font-serif text-[#333333] mb-1">{user?.name}</h1>
                    <p className="text-[#777777]">{user?.email}</p>
                </div>

                {/* Info Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#F1F1F1] p-6 md:p-10 mb-8 animate-[fadeInUp_0.7s_ease-out]">
                    <h2 className="text-xl font-serif text-[#333333] mb-6 border-b border-gray-100 pb-4">Thông tin cá nhân</h2>
                    
                    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                                <input 
                                    type="text" 
                                    defaultValue={user?.name}
                                    className="w-full bg-gray-50 rounded-lg px-4 py-3.5 text-sm text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] focus:bg-white transition-all border border-transparent focus:border-pink-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input 
                                    type="email" 
                                    defaultValue={user?.email}
                                    readOnly
                                    className="w-full bg-gray-100/70 rounded-lg px-4 py-3.5 text-sm text-gray-500 cursor-not-allowed border border-transparent"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                                <input 
                                    type="tel" 
                                    placeholder="Chưa cập nhật"
                                    className="w-full bg-gray-50 rounded-lg px-4 py-3.5 text-sm text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] focus:bg-white transition-all border border-transparent focus:border-pink-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                                <input 
                                    type="text" 
                                    placeholder="Chưa cập nhật"
                                    className="w-full bg-gray-50 rounded-lg px-4 py-3.5 text-sm text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] focus:bg-white transition-all border border-transparent focus:border-pink-200"
                                />
                            </div>
                        </div>

                        <div className="pt-6 flex justify-end">
                            <button className="bg-[#FFB6C1] text-white rounded-full px-8 py-3.5 font-medium tracking-wide shadow-md hover:bg-[#734A4A] transform hover:scale-105 transition-all duration-300 w-full sm:w-auto">
                                Cập nhật thông tin
                            </button>
                        </div>
                    </form>
                </div>

                {/* Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#F1F1F1] p-6 md:p-10 animate-[fadeInUp_0.9s_ease-out]">
                    <h2 className="text-xl font-serif text-[#333333] mb-6 border-b border-gray-100 pb-4">Quản lý tài khoản</h2>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="flex-1 py-3.5 px-6 bg-white border border-gray-200 rounded-full text-[#333333] font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm">
                            Đổi mật khẩu
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="flex-1 py-3.5 px-6 bg-red-50 text-red-500 rounded-full font-medium hover:bg-red-100 transition-colors shadow-sm"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>

            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
