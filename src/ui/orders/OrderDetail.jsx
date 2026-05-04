import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { MOCK_ORDERS } from './OrdersPage';
import { useCart } from '../../context/CartContext';

export default function OrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [toastMsg, setToastMsg] = useState('');

    useEffect(() => {
        setIsLoading(true);
        // Find order with id #FLR-xxxx
        setTimeout(() => {
            const found = MOCK_ORDERS.find(o => o.id === `#${id}`);
            setOrder(found || null);
            setIsLoading(false);
        }, 500);
    }, [id]);

    const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(''), 3000);
    };

    const handleReorder = () => {
        if(order && order.items) {
            order.items.forEach(item => {
                addToCart(item, item.quantity);
            });
            showToast('Đã thêm toàn bộ sản phẩm vào giỏ hàng!');
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'Đang xử lý': return <Package className="w-5 h-5 text-yellow-500" />;
            case 'Đang giao': return <Truck className="w-5 h-5 text-green-500" />;
            case 'Hoàn tất': return <CheckCircle className="w-5 h-5 text-gray-500" />;
            case 'Đã hủy': return <XCircle className="w-5 h-5 text-red-500" />;
            default: return <Package className="w-5 h-5 text-gray-500" />;
        }
    };

    if (isLoading) {
        return (
            <div className="bg-[#FDFCFB] min-h-screen py-10 px-4 flex justify-center items-center">
                <div className="w-8 h-8 border-4 border-[#FFB6C1] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="bg-[#FDFCFB] min-h-screen py-10 px-4 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-serif text-gray-800 mb-2">Không tìm thấy đơn hàng</h2>
                <p className="text-gray-500 mb-6">Đơn hàng bạn yêu cầu không tồn tại hoặc đã bị xóa.</p>
                <button 
                    onClick={() => navigate('/orders')}
                    className="px-6 py-3 bg-[#8C5D5D] text-white rounded-full hover:scale-105 transition-transform"
                >
                    Quay lại danh sách
                </button>
            </div>
        );
    }

    return (
        <div className="bg-[#FDFCFB] min-h-screen py-10">
            <div className="max-w-3xl mx-auto px-4">
                <button 
                    onClick={() => navigate('/orders')}
                    className="flex items-center text-sm text-gray-500 hover:text-[#8C5D5D] transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại đơn hàng
                </button>

                <div className="bg-white rounded-2xl p-6 lg:p-8 border border-[#F1F1F1] shadow-sm animate-in fade-in slide-in-from-bottom-4">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-100 pb-6 gap-4">
                        <div>
                            <h1 className="text-2xl font-serif text-gray-800 mb-1">Chi tiết đơn hàng {order.id}</h1>
                            <p className="text-sm text-gray-400">Ngày đặt: {order.date}</p>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                            {getStatusIcon(order.status)}
                            <span className="font-medium text-gray-700 text-sm">{order.status}</span>
                        </div>
                    </div>

                    {/* Timeline (Giả lập) */}
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold text-gray-800 mb-4">Trạng thái đơn hàng</h3>
                        <div className="relative border-l-2 border-gray-100 ml-3 space-y-6">
                            <div className="relative pl-6">
                                <div className="absolute w-3 h-3 bg-[#2ECC71] rounded-full -left-[7px] top-1.5 shadow-[0_0_0_4px_white]"></div>
                                <p className="text-sm font-medium text-gray-800">Đặt hàng thành công</p>
                                <p className="text-xs text-gray-400">{order.date}</p>
                            </div>
                            <div className="relative pl-6">
                                <div className={`absolute w-3 h-3 rounded-full -left-[7px] top-1.5 shadow-[0_0_0_4px_white] ${
                                    order.status !== 'Đang xử lý' && order.status !== 'Đã hủy' ? 'bg-[#2ECC71]' : 'bg-gray-200'
                                }`}></div>
                                <p className={`text-sm font-medium ${order.status !== 'Đang xử lý' && order.status !== 'Đã hủy' ? 'text-gray-800' : 'text-gray-400'}`}>Người bán đang chuẩn bị hàng</p>
                            </div>
                            {order.status !== 'Đã hủy' && (
                                <div className="relative pl-6">
                                    <div className={`absolute w-3 h-3 rounded-full -left-[7px] top-1.5 shadow-[0_0_0_4px_white] ${
                                        order.status === 'Đang giao' || order.status === 'Hoàn tất' ? 'bg-[#2ECC71]' : 'bg-gray-200'
                                    }`}></div>
                                    <p className={`text-sm font-medium ${order.status === 'Đang giao' || order.status === 'Hoàn tất' ? 'text-gray-800' : 'text-gray-400'}`}>Đang giao hàng</p>
                                </div>
                            )}
                            {order.status === 'Hoàn tất' && (
                                <div className="relative pl-6">
                                    <div className="absolute w-3 h-3 bg-[#2ECC71] rounded-full -left-[7px] top-1.5 shadow-[0_0_0_4px_white]"></div>
                                    <p className="text-sm font-medium text-gray-800">Giao hàng thành công</p>
                                </div>
                            )}
                            {order.status === 'Đã hủy' && (
                                <div className="relative pl-6">
                                    <div className="absolute w-3 h-3 bg-red-500 rounded-full -left-[7px] top-1.5 shadow-[0_0_0_4px_white]"></div>
                                    <p className="text-sm font-medium text-red-500">Đơn hàng đã hủy</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-gray-50 p-5 rounded-xl border border-gray-100">
                        <div>
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Thông tin nhận hàng</h3>
                            <p className="text-sm text-gray-800 font-medium">{order.name}</p>
                            <p className="text-sm text-gray-600 mt-1">{order.phone}</p>
                            <p className="text-sm text-gray-600 mt-1 leading-relaxed">{order.address}</p>
                        </div>
                        <div>
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Thanh toán</h3>
                            <p className="text-sm text-gray-800">{order.paymentMethod}</p>
                            
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-4 mb-3">Ghi chú</h3>
                            <p className="text-sm text-gray-500 italic">Không có ghi chú</p>
                        </div>
                    </div>

                    {/* Products */}
                    <div className="mb-6 border-t border-gray-100 pt-6">
                        <h3 className="text-sm font-semibold text-gray-800 mb-4">Sản phẩm ({order.items.length})</h3>
                        <div className="space-y-4 border-b border-gray-100 pb-6">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center">
                                    <div className="flex gap-4 items-center">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover border border-gray-100" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">{item.name}</p>
                                            <p className="text-xs text-gray-500 mt-1">Số lượng: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-700">
                                        {(item.price * item.quantity).toLocaleString()}đ
                                    </p>
                                </div>
                            ))}
                        </div>
                        
                        {/* Summary */}
                        <div className="pt-4 space-y-2">
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Tạm tính</span>
                                <span>{(order.total - 15000).toLocaleString()}đ</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Phí giao hàng</span>
                                <span>15.000đ</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-100">
                                <span className="font-semibold text-gray-800">Tổng cộng</span>
                                <span className="text-xl font-bold text-[#8C5D5D]">{order.total.toLocaleString()}đ</span>
                            </div>
                        </div>
                    </div>

                    {/* Reorder Action */}
                    <div className="flex justify-center mt-8">
                        <button 
                            onClick={handleReorder}
                            className="bg-[#8C5D5D] text-white px-8 py-3 rounded-full hover:scale-105 transition-transform shadow-sm font-medium"
                        >
                            Mua lại đơn hàng này
                        </button>
                    </div>
                </div>
            </div>

            {toastMsg && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {toastMsg}
                </div>
            )}
        </div>
    );
}
