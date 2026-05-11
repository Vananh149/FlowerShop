import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Circle, Clock, Check } from 'lucide-react';
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
        // Find order with id 
        setTimeout(() => {
            const searchId = id.startsWith('#') ? id : `#${id}`;
            const savedOrders = JSON.parse(localStorage.getItem('myOrders') || '[]');
            const allOrders = [...savedOrders, ...MOCK_ORDERS];
            const found = allOrders.find(o => o.id === searchId);
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

    const handleCancel = () => {
        // Mock cancel action
        showToast('Yêu cầu hủy đơn đã được gửi!');
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'Đang xử lý':
                return <span className="px-4 py-1.5 bg-yellow-50 text-yellow-800 rounded-full text-sm font-medium">Đang xử lý</span>;
            case 'Đang giao':
                return <span className="px-4 py-1.5 bg-blue-50 text-blue-800 rounded-full text-sm font-medium">Đang giao</span>;
            case 'Hoàn tất':
                return <span className="px-4 py-1.5 bg-[#E6F4EA] text-[#1E8E3E] rounded-full text-sm font-medium">Hoàn tất</span>;
            case 'Đã hủy':
                return <span className="px-4 py-1.5 bg-red-50 text-red-800 rounded-full text-sm font-medium">Đã hủy</span>;
            default:
                return <span className="px-4 py-1.5 bg-gray-50 text-gray-800 rounded-full text-sm font-medium">{status}</span>;
        }
    };

    if (isLoading) {
        return (
            <div className="bg-[#FDFCFB] min-h-screen py-10 px-4 flex justify-center items-center">
                <div className="w-8 h-8 border-4 border-[#FBC4C4] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="bg-[#FDFCFB] min-h-screen py-10 px-4 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-serif text-[#333333] mb-2">Không tìm thấy đơn hàng</h2>
                <p className="text-[#777777] mb-6">Đơn hàng bạn yêu cầu không tồn tại hoặc đã bị xóa.</p>
                <button 
                    onClick={() => navigate('/orders')}
                    className="px-6 py-3 bg-[#9B6B6B] text-white rounded-full hover:scale-105 transition-transform"
                >
                    Quay lại danh sách
                </button>
            </div>
        );
    }

    const shippingFee = 15000;
    const subtotal = order.total - shippingFee;

    // Timeline steps based on status
    const steps = [
        { title: 'Đã đặt hàng', done: true, current: false },
        { title: 'Đã xác nhận', done: order.status !== 'Đã hủy', current: order.status === 'Đang xử lý' },
        { title: 'Đang giao', done: order.status === 'Hoàn tất' || order.status === 'Đang giao', current: order.status === 'Đang giao' },
        { title: 'Hoàn thành', done: order.status === 'Hoàn tất', current: order.status === 'Hoàn tất' },
    ];
    if (order.status === 'Đã hủy') {
        steps[1] = { title: 'Đã hủy', done: true, current: true, isCancel: true };
        steps.splice(2, 2);
    }

    return (
        <div className="bg-[#FDFCFB] min-h-screen py-12 font-sans animate-in fade-in duration-500">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
                
                {/* Header Section */}
                <div className="mb-8">
                    <nav className="text-sm text-gray-400 mb-6 flex items-center gap-2">
                        <Link to="/profile" className="hover:text-[#9B6B6B] transition-colors">Tài khoản</Link>
                        <span>/</span>
                        <Link to="/orders" className="hover:text-[#9B6B6B] transition-colors">Đơn hàng</Link>
                        <span>/</span>
                        <span className="text-gray-600">Chi tiết đơn hàng</span>
                    </nav>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-serif text-[#333333] mb-2">Chi tiết đơn hàng</h1>
                            <div className="flex items-center gap-4 mt-4">
                                <span className="text-[#777777] font-medium text-lg">{order.id}</span>
                                {getStatusBadge(order.status)}
                            </div>
                        </div>
                        <p className="text-[#777777] text-sm md:text-base">Ngày đặt: {order.date}</p>
                    </div>
                </div>

                {/* Main Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-8 space-y-8">
                        
                        {/* Thông tin khách hàng */}
                        <div className="bg-[#FFFFFF] rounded-2xl shadow-sm p-6 sm:p-8 border border-[#F1F1F1] hover:shadow-md transition-shadow">
                            <h2 className="text-xl font-serif text-[#333333] mb-6 border-b border-[#F1F1F1] pb-4">Thông tin khách hàng</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-[#777777] mb-1">Họ tên</p>
                                    <p className="font-medium text-[#333333]">{order.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-[#777777] mb-1">Số điện thoại</p>
                                    <p className="font-medium text-[#333333]">{order.phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-[#777777] mb-1">Địa chỉ giao hàng</p>
                                    <p className="font-medium text-[#333333] leading-relaxed">{order.address}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-[#777777] mb-1">Ghi chú</p>
                                    <p className="font-medium text-[#333333] italic">{order.note || "Giao buổi sáng, vui lòng gọi trước."}</p>
                                </div>
                            </div>
                        </div>

                        {/* Danh sách sản phẩm */}
                        <div className="bg-[#FFFFFF] rounded-2xl shadow-sm p-6 sm:p-8 border border-[#F1F1F1] hover:shadow-md transition-shadow">
                            <h2 className="text-xl font-serif text-[#333333] mb-6 border-b border-[#F1F1F1] pb-4">Sản phẩm đã đặt</h2>
                            
                            <div className="space-y-4">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-[#F1F1F1] hover:shadow-sm transition-shadow bg-white">
                                        <img src={item.image} alt={item.name} className="w-24 h-24 sm:w-20 sm:h-20 rounded-xl object-cover" />
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-medium text-[#333333] text-lg sm:text-base">{item.name}</h3>
                                                    <p className="text-sm text-[#777777] mt-1">{item.category || "Premium Bouquet"}</p>
                                                </div>
                                                <p className="font-medium text-[#333333]">{(item.price).toLocaleString()}đ</p>
                                            </div>
                                            <div className="flex justify-between items-end mt-4 sm:mt-0">
                                                <p className="text-sm text-[#777777]">Số lượng: x{item.quantity}</p>
                                                <p className="font-medium text-[#9B6B6B]">Thành tiền: {(item.price * item.quantity).toLocaleString()}đ</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-4 space-y-8 sticky top-24 h-fit z-20">
                        
                        {/* Tóm tắt thanh toán */}
                        <div className="bg-[#FFFFFF] rounded-2xl shadow-sm p-6 sm:p-8 border border-[#F1F1F1] hover:shadow-md transition-shadow">
                            <h2 className="text-xl font-serif text-[#333333] mb-6 border-b border-[#F1F1F1] pb-4">Tóm tắt thanh toán</h2>
                            
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-[#777777]">
                                    <span>Tạm tính</span>
                                    <span>{subtotal.toLocaleString()}đ</span>
                                </div>
                                <div className="flex justify-between text-[#777777]">
                                    <span>Phí vận chuyển</span>
                                    <span>{shippingFee.toLocaleString()}đ</span>
                                </div>
                                <div className="flex justify-between text-[#777777]">
                                    <span>Giảm giá</span>
                                    <span>0đ</span>
                                </div>
                                <div className="flex justify-between text-[#777777]">
                                    <span>Voucher</span>
                                    <span>0đ</span>
                                </div>
                            </div>
                            
                            <div className="border-t border-[#F1F1F1] pt-4 mb-8">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-[#333333]">Tổng cộng</span>
                                    <span className="text-2xl font-bold text-[#9B6B6B]">{order.total.toLocaleString()}đ</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button 
                                    onClick={handleReorder}
                                    className="w-full py-3.5 bg-[#9B6B6B] text-white rounded-full font-medium hover:bg-[#8C5D5D] hover:scale-[1.02] transition-all"
                                >
                                    Mua lại
                                </button>
                                {order.status === 'Đang xử lý' && (
                                    <button 
                                        onClick={handleCancel}
                                        className="w-full py-3.5 bg-white text-[#9B6B6B] border border-[#FBC4C4] rounded-full font-medium hover:bg-red-50 hover:scale-[1.02] transition-all"
                                    >
                                        Hủy đơn
                                    </button>
                                )}
                                <button 
                                    onClick={() => navigate('/orders')}
                                    className="w-full py-3.5 text-[#777777] font-medium hover:text-[#333333] transition-colors"
                                >
                                    Quay lại
                                </button>
                            </div>
                        </div>

                        {/* Timeline trạng thái */}
                        <div className="bg-[#FFFFFF] rounded-2xl shadow-sm p-6 sm:p-8 border border-[#F1F1F1] hover:shadow-md transition-shadow">
                            <h2 className="text-xl font-serif text-[#333333] mb-6 border-b border-[#F1F1F1] pb-4">Trạng thái đơn hàng</h2>
                            
                            <div className="relative pl-2">
                                {steps.map((step, idx) => (
                                    <div key={idx} className="relative pb-8 last:pb-0">
                                        {/* Line */}
                                        {idx !== steps.length - 1 && (
                                            <div className={`absolute left-[11px] top-7 bottom-0 w-[2px] rounded-full ${step.done ? 'bg-[#E6F4EA]' : 'bg-[#F1F1F1]'}`}></div>
                                        )}
                                        
                                        <div className="flex gap-4 items-start relative z-10">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-0.5 shadow-sm
                                                ${step.isCancel ? 'bg-red-100 text-red-500' :
                                                  step.done && !step.current ? 'bg-[#E6F4EA] text-[#1E8E3E]' :
                                                  step.current ? 'bg-yellow-100 text-yellow-600 animate-pulse' :
                                                  'bg-gray-100 text-gray-400'}
                                            `}>
                                                {step.isCancel ? <span className="w-2.5 h-2.5 bg-red-500 rounded-full" /> :
                                                 step.done && !step.current ? <Check className="w-3.5 h-3.5" /> : 
                                                 step.current ? <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full" /> : 
                                                 <span className="w-2 h-2 bg-gray-300 rounded-full" />}
                                            </div>
                                            <div>
                                                <p className={`font-medium ${step.current ? 'text-[#333333]' : step.done ? 'text-[#333333]' : 'text-[#777777]'}`}>{step.title}</p>
                                                {idx === 0 && <p className="text-xs text-[#777777] mt-1">{order.date}</p>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Toast notification */}
            {toastMsg && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#333333] text-white px-6 py-3 rounded-full shadow-lg z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {toastMsg}
                </div>
            )}
        </div>
    );
}
