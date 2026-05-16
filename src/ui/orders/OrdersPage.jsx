import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import OrderCard from './OrderCard';
import { Package } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function OrdersPage() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const filterParam = queryParams.get('filter');

    const [activeFilter, setActiveFilter] = useState(filterParam || 'Tất cả');
    const [toastMsg, setToastMsg] = useState('');
    const filters = ['Tất cả', 'Chờ xác nhận', 'Chờ lấy hàng', 'Đang giao', 'Đã giao', 'Đã hủy'];

    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [reviewedOrders, setReviewedOrders] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        if (filterParam) {
            setActiveFilter(filterParam);
        }
    }, [filterParam]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // 1. Fetch real orders from API
                if (user) {
                    const userId = user._id || user.id;
                    const response = await fetch(`http://localhost:5000/api/orders/myorders/${userId}`);
                    const data = await response.json();
                    
                    // Chuẩn hóa dữ liệu để phù hợp với OrderCard (ví dụ: totalAmount -> total)
                    const normalizedOrders = data.map(order => ({
                        ...order,
                        id: order._id || order.id, // Sử dụng ID của MongoDB
                        total: order.totalAmount, // Map lại trường cho đúng với giao diện cũ
                        date: new Date(order.createdAt).toLocaleString('vi-VN')
                    }));

                    if (activeFilter === 'Tất cả') {
                        setOrders(normalizedOrders);
                    } else {
                        setOrders(normalizedOrders.filter(o => o.status === activeFilter));
                    }
                }

                // 2. Fetch reviewed order IDs from API
                if (user) {
                    const userId = user._id || user.id;
                    const response = await fetch(`http://localhost:5000/api/reviews/user/${userId}`);
                    const reviewedIds = await response.json();
                    setReviewedOrders(reviewedIds);
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu đơn hàng:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [activeFilter, user]);

    const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(''), 3000);
    };

    return (
        <div className="bg-[#FDFCFB] min-h-screen py-10">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-2xl font-serif text-gray-800 mb-6">Đơn hàng của tôi</h1>
                
                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {filters.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-1.5 rounded-full text-sm transition-all duration-300 font-medium ${
                                activeFilter === filter
                                    ? 'bg-[#FDECEC] text-[#8C5D5D]'
                                    : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-2xl p-5 border border-[#F1F1F1] shadow-sm animate-pulse">
                                <div className="flex justify-between mb-4">
                                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                                    <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
                                </div>
                                <div className="flex gap-4 mb-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                                    <div className="space-y-2 flex-1">
                                        <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
                                        <div className="w-1/4 h-3 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                                <div className="flex justify-between border-t pt-4">
                                    <div className="w-24 h-5 bg-gray-200 rounded"></div>
                                    <div className="flex gap-2">
                                        <div className="w-20 h-8 bg-gray-200 rounded-full"></div>
                                        <div className="w-20 h-8 bg-gray-200 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <OrderCard 
                                key={order.id} 
                                order={order} 
                                showToast={showToast} 
                                isReviewed={reviewedOrders.includes(order.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-[#F1F1F1] shadow-sm p-12 text-center flex flex-col items-center animate-in fade-in duration-500">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Package className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Bạn chưa có đơn hàng nào</h3>
                        <p className="text-sm text-gray-500 mb-6">Trạng thái "{activeFilter}" hiện không có đơn hàng. Hãy chọn cho mình những sản phẩm yêu thích nhé!</p>
                        <Link 
                            to="/shop"
                            className="px-6 py-3 bg-[#8C5D5D] text-white rounded-full hover:scale-105 transition-transform font-medium shadow-sm"
                        >
                            Mua ngay
                        </Link>
                    </div>
                )}
            </div>

            {toastMsg && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {toastMsg}
                </div>
            )}
        </div>
    );
}
