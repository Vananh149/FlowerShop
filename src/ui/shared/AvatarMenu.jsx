import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, Heart, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function AvatarMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const menuRef = useRef(null);

    // Lấy chữ cái đầu tiên của tên để làm ảnh đại diện mặc định
    const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

    // Click ra ngoài để đóng menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate('/login');
    };

    return (
        <div className="relative" ref={menuRef}>
            {/* Avatar Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-pink-100 text-[#FFB6C1] font-serif font-bold hover:scale-105 hover:shadow-sm transition-all focus:outline-none"
            >
                {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                    initial
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-[fadeInScale_0.2s_ease-out] origin-top-right">
                    
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                        <Link 
                            to="/profile" 
                            onClick={() => setIsOpen(false)}
                            className="flex items-center px-4 py-2.5 text-sm text-[#777777] hover:bg-gray-50 hover:text-[#FFB6C1] transition-colors"
                        >
                            <User className="w-4 h-4 mr-3" />
                            Tài khoản của tôi
                        </Link>
                        <Link 
                            to="/orders" 
                            onClick={() => setIsOpen(false)}
                            className="flex items-center px-4 py-2.5 text-sm text-[#777777] hover:bg-gray-50 hover:text-[#FFB6C1] transition-colors"
                        >
                            <Package className="w-4 h-4 mr-3" />
                            Đơn hàng
                        </Link>
                        <Link 
                            to="/wishlist" 
                            onClick={() => setIsOpen(false)}
                            className="flex items-center px-4 py-2.5 text-sm text-[#777777] hover:bg-gray-50 hover:text-[#FFB6C1] transition-colors"
                        >
                            <Heart className="w-4 h-4 mr-3" />
                            Yêu thích
                        </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-50 py-1 mt-1">
                        <button 
                            onClick={handleLogout}
                            className="flex w-full items-center px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="w-4 h-4 mr-3" />
                            Đăng xuất
                        </button>
                    </div>
                </div>
            )}
            
            <style>{`
                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
}
