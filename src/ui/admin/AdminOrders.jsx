import React, { useState, useEffect, useMemo } from 'react';
import { Search, RefreshCcw, Eye, Bell, CheckCircle, Truck, Package, XCircle, X, Check, ClipboardCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showPrintModal, setShowPrintModal] = useState(false);

    // Mở Modal xem trước vận đơn
    const handlePrintPreview = () => {
        setShowPrintModal(true);
    };

    // Chức năng In vận đơn (Thực tế in ra giấy)
    const handlePrintReal = () => {
        window.print();
    };

    // Tải dữ liệu từ Server
    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/orders');
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error("Lỗi khi tải đơn hàng:", error);
            toast.error("Không thể tải danh sách đơn hàng");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Cập nhật trạng thái đơn hàng
    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) {
                toast.success(`Đã chuyển đơn hàng sang: ${newStatus}`);
                fetchOrders(); // Tải lại dữ liệu
                if (selectedOrder?._id === orderId) {
                    setSelectedOrder(prev => ({ ...prev, status: newStatus }));
                }
            }
        } catch (error) {
            toast.error("Lỗi khi cập nhật trạng thái");
        }
    };

    // Lọc và tìm kiếm
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const nameMatch = (order.name || "").toLowerCase().includes(searchTerm.toLowerCase());
            const idMatch = (order._id || "").toLowerCase().includes(searchTerm.toLowerCase());
            const matchesSearch = nameMatch || idMatch;
            
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        });
    }, [orders, searchTerm, statusFilter]);

    const pendingOrdersCount = orders.filter(o => o.status === 'Chờ xác nhận').length;

    const getStatusColor = (status) => {
        switch (status) {
            case 'Chờ xác nhận': return 'bg-orange-50 text-orange-500 border-orange-100';
            case 'Chờ lấy hàng': return 'bg-purple-50 text-purple-500 border-purple-100';
            case 'Đang giao': return 'bg-blue-50 text-blue-500 border-blue-100';
            case 'Đã giao': return 'bg-green-50 text-green-500 border-green-100';
            case 'Đã hủy': return 'bg-red-50 text-red-500 border-red-100';
            default: return 'bg-gray-50 text-gray-500';
        }
    };

    return (
        <div className="animate-[fadeIn_0.5s_ease-out] relative">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-serif text-gray-800">Quản lý đơn hàng</h1>
                    <p className="text-sm text-gray-400 mt-1">Hệ thống xử lý đơn hàng đa bước chuyên nghiệp</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={fetchOrders}
                        className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
                    >
                        <RefreshCcw size={16} className={isLoading ? 'animate-spin' : ''} />
                        Làm mới
                    </button>
                </div>
            </div>

            {/* Notification Bar */}
            {pendingOrdersCount > 0 && (
                <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-8 flex items-center gap-4 animate-pulse">
                    <div className="bg-white p-2 rounded-xl shadow-sm text-orange-500">
                        <Bell size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-orange-800">
                            Có {pendingOrdersCount} đơn mới đang chờ bạn xác nhận
                        </p>
                        <button 
                            onClick={() => setStatusFilter('Chờ xác nhận')}
                            className="text-xs text-orange-600 font-medium hover:underline"
                        >
                            Nhấn để xử lý ngay
                        </button>
                    </div>
                </div>
            )}

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Tìm mã đơn hoặc khách hàng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-pink-100 outline-none"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    {[
                        { id: 'all', label: 'Tất cả' },
                        { id: 'Chờ xác nhận', label: 'Chờ xác nhận' },
                        { id: 'Chờ lấy hàng', label: 'Chờ lấy hàng' },
                        { id: 'Đang giao', label: 'Đang giao' },
                        { id: 'Đã giao', label: 'Đã giao' },
                        { id: 'Đã hủy', label: 'Đã hủy' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setStatusFilter(tab.id)}
                            className={`px-4 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                                statusFilter === tab.id 
                                ? 'bg-[#FFB6C1] text-white shadow-sm' 
                                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-pink-100 border-t-pink-400 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400 text-sm italic">Đang đồng bộ đơn hàng...</p>
                    </div>
                ) : filteredOrders.length > 0 ? (
                    <table className="w-full text-left text-xs">
                        <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-400 uppercase font-bold tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Mã đơn</th>
                                <th className="px-6 py-4">Khách hàng</th>
                                <th className="px-6 py-4">Tổng tiền</th>
                                <th className="px-6 py-4 text-center">Trạng thái</th>
                                <th className="px-6 py-4 text-center">Thao tác nhanh</th>
                                <th className="px-6 py-4 text-right">Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-pink-400">
                                        #{order._id.slice(-6).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-800">{order.name}</p>
                                        <p className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-[#8C5D5D]">
                                        {order.totalAmount?.toLocaleString()}đ
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 border rounded-full text-[9px] font-bold uppercase shadow-sm ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                            {/* Quy trình: Chờ xác nhận -> Chờ lấy hàng */}
                                            {order.status === 'Chờ xác nhận' && (
                                                <button 
                                                    onClick={() => handleUpdateStatus(order._id, 'Chờ lấy hàng')}
                                                    className="p-2 bg-orange-50 text-orange-500 rounded-lg hover:bg-orange-500 hover:text-white transition-all shadow-sm"
                                                    title="Xác nhận đơn hàng"
                                                >
                                                    <Check size={16} />
                                                </button>
                                            )}
                                            {/* Quy trình: Chờ lấy hàng -> Đang giao */}
                                            {order.status === 'Chờ lấy hàng' && (
                                                <button 
                                                    onClick={() => handleUpdateStatus(order._id, 'Đang giao')}
                                                    className="p-2 bg-purple-50 text-purple-500 rounded-lg hover:bg-purple-500 hover:text-white transition-all shadow-sm"
                                                    title="Giao cho Shipper"
                                                >
                                                    <Package size={16} />
                                                </button>
                                            )}
                                            {/* Quy trình: Đang giao -> Đã giao */}
                                            {order.status === 'Đang giao' && (
                                                <button 
                                                    onClick={() => handleUpdateStatus(order._id, 'Đã giao')}
                                                    className="p-2 bg-green-50 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-all shadow-sm"
                                                    title="Đã giao hàng thành công"
                                                >
                                                    <ClipboardCheck size={16} />
                                                </button>
                                            )}
                                            {/* Hủy đơn chỉ cho phép khi chưa giao hàng */}
                                            {['Chờ xác nhận', 'Chờ lấy hàng'].includes(order.status) && (
                                                <button 
                                                    onClick={() => handleUpdateStatus(order._id, 'Đã hủy')}
                                                    className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                    title="Hủy đơn"
                                                >
                                                    <XCircle size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => setSelectedOrder(order)}
                                            className="p-2 text-gray-300 hover:text-pink-400 transition-colors"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="bg-gray-50 p-6 rounded-full mb-4">
                            <Package size={40} className="text-gray-200" />
                        </div>
                        <p className="text-gray-400 font-medium italic">Không có đơn hàng nào ở trạng thái này.</p>
                    </div>
                )}
            </div>

            {/* Order Detail Drawer */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]" onClick={() => setSelectedOrder(null)}></div>
                    <div className="relative w-full max-w-md bg-white h-full shadow-2xl animate-[slideInRight_0.4s_ease-out] flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-lg font-serif text-gray-800">Chi tiết đơn hàng</h3>
                                <p className="text-[10px] text-pink-400 font-bold uppercase tracking-widest mt-1">#{selectedOrder._id}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            <div className="flex justify-between items-center">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase border shadow-sm ${getStatusColor(selectedOrder.status)}`}>
                                    {selectedOrder.status}
                                </span>
                                <span className="text-xs text-gray-400 font-medium">{new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</span>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-pink-400 rounded-full"></div>
                                    Người nhận
                                </h4>
                                <div className="space-y-3">
                                    <p className="text-sm font-bold text-gray-800">{selectedOrder.name}</p>
                                    <p className="text-xs text-gray-500 flex items-center gap-2">
                                        <span className="font-bold text-gray-400">SĐT:</span> {selectedOrder.phone}
                                    </p>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        <span className="font-bold text-gray-400">Địa chỉ:</span> {selectedOrder.shippingAddress || selectedOrder.address}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-[#8C5D5D] rounded-full"></div>
                                    Sản phẩm ({selectedOrder.items?.length || 0})
                                </h4>
                                <div className="space-y-4">
                                    {selectedOrder.items?.map((item, idx) => (
                                        <div key={idx} className="flex gap-4 items-center group">
                                            <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                                                <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-gray-800 line-clamp-1">{item.name}</p>
                                                <p className="text-[10px] text-gray-400 font-medium">x{item.quantity} • {item.price?.toLocaleString()}đ</p>
                                                <div className="flex flex-wrap gap-1.5 mt-1.5">
                                                    {item.selectedSize && (
                                                        <span className="text-[9px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                                            Size: {item.selectedSize}
                                                        </span>
                                                    )}
                                                    {item.selectedGifts && item.selectedGifts.map((gift, gIdx) => (
                                                        <span key={gIdx} className="text-[9px] bg-pink-50 text-[#FFB6C1] px-2 py-0.5 rounded-full font-bold border border-pink-100">
                                                            + {gift}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="text-sm font-bold text-[#8C5D5D]">
                                                {(item.price * item.quantity).toLocaleString()}đ
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Tổng cộng</span>
                                <span className="text-xl font-serif text-[#FFB6C1] font-bold">{selectedOrder.totalAmount?.toLocaleString()}đ</span>
                            </div>

                            <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100">
                                <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">Thông tin giao hàng</h4>
                                <div className="space-y-2">
                                    <p className="text-[10px] text-blue-500/80 font-medium">Đơn vị: Giao Hàng Nhanh</p>
                                    <p className="text-[10px] text-blue-500/80 font-medium">Mã vận đơn: GHN-{selectedOrder._id?.slice(-8).toUpperCase()}</p>
                                    <p className="text-[10px] text-blue-500/80 font-medium">Dự kiến giao: {new Date(new Date(selectedOrder.createdAt).getTime() + 3*24*60*60*1000).toLocaleDateString('vi-VN')}</p>
                                    <button 
                                        onClick={handlePrintPreview}
                                        className="mt-4 w-full py-2.5 bg-white border border-blue-200 text-blue-500 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                                    >
                                        In vận đơn
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
                            <button onClick={() => setSelectedOrder(null)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-500 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-50">Đóng</button>
                            {selectedOrder.status === 'Chờ xác nhận' && (
                                <button onClick={() => handleUpdateStatus(selectedOrder._id, 'Chờ lấy hàng')} className="flex-1 py-3 bg-orange-400 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-md hover:bg-orange-500 transition-all">Xác nhận đơn</button>
                            )}
                            {selectedOrder.status === 'Chờ lấy hàng' && (
                                <button onClick={() => handleUpdateStatus(selectedOrder._id, 'Đang giao')} className="flex-1 py-3 bg-purple-400 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-md hover:bg-purple-500 transition-all">Giao cho Shipper</button>
                            )}
                            {selectedOrder.status === 'Đang giao' && (
                                <button onClick={() => handleUpdateStatus(selectedOrder._id, 'Đã giao')} className="flex-1 py-3 bg-green-400 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-md hover:bg-green-500 transition-all">Đã giao hàng</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Print Preview Modal */}
            {showPrintModal && selectedOrder && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowPrintModal(false)}></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-[fadeIn_0.3s_ease-out] flex flex-col">
                        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Xem trước mẫu in</span>
                            <button onClick={() => setShowPrintModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>
                        <div className="p-8 flex justify-center bg-gray-100/50">
                            <div className="w-[380px] bg-white border-2 border-black p-5 shadow-sm text-black font-sans leading-tight">
                                <div className="flex justify-between items-start border-b-2 border-black pb-3 mb-3">
                                    <div>
                                        <div className="text-xl font-bold tracking-[3px]">FLORÉ</div>
                                        <div className="text-[8px] font-medium italic">Giao hàng nhanh hỏa tốc</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[9px] font-bold">MÃ VẬN ĐƠN</div>
                                        <div className="text-xs font-bold">GHN-{selectedOrder._id.slice(-8).toUpperCase()}</div>
                                    </div>
                                </div>
                                <div className="text-center mb-3">
                                    <span className="bg-black text-white px-3 py-0.5 text-[10px] font-bold">{new Date(selectedOrder.createdAt).toLocaleDateString('vi-VN')}</span>
                                </div>
                                <div className="space-y-2 mb-4">
                                    <div className="flex border-b border-gray-100 py-1.5">
                                        <div className="w-20 text-[10px] font-bold text-gray-400">NGƯỜI GỬI</div>
                                        <div className="flex-1 text-[11px] font-medium">Floré Flower Shop<br/>0987.654.321<br/>Quận 1, TP. Hồ Chí Minh</div>
                                    </div>
                                    <div className="flex border-b border-gray-100 py-1.5">
                                        <div className="w-20 text-[10px] font-bold text-gray-400">NGƯỜI NHẬN</div>
                                        <div className="flex-1 text-[11px] font-medium">
                                            <span className="text-sm font-bold">{selectedOrder.name}</span><br/>
                                            {selectedOrder.phone}<br/>
                                            {selectedOrder.shippingAddress || selectedOrder.address}
                                        </div>
                                    </div>
                                </div>
                                <table className="w-full text-[10px] mb-4 border-collapse">
                                    <thead><tr className="border-b border-black"><th className="text-left py-1">Sản phẩm</th><th className="text-center py-1">SL</th></tr></thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {selectedOrder.items.map((item, idx) => (
                                            <tr key={idx}><td className="py-1.5">{item.name} ({item.selectedSize})</td><td className="text-center py-1.5">{item.quantity}</td></tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="flex justify-between items-end">
                                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedOrder._id}`} className="w-14 h-14 border p-1" alt="QR Code" />
                                    <div className="text-right">
                                        <div className="text-[9px] font-bold text-gray-400">TIỀN THU HỘ (COD)</div>
                                        <div className="text-2xl font-bold">{selectedOrder.totalAmount?.toLocaleString()}đ</div>
                                        <div className="text-[8px] italic text-gray-400">Đã bao gồm phí ship</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 flex gap-4">
                            <button onClick={() => setShowPrintModal(false)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-500 rounded-xl text-xs font-bold uppercase tracking-widest">Đóng</button>
                            <button onClick={handlePrintReal} className="flex-1 py-3 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-2">In ngay</button>
                        </div>
                    </div>
                </div>
            )}
            
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
                @media print {
                    body * { visibility: hidden; }
                    .fixed.inset-0.z-\\[200\\], .fixed.inset-0.z-\\[200\\] * { visibility: visible; }
                    .fixed.inset-0.z-\\[200\\] { position: absolute; left: 0; top: 0; width: 100%; }
                    .p-6.bg-gray-50.flex.gap-4, .p-4.border-b { display: none; }
                }
            `}</style>
        </div>
    );
}
