import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OrderCard from './OrderCard';
import { Package } from 'lucide-react';
import { products } from '../../data/products'; // mock products to use in orders

export const MOCK_ORDERS = [
    {
        id: '#FLR-9021',
        status: 'Đang xử lý',
        date: '03/05/2026 14:30',
        total: 1250000,
        paymentMethod: 'Chuyển khoản',
        address: '123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM',
        phone: '0901234567',
        name: 'Nguyễn Văn A',
        items: [
            { ...products[0], quantity: 1 },
            { ...products[1], quantity: 1 }
        ]
    },
    {
        id: '#FLR-9020',
        status: 'Đang giao',
        date: '01/05/2026 09:15',
        total: 450000,
        paymentMethod: 'COD',
        address: '456 Đường Trần Hưng Đạo, Phường 2, Quận 5, TP.HCM',
        phone: '0901234567',
        name: 'Nguyễn Văn A',
        items: [
            { ...products[2], quantity: 1 }
        ]
    },
    {
        id: '#FLR-9019',
        status: 'Hoàn tất',
        date: '25/04/2026 16:45',
        total: 800000,
        paymentMethod: 'Thẻ tín dụng',
        address: '123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM',
        phone: '0901234567',
        name: 'Nguyễn Văn A',
        items: [
            { ...products[3], quantity: 2 }
        ]
    },
    {
        id: '#FLR-9018',
        status: 'Đã hủy',
        date: '20/04/2026 10:20',
        total: 550000,
        paymentMethod: 'COD',
        address: '123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM',
        phone: '0901234567',
        name: 'Nguyễn Văn A',
        items: [
            { ...products[4], quantity: 1 }
        ]
    }
];

export default function OrdersPage() {
    const [activeFilter, setActiveFilter] = useState('Tất cả');
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [toastMsg, setToastMsg] = useState('');

    const filters = ['Tất cả', 'Đang xử lý', 'Đang giao', 'Hoàn tất', 'Đã hủy'];

    useEffect(() => {
        // Mock fetch
        setIsLoading(true);
        setTimeout(() => {
            if (activeFilter === 'Tất cả') {
                setOrders(MOCK_ORDERS);
            } else {
                setOrders(MOCK_ORDERS.filter(o => o.status === activeFilter));
            }
            setIsLoading(false);
        }, 500);
    }, [activeFilter]);

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
                            <OrderCard key={order.id} order={order} showToast={showToast} />
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
