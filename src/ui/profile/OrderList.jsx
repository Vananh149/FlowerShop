import React from 'react';

export default function OrderList() {
    // Mock recent orders
    const orders = [
        { id: '#98724105', date: '15/05/2026', status: 'Đang giao', total: 450000 },
        { id: '#88724104', date: '10/05/2026', status: 'Hoàn tất', total: 1250000 },
        { id: '#78724103', date: '01/05/2026', status: 'Hoàn tất', total: 350000 },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-[#F1F1F1] p-6 lg:p-8 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-serif text-gray-800">Đơn hàng gần đây</h2>
                <button className="text-sm text-gray-400 hover:text-[#8C5D5D] transition-colors">
                    Xem tất cả
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="py-3 font-medium text-xs text-gray-400 uppercase tracking-wider">Mã đơn</th>
                            <th className="py-3 font-medium text-xs text-gray-400 uppercase tracking-wider">Ngày đặt</th>
                            <th className="py-3 font-medium text-xs text-gray-400 uppercase tracking-wider">Trạng thái</th>
                            <th className="py-3 font-medium text-xs text-gray-400 uppercase tracking-wider text-right">Tổng tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, idx) => (
                            <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                                <td className="py-4 text-sm text-gray-800 font-medium group-hover:text-[#F472B6] transition-colors cursor-pointer">{order.id}</td>
                                <td className="py-4 text-sm text-gray-600">{order.date}</td>
                                <td className="py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        order.status === 'Đang giao' 
                                            ? 'bg-green-100 text-green-600' 
                                            : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="py-4 text-sm text-gray-800 font-semibold text-right">{order.total.toLocaleString()}đ</td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan="4" className="py-8 text-center text-gray-500 text-sm">Chưa có đơn hàng nào.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
