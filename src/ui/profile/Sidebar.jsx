import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { User, ShoppingBag, MapPin, Heart, LogOut } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, handleLogout }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

    const menuItems = [
        { id: 'info', label: 'Thông tin cá nhân', icon: User },
        { id: 'orders', label: 'Đơn hàng của tôi', icon: ShoppingBag },
        { id: 'address', label: 'Địa chỉ', icon: MapPin },
        { id: 'wishlist', label: 'Yêu thích', icon: Heart },
    ];

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F1F1F1] h-fit">
            <div className="flex flex-col items-center border-b border-gray-100 pb-6 mb-4">
                <div className="w-20 h-20 rounded-full bg-pink-100 text-[#FFB6C1] flex items-center justify-center text-3xl font-serif font-bold mb-3 shadow-sm">
                    {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                        initial
                    )}
                </div>
                <h3 className="font-semibold text-gray-800 text-center">{user?.name || 'Khách hàng'}</h3>
                <p className="text-xs text-gray-400 text-center mt-1">Thành viên thân thiết</p>
            </div>

            <nav className="flex flex-col gap-2">
                {menuItems.map(item => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                if (item.id === 'wishlist') {
                                    navigate('/wishlist');
                                } else if (item.id === 'orders') {
                                    navigate('/orders');
                                } else {
                                    if (setActiveTab) setActiveTab(item.id);
                                    navigate('/profile', { state: { tab: item.id } });
                                }
                            }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 w-full text-left ${
                                activeTab === item.id 
                                    ? 'bg-[#FDECEC] text-[#8C5D5D] font-medium' 
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-sm">{item.label}</span>
                        </button>
                    );
                })}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-50 transition-all duration-300 mt-2 w-full text-left"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm">Đăng xuất</span>
                </button>
            </nav>
        </div>
    );
}
