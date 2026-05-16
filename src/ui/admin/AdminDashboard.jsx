import React from 'react';

export default function AdminDashboard() {
    return (
        <div>
            <h1 className="text-2xl font-serif text-gray-800 mb-6">Tổng quan kinh doanh</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Doanh thu', value: '142.080.000đ', color: 'bg-blue-50' },
                    { label: 'Đơn hàng', value: '9', color: 'bg-orange-50' },
                    { label: 'Lượt truy cập', value: '113', color: 'bg-green-50' },
                    { label: 'Đánh giá mới', value: '5', color: 'bg-pink-50' },
                ].map((stat, i) => (
                    <div key={i} className={`${stat.color} p-6 rounded-2xl border border-white shadow-sm`}>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                ))}
            </div>
            <div className="mt-10 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm h-64 flex items-center justify-center">
                <p className="text-gray-400 italic">Biểu đồ phân tích bán hàng sẽ hiển thị ở đây...</p>
            </div>
        </div>
    );
}
