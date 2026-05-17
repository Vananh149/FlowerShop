import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ShoppingBag, Heart, LogOut, MapPin, MessageSquare } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function AvatarMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const [hasNewReply, setHasNewReply] = useState(false);

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

    // Kiểm tra phản hồi mới từ Admin để thông báo cho khách hàng
    useEffect(() => {
        if (!user?.email) return;

        const checkNewReplies = async () => {
            try {
                const response = await fetch('/api/contacts');
                const data = await response.json();
                if (response.ok && data.success) {
                    const userMessages = (data.data || []).filter(
                        c => c.email.trim().toLowerCase() === user.email.trim().toLowerCase()
                    );
                    
                    const repliedMessages = userMessages.filter(c => c.isReplied);
                    
                    if (repliedMessages.length > 0) {
                        const latestReplied = repliedMessages[0]; // Vì đã sắp xếp desc ở backend
                        const lastSeenId = localStorage.getItem(`seen_reply_${user._id || user.id}`);
                        
                        if (lastSeenId !== latestReplied._id) {
                            setHasNewReply(true);
                            
                            // Chỉ thông báo toast 1 lần duy nhất trong phiên làm việc của user (session)
                            const sessionNotified = sessionStorage.getItem(`login_notified_${user._id || user.id}`);
                            if (!sessionNotified) {
                                toast.custom((t) => (
                                    <div className={`${t.visible ? 'animate-in fade-in slide-in-from-bottom-5' : 'animate-out fade-out'} max-w-sm w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 p-4 border border-pink-100 z-50`}>
                                        <div className="flex-1 w-0 text-left">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 pt-0.5">
                                                    <div className="w-9 h-9 rounded-full bg-pink-50 flex items-center justify-center text-sm">
                                                        💬
                                                    </div>
                                                </div>
                                                <div className="ml-3 flex-1">
                                                    <p className="text-xs font-bold text-gray-900">Thông báo từ Floré</p>
                                                    <p className="mt-0.5 text-[11px] text-gray-500 leading-normal">
                                                        Chào {user.name}! Bạn có phản hồi mới từ Shop trong Hộp thư liên hệ.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex border-l border-gray-100 ml-3 pl-3 items-center">
                                            <button
                                                onClick={() => {
                                                    toast.dismiss(t.id);
                                                    navigate('/profile', { state: { tab: 'contacts' } });
                                                }}
                                                className="text-xs font-bold text-[#FFB6C1] hover:text-[#734A4A] transition-colors focus:outline-none whitespace-nowrap"
                                            >
                                                Xem ngay
                                            </button>
                                        </div>
                                    </div>
                                ), { duration: 8000, position: 'bottom-right' });
                                
                                sessionStorage.setItem(`login_notified_${user._id || user.id}`, 'true');
                            }
                        } else {
                            setHasNewReply(false);
                        }
                    } else {
                        setHasNewReply(false);
                    }
                }
            } catch (error) {
                console.error("Lỗi khi kiểm tra phản hồi mới:", error);
            }
        };

        checkNewReplies();
        const interval = setInterval(checkNewReplies, 30000); // 30 giây check 1 lần
        return () => clearInterval(interval);
    }, [user?.email, user?._id, user?.id]);

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
                className="flex items-center justify-center w-9 h-9 rounded-full bg-pink-100 text-[#FFB6C1] font-serif font-bold hover:scale-105 hover:shadow-sm transition-all focus:outline-none relative"
            >
                {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                    initial
                )}
                {/* Dấu chấm thông báo trên Avatar */}
                {hasNewReply && (
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-red-500 border border-white animate-pulse"></span>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-[fadeInScale_0.2s_ease-out] origin-top-right">
                    
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-50 text-left">
                        <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1 text-left">
                        <Link 
                            to="/profile" 
                            state={{ tab: 'info' }}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center px-4 py-2.5 text-sm text-[#777777] hover:bg-gray-50 hover:text-[#FFB6C1] transition-colors"
                        >
                            <User className="w-4 h-4 mr-3" />
                            Thông tin cá nhân
                        </Link>
                        <Link 
                            to="/orders" 
                            onClick={() => setIsOpen(false)}
                            className="flex items-center px-4 py-2.5 text-sm text-[#777777] hover:bg-gray-50 hover:text-[#FFB6C1] transition-colors"
                        >
                            <ShoppingBag className="w-4 h-4 mr-3" />
                            Đơn hàng của tôi
                        </Link>
                        <Link 
                            to="/profile" 
                            state={{ tab: 'address' }}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center px-4 py-2.5 text-sm text-[#777777] hover:bg-gray-50 hover:text-[#FFB6C1] transition-colors"
                        >
                            <MapPin className="w-4 h-4 mr-3" />
                            Địa chỉ
                        </Link>
                        <Link 
                            to="/profile" 
                            state={{ tab: 'contacts' }}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center px-4 py-2.5 text-sm text-[#777777] hover:bg-gray-50 hover:text-[#FFB6C1] transition-colors relative"
                        >
                            <MessageSquare className="w-4 h-4 mr-3" />
                            Hộp thư liên hệ
                            {hasNewReply && (
                                <span className="absolute right-4 w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                            )}
                            {hasNewReply && (
                                <span className="absolute right-4 w-2 h-2 rounded-full bg-red-500"></span>
                            )}
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
                    <div className="border-t border-gray-50 py-1 mt-1 text-left">
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
