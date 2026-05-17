import React, { useState, useEffect } from 'react';
import { 
    TrendingUp, 
    ShoppingBag, 
    Users, 
    Star, 
    RefreshCw, 
    ArrowUpRight, 
    ArrowDownRight, 
    DollarSign,
    ClipboardList,
    Flower2,
    Calendar,
    ChevronRight,
    Award
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        revenue: 0,
        ordersCount: 0,
        usersCount: 0,
        reviewsCount: 0,
        avgRating: 0,
        pendingOrders: 0
    });
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [maxChartVal, setMaxChartVal] = useState(1);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            // Gọi song song cả 4 API chính
            const [ordersRes, productsRes, usersRes, reviewsRes] = await Promise.all([
                fetch('/api/orders'),
                fetch('/api/products'),
                fetch('/api/users'),
                fetch('/api/reviews')
            ]);

            const ordersData = await ordersRes.json();
            const productsData = await productsRes.json();
            const usersJson = await usersRes.json();
            const reviewsData = await reviewsRes.json();

            const usersData = usersJson.success ? usersJson.data : [];

            setOrders(ordersData || []);
            setProducts(productsData || []);
            setUsers(usersData || []);
            setReviews(reviewsData || []);

            // 1. Tính toán Doanh thu (loại trừ đơn hủy)
            const activeOrders = (ordersData || []).filter(o => o.status !== 'Đã hủy');
            const totalRevenue = activeOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

            // 2. Số đơn chờ xác nhận
            const pending = (ordersData || []).filter(o => o.status === 'Chờ xác nhận').length;

            // 3. Đánh giá trung bình
            const totalRating = (reviewsData || []).reduce((sum, r) => sum + (r.rating || 0), 0);
            const avgRating = reviewsData.length > 0 ? (totalRating / reviewsData.length).toFixed(1) : 0;

            setStats({
                revenue: totalRevenue,
                ordersCount: ordersData.length,
                usersCount: usersData.length,
                reviewsCount: reviewsData.length,
                avgRating: parseFloat(avgRating),
                pendingOrders: pending
            });

            // 4. Phân tích Top sản phẩm bán chạy (Top Selling Products)
            const salesMap = {};
            activeOrders.forEach(order => {
                (order.items || []).forEach(item => {
                    const id = item.id || item.productId;
                    if (!id) return;
                    if (!salesMap[id]) {
                        salesMap[id] = {
                            name: item.name,
                            image: item.image,
                            quantity: 0,
                            revenue: 0
                        };
                    }
                    salesMap[id].quantity += item.quantity || 0;
                    salesMap[id].revenue += (item.price || 0) * (item.quantity || 0);
                });
            });

            const sortedTop = Object.values(salesMap)
                .sort((a, b) => b.quantity - a.quantity)
                .slice(0, 4);
            setTopProducts(sortedTop);

            // 5. Phân tích doanh thu 6 tháng gần nhất cho biểu đồ
            const monthNames = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
            const last6 = [];
            for (let i = 5; i >= 0; i--) {
                const d = new Date();
                d.setMonth(d.getMonth() - i);
                const monthIndex = d.getMonth();
                const year = d.getFullYear();
                const label = `${monthNames[monthIndex]}/${year}`;
                const key = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
                last6.push({ label, key, revenue: 0, orderCount: 0 });
            }

            ordersData.forEach(order => {
                if (order.status === 'Đã hủy') return;
                const date = new Date(order.createdAt || Date.now());
                const month = date.getMonth() + 1;
                const year = date.getFullYear();
                const key = `${year}-${String(month).padStart(2, '0')}`;
                
                const found = last6.find(m => m.key === key);
                if (found) {
                    found.revenue += order.totalAmount || 0;
                    found.orderCount += 1;
                }
            });

            setChartData(last6);
            const maxVal = Math.max(...last6.map(m => m.revenue), 1000000);
            setMaxChartVal(maxVal);

        } catch (error) {
            console.error("Lỗi đồng bộ Dashboard:", error);
            toast.error("Không thể kết nối đến máy chủ để tải dữ liệu Dashboard");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    // Helper vẽ đồ thị hình nêm SVG
    const getChartY = (revenue) => {
        const height = 140; // Chiều cao vẽ đồ thị (phút 30 đến 170)
        const valRatio = revenue / maxChartVal;
        return 170 - (valRatio * height);
    };

    const points = chartData.map((d, i) => {
        const x = 50 + i * 80;
        const y = getChartY(d.revenue);
        return { x, y };
    });

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = points.length > 0 
        ? `${linePath} L ${points[points.length - 1].x} 170 L ${points[0].x} 170 Z` 
        : '';

    // Phân tích trạng thái đơn hàng
    const getStatusPercentage = (status) => {
        if (orders.length === 0) return 0;
        const count = orders.filter(o => o.status === status).length;
        return ((count / orders.length) * 100).toFixed(0);
    };

    const getStatusCount = (status) => {
        return orders.filter(o => o.status === status).length;
    };

    // Lấy 5 đơn hàng mới nhất
    const recentOrders = [...orders]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
            {/* Header */}
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-serif text-gray-800">Tổng quan kinh doanh</h1>
                    <p className="text-xs text-gray-400 mt-1">Theo dõi các chỉ số quan trọng, doanh thu, bán hàng của Floré shop</p>
                </div>
                <button 
                    onClick={loadDashboardData}
                    className="p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm hover:bg-pink-50 hover:text-[#FFB6C1] transition-all flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider"
                >
                    <RefreshCw size={14} className={loading ? "animate-spin text-[#FFB6C1]" : ""} />
                    {loading ? "Đang cập nhật..." : "Làm mới dữ liệu"}
                </button>
            </div>

            {loading ? (
                <div className="py-32 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <RefreshCw className="animate-spin text-[#FFB6C1] mx-auto w-10 h-10 mb-4" />
                    <p className="text-sm text-gray-400">Đang tải và tổng hợp dữ liệu kinh doanh...</p>
                </div>
            ) : (
                <>
                    {/* Stat Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Stat Card 1: Doanh thu */}
                        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.03] text-pink-500 group-hover:scale-110 transition-transform duration-500">
                                <DollarSign size={140} />
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Doanh thu tổng</span>
                                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-[#FFB6C1]">
                                    <DollarSign size={20} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xl lg:text-2xl font-bold font-serif text-gray-800 break-words">
                                    {stats.revenue.toLocaleString('vi-VN')}đ
                                </p>
                                <p className="text-[10px] text-emerald-500 flex items-center gap-1 font-semibold">
                                    <TrendingUp size={12} /> Hoạt động hiệu quả
                                </p>
                            </div>
                        </div>

                        {/* Stat Card 2: Đơn hàng */}
                        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.03] text-blue-500 group-hover:scale-110 transition-transform duration-500">
                                <ShoppingBag size={140} />
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Đơn hàng</span>
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-400">
                                    <ShoppingBag size={20} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xl lg:text-2xl font-bold font-serif text-gray-800">
                                    {stats.ordersCount} đơn
                                </p>
                                <p className="text-[10px] text-amber-500 font-semibold flex items-center gap-1">
                                    • {stats.pendingOrders} đơn đang chờ xác nhận
                                </p>
                            </div>
                        </div>

                        {/* Stat Card 3: Khách hàng */}
                        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.03] text-indigo-500 group-hover:scale-110 transition-transform duration-500">
                                <Users size={140} />
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tài khoản</span>
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-400">
                                    <Users size={20} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xl lg:text-2xl font-bold font-serif text-gray-800">
                                    {stats.usersCount} khách
                                </p>
                                <p className="text-[10px] text-indigo-500 font-semibold">
                                    • Tài khoản đã đăng ký
                                </p>
                            </div>
                        </div>

                        {/* Stat Card 4: Đánh giá */}
                        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.03] text-amber-500 group-hover:scale-110 transition-transform duration-500">
                                <Star size={140} />
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Đánh giá trung bình</span>
                                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-400">
                                    <Star size={20} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xl lg:text-2xl font-bold font-serif text-gray-800 flex items-center gap-1.5">
                                    {stats.avgRating} <span className="text-sm text-gray-400">/ 5.0</span>
                                </p>
                                <p className="text-[10px] text-amber-500 font-semibold flex items-center gap-0.5">
                                    ★ Thống kê từ {stats.reviewsCount} đánh giá
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Chart & Order status columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* SVG Revenue Chart */}
                        <div className="bg-white border border-gray-100 rounded-3xl p-6 lg:p-8 shadow-sm lg:col-span-2 flex flex-col justify-between">
                            <div className="mb-4">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Xu hướng bán hàng</span>
                                <h3 className="text-base font-semibold text-gray-800 mt-0.5">Doanh thu 6 tháng gần nhất</h3>
                            </div>
                            
                            {/* SVG Chart area */}
                            <div className="relative w-full h-48 flex items-center justify-center">
                                <svg viewBox="0 0 500 200" className="w-full h-full">
                                    {/* Gradients */}
                                    <defs>
                                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#FFB6C1" stopOpacity="0.4" />
                                            <stop offset="100%" stopColor="#FFB6C1" stopOpacity="0.0" />
                                        </linearGradient>
                                    </defs>

                                    {/* Gridlines */}
                                    <line x1="50" y1="30" x2="450" y2="30" stroke="#F1F1F1" strokeWidth="1" strokeDasharray="4,4" />
                                    <line x1="50" y1="100" x2="450" y2="100" stroke="#F1F1F1" strokeWidth="1" strokeDasharray="4,4" />
                                    <line x1="50" y1="170" x2="450" y2="170" stroke="#E5E7EB" strokeWidth="1" />

                                    {/* Line & Area */}
                                    {points.length > 0 && (
                                        <>
                                            <path d={areaPath} fill="url(#areaGradient)" />
                                            <path d={linePath} fill="none" stroke="#FFB6C1" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </>
                                    )}

                                    {/* Glowing dots & Hover Labels */}
                                    {points.map((p, i) => (
                                        <g key={i} className="group/dot cursor-pointer">
                                            {/* Hover overlay text */}
                                            <text 
                                                x={p.x} 
                                                y={p.y - 12} 
                                                textAnchor="middle" 
                                                className="opacity-0 group-hover/dot:opacity-100 transition-opacity bg-gray-800 text-[10px] font-bold fill-[#8C5D5D]"
                                            >
                                                {(chartData[i].revenue / 1000000).toFixed(1)}M
                                            </text>
                                            
                                            {/* Glowing circle outer */}
                                            <circle cx={p.x} cy={p.y} r="8" fill="#FFB6C1" className="opacity-0 group-hover/dot:opacity-30 transition-all duration-300 scale-120" />
                                            
                                            {/* Dot inner */}
                                            <circle cx={p.x} cy={p.y} r="4" fill="#ffffff" stroke="#FFB6C1" strokeWidth="2.5" />
                                        </g>
                                    ))}

                                    {/* Labels X axis */}
                                    {chartData.map((d, i) => (
                                        <text key={i} x={50 + i * 80} y="190" textAnchor="middle" className="text-[10px] fill-gray-400 font-medium">
                                            {d.label}
                                        </text>
                                    ))}
                                </svg>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-50 flex-wrap gap-4">
                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <span className="w-3 h-3 rounded-full bg-[#FFB6C1]"></span>
                                    <span>Doanh số (VNĐ)</span>
                                </div>
                                <span className="text-[10px] text-gray-400 italic">Đơn vị hiển thị: Triệu VNĐ (M)</span>
                            </div>
                        </div>

                        {/* Order status breakdown */}
                        <div className="bg-white border border-gray-100 rounded-3xl p-6 lg:p-8 shadow-sm flex flex-col justify-between">
                            <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Trạng thái vận hành</span>
                                <h3 className="text-base font-semibold text-gray-800 mt-0.5">Trạng thái đơn hàng</h3>
                            </div>

                            <div className="space-y-4 my-6">
                                {/* Chờ xác nhận */}
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center text-xs font-semibold">
                                        <span className="text-amber-600">Chờ xác nhận</span>
                                        <span className="text-gray-500">{getStatusCount('Chờ xác nhận')} đơn ({getStatusPercentage('Chờ xác nhận')}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-50 rounded-full h-2">
                                        <div className="bg-amber-400 h-2 rounded-full transition-all duration-500" style={{ width: `${getStatusPercentage('Chờ xác nhận')}%` }}></div>
                                    </div>
                                </div>

                                {/* Chờ lấy hàng */}
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center text-xs font-semibold">
                                        <span className="text-orange-600">Chờ lấy hàng</span>
                                        <span className="text-gray-500">{getStatusCount('Chờ lấy hàng')} đơn ({getStatusPercentage('Chờ lấy hàng')}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-50 rounded-full h-2">
                                        <div className="bg-orange-400 h-2 rounded-full transition-all duration-500" style={{ width: `${getStatusPercentage('Chờ lấy hàng')}%` }}></div>
                                    </div>
                                </div>

                                {/* Đang giao */}
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center text-xs font-semibold">
                                        <span className="text-blue-600">Đang giao hàng</span>
                                        <span className="text-gray-500">{getStatusCount('Đang giao')} đơn ({getStatusPercentage('Đang giao')}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-50 rounded-full h-2">
                                        <div className="bg-blue-400 h-2 rounded-full transition-all duration-500" style={{ width: `${getStatusPercentage('Đang giao')}%` }}></div>
                                    </div>
                                </div>

                                {/* Đã giao */}
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center text-xs font-semibold">
                                        <span className="text-emerald-600">Đã giao thành công</span>
                                        <span className="text-gray-500">{getStatusCount('Đã giao')} đơn ({getStatusPercentage('Đã giao')}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-50 rounded-full h-2">
                                        <div className="bg-emerald-400 h-2 rounded-full transition-all duration-500" style={{ width: `${getStatusPercentage('Đã giao')}%` }}></div>
                                    </div>
                                </div>

                                {/* Đã hủy */}
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center text-xs font-semibold">
                                        <span className="text-red-600">Đã hủy</span>
                                        <span className="text-gray-500">{getStatusCount('Đã hủy')} đơn ({getStatusPercentage('Đã hủy')}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-50 rounded-full h-2">
                                        <div className="bg-red-400 h-2 rounded-full transition-all duration-500" style={{ width: `${getStatusPercentage('Đã hủy')}%` }}></div>
                                    </div>
                                </div>
                            </div>

                            <p className="text-[10px] text-gray-400 text-center italic border-t border-gray-50 pt-3">
                                Luôn theo dõi đơn hàng để nâng cao tỷ lệ hoàn thành
                            </p>
                        </div>
                    </div>

                    {/* Bottom grid (Recent orders & top products) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* 5 Recent orders */}
                        <div className="bg-white border border-gray-100 rounded-3xl p-6 lg:p-8 shadow-sm lg:col-span-2 space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Đơn hàng mới</span>
                                    <h3 className="text-base font-semibold text-gray-800 mt-0.5">Danh sách đơn hàng vừa đặt</h3>
                                </div>
                                <a 
                                    href="/admin/orders" 
                                    className="text-xs font-bold text-[#FFB6C1] hover:text-[#734A4A] flex items-center gap-1 transition-colors uppercase tracking-wider"
                                >
                                    Xem tất cả <ChevronRight size={14} />
                                </a>
                            </div>

                            {recentOrders.length === 0 ? (
                                <div className="py-12 text-center text-gray-400 text-xs">
                                    Chưa có đơn hàng nào trong hệ thống
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse text-xs">
                                        <thead>
                                            <tr className="border-b border-gray-100 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                <th className="py-3">Khách</th>
                                                <th className="py-3">Ngày đặt</th>
                                                <th className="py-3">Sản phẩm</th>
                                                <th className="py-3">Tổng tiền</th>
                                                <th className="py-3 text-right">Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {recentOrders.map((order) => (
                                                <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="py-3.5 font-semibold text-gray-800">
                                                        {order.name || "Khách vãng lai"}
                                                    </td>
                                                    <td className="py-3.5 text-gray-500">
                                                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                                    </td>
                                                    <td className="py-3.5 text-gray-600 max-w-[150px] truncate" title={(order.items || []).map(i => i.name).join(', ')}>
                                                        {(order.items || []).map(i => `${i.name} x${i.quantity}`).join(', ')}
                                                    </td>
                                                    <td className="py-3.5 font-bold text-[#8C5D5D]">
                                                        {(order.totalAmount || 0).toLocaleString('vi-VN')}đ
                                                    </td>
                                                    <td className="py-3.5 text-right">
                                                        <span className={`inline-flex px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${
                                                            order.status === 'Đã giao' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                            order.status === 'Đã hủy' ? 'bg-red-50 text-red-700 border-red-100' :
                                                            order.status === 'Đang giao' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                            'bg-amber-50 text-amber-700 border-amber-100 animate-pulse'
                                                        }`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Top Selling Products */}
                        <div className="bg-white border border-gray-100 rounded-3xl p-6 lg:p-8 shadow-sm flex flex-col justify-between space-y-4">
                            <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bảng vàng sản phẩm</span>
                                <h3 className="text-base font-semibold text-gray-800 mt-0.5">Mẫu hoa bán chạy nhất</h3>
                            </div>

                            <div className="divide-y divide-gray-50 flex-1 flex flex-col justify-center">
                                {topProducts.length === 0 ? (
                                    <div className="py-12 text-center text-gray-400 text-xs">
                                        Chưa có số liệu phân tích bán hàng
                                    </div>
                                ) : (
                                    topProducts.map((p, idx) => (
                                        <div key={idx} className="flex items-center gap-3 py-3 hover:bg-gray-50/50 transition-all rounded-2xl px-2">
                                            {/* Rank circle */}
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                                                idx === 0 ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                idx === 1 ? 'bg-slate-50 text-slate-500 border-slate-100' :
                                                idx === 2 ? 'bg-amber-50/40 text-amber-700/80 border-amber-100/40' :
                                                'bg-gray-50 text-gray-400 border-gray-100'
                                            }`}>
                                                {idx + 1}
                                            </div>

                                            {/* Product Image */}
                                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                                                <img src={p.image || "https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=200"} alt={p.name} className="w-full h-full object-cover" />
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0 text-xs">
                                                <span className="font-semibold text-gray-800 truncate block">{p.name}</span>
                                                <span className="text-[10px] text-gray-400">Đã bán {p.quantity} bó hoa</span>
                                            </div>

                                            {/* Total revenue */}
                                            <div className="text-right text-xs">
                                                <span className="font-bold text-gray-800 block">{(p.revenue).toLocaleString('vi-VN')}đ</span>
                                                <span className="text-[9px] text-[#FFB6C1] font-bold uppercase tracking-wider">Doanh thu</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="pt-3 border-t border-gray-50 flex items-center gap-2 text-[10px] text-gray-400 justify-center">
                                <Award size={14} className="text-amber-500" />
                                <span>Phân tích dựa trên doanh số thực tế</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
