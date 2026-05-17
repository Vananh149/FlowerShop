import React from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    ClipboardList, 
    Flower2, 
    Star, 
    LogOut, 
    ChevronRight,
    User,
    ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [pendingCount, setPendingCount] = React.useState(0);

    // Lấy số lượng đơn hàng đang chờ xử lý
    React.useEffect(() => {
        const fetchPendingCount = async () => {
            try {
                const response = await fetch('/api/orders');
                const data = await response.json();
                const count = data.filter(o => o.status === 'Chờ xác nhận').length;
                setPendingCount(count);
            } catch (error) {
                console.error("Lỗi khi đếm đơn hàng:", error);
            }
        };
        fetchPendingCount();
        // Cập nhật lại mỗi 30 giây
        const interval = setInterval(fetchPendingCount, 30000);
        return () => clearInterval(interval);
    }, []);

    const menuItems = [
        { name: 'Tổng quan', path: '/admin', icon: <LayoutDashboard size={20} /> },
        { name: 'Quản lý đơn hàng', path: '/admin/orders', icon: <ClipboardList size={20} />, badge: pendingCount },
        { name: 'Quản lý sản phẩm', path: '/admin/products', icon: <Flower2 size={20} /> },
        { name: 'Quản lý đánh giá', path: '/admin/reviews', icon: <Star size={20} /> },
        { name: 'Thông tin cá nhân', path: '/admin/profile', icon: <User size={20} /> },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-[#F8F9FA]">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen z-50">
                {/* Logo Admin */}
                <div className="p-6 border-b border-gray-50">
                    <Link to="/admin" className="flex flex-col">
                        <span className="text-2xl font-serif tracking-[0.2em] text-[#FFB6C1] font-bold uppercase">
                            Floré
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium tracking-widest mt-1">
                            KÊNH NGƯỜI BÁN
                        </span>
                    </Link>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/admin'}
                            className={({ isActive }) => `
                                flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group
                                ${isActive 
                                    ? 'bg-pink-50 text-[#FFB6C1] font-semibold shadow-sm' 
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-gray-400 group-hover:text-gray-600">
                                    {item.icon}
                                </span>
                                <span className="text-sm">{item.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {item.badge > 0 && (
                                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm animate-bounce">
                                        {item.badge}
                                    </span>
                                )}
                                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </NavLink>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-gray-50 space-y-2">
                    <Link 
                        to="/" 
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-500 hover:text-[#8C5D5D] transition-colors rounded-xl hover:bg-gray-50"
                    >
                        <ArrowLeft size={18} />
                        <span>Về trang bán hàng</span>
                    </Link>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-50 hover:text-red-600 transition-all duration-300 rounded-xl"
                    >
                        <LogOut size={18} />
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
                {/* Admin Top Header */}
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-end px-8 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-semibold text-gray-800">{user?.name || 'Admin'}</p>
                            <p className="text-[10px] text-[#FFB6C1] font-bold uppercase tracking-wider">Quản trị viên</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-[#FFB6C1] font-bold border-2 border-white shadow-sm">
                            {user?.name ? user.name.charAt(0).toUpperCase() : <User size={20} />}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
