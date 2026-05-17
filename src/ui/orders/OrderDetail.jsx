import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Circle, Clock, Check } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

export default function OrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [toastMsg, setToastMsg] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/orders/${id}`);
                const data = await response.json();
                
                if (response.ok) {
                    const normalizedOrder = {
                        ...data,
                        id: data._id || data.id,
                        total: data.totalAmount,
                        date: new Date(data.createdAt).toLocaleString('vi-VN'),
                        name: data.name,
                        address: data.shippingAddress,
                        items: data.items.map(item => ({
                            ...item,
                            category: "Sản phẩm Flore"
                        }))
                    };
                    setOrder(normalizedOrder);
                } else {
                    setOrder(null);
                }
            } catch (error) {
                console.error("Lỗi khi tải chi tiết đơn hàng:", error);
                setOrder(null);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchOrder();
        }
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

    const handleCancel = async () => {
        if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) return;

        try {
            const response = await fetch(`/api/orders/${order.id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Đã hủy' })
            });

            if (response.ok) {
                setOrder(prev => ({ ...prev, status: 'Đã hủy' }));
                showToast('Đơn hàng đã được hủy thành công!');
            } else {
                showToast('Lỗi khi hủy đơn hàng.');
            }
        } catch (error) {
            console.error("Lỗi khi hủy đơn:", error);
            showToast('Không thể kết nối đến máy chủ.');
        }
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'Chờ xác nhận':
                return <span className="px-4 py-1.5 bg-orange-50 text-orange-600 rounded-full text-sm font-medium border border-orange-100">Chờ xác nhận</span>;
            case 'Chờ lấy hàng':
                return <span className="px-4 py-1.5 bg-purple-50 text-purple-600 rounded-full text-sm font-medium border border-purple-100">Chờ lấy hàng</span>;
            case 'Đang giao':
                return <span className="px-4 py-1.5 bg-blue-50 text-blue-800 rounded-full text-sm font-medium border border-blue-100">Đang giao</span>;
            case 'Đã giao':
                return <span className="px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100">Đã giao</span>;
            case 'Đã hủy':
                return <span className="px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-sm font-medium border border-red-100">Đã hủy</span>;
            default:
                return <span className="px-4 py-1.5 bg-gray-50 text-gray-800 rounded-full text-sm font-medium border border-gray-100">{status}</span>;
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

    // Timeline steps based on the new professional workflow
    const steps = [
        { title: 'Đã đặt đơn', done: true, current: false },
        { 
            title: 'Shop đã xác nhận', 
            done: ['Chờ lấy hàng', 'Đang giao', 'Đã giao'].includes(order.status), 
            current: order.status === 'Chờ xác nhận' 
        },
        { 
            title: 'Đang giao hàng', 
            done: order.status === 'Đã giao' || order.status === 'Đang giao', 
            current: order.status === 'Chờ lấy hàng' || order.status === 'Đang giao' 
        },
        { 
            title: 'Giao thành công', 
            done: order.status === 'Đã giao', 
            current: order.status === 'Đã giao' 
        },
    ];

    if (order.status === 'Đã hủy') {
        steps[1] = { title: 'Đơn hàng đã hủy', done: true, current: true, isCancel: true };
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
                                <span className="text-[#777777] font-medium text-lg">#{order.id.slice(-6).toUpperCase()}</span>
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
                                    <p className="font-medium text-[#333333] italic">{order.note || "Giao hàng cẩn thận, cảm ơn shop."}</p>
                                </div>
                            </div>
                        </div>

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
                                                    <p className="text-[10px] text-[#777777] mt-1 uppercase font-bold tracking-wider">
                                                        {item.selectedSize} {item.selectedGifts?.length > 0 && `+ ${item.selectedGifts.join(', ')}`}
                                                    </p>
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
                        
                        <div className="bg-[#FFFFFF] rounded-2xl shadow-sm p-6 sm:p-8 border border-[#F1F1F1] hover:shadow-md transition-shadow">
                            <h2 className="text-xl font-serif text-[#333333] mb-6 border-b border-[#F1F1F1] pb-4">Tóm tắt thanh toán</h2>
                            <div className="space-y-4 mb-6 text-sm text-[#777777]">
                                <div className="flex justify-between"><span>Tạm tính</span><span>{subtotal.toLocaleString()}đ</span></div>
                                <div className="flex justify-between"><span>Phí vận chuyển</span><span>{shippingFee.toLocaleString()}đ</span></div>
                                <div className="flex justify-between border-t border-gray-50 pt-4 font-bold text-[#333333]">
                                    <span>Tổng cộng</span>
                                    <span className="text-xl text-[#9B6B6B]">{order.total.toLocaleString()}đ</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button onClick={handleReorder} className="w-full py-3.5 bg-[#9B6B6B] text-white rounded-full font-medium hover:bg-[#8C5D5D] transition-all">Mua lại</button>
                                {['Chờ xác nhận', 'Chờ lấy hàng'].includes(order.status) && (
                                    <button onClick={handleCancel} className="w-full py-3.5 bg-white text-[#9B6B6B] border border-[#FBC4C4] rounded-full font-medium hover:bg-red-50 transition-all">Hủy đơn</button>
                                )}
                                <button onClick={() => navigate('/orders')} className="w-full py-3.5 text-[#777777] font-medium hover:text-[#333333] transition-colors">Quay lại</button>
                            </div>
                        </div>

                        <div className="bg-[#FFFFFF] rounded-2xl shadow-sm p-6 sm:p-8 border border-[#F1F1F1] hover:shadow-md transition-shadow">
                            <h2 className="text-xl font-serif text-[#333333] mb-6 border-b border-[#F1F1F1] pb-4">Theo dõi đơn hàng</h2>
                            <div className="relative pl-2">
                                {steps.map((step, idx) => (
                                    <div key={idx} className="relative pb-8 last:pb-0">
                                        {idx !== steps.length - 1 && (
                                            <div className={`absolute left-[11px] top-7 bottom-0 w-[2px] rounded-full ${step.done ? 'bg-[#E6F4EA]' : 'bg-[#F1F1F1]'}`}></div>
                                        )}
                                        <div className="flex gap-4 items-start relative z-10">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-0.5 shadow-sm
                                                ${step.isCancel ? 'bg-red-100 text-red-500' :
                                                  step.done && !step.current ? 'bg-[#E6F4EA] text-[#1E8E3E]' :
                                                  step.current ? 'bg-orange-100 text-orange-600 animate-pulse' :
                                                  'bg-gray-100 text-gray-400'}
                                            `}>
                                                {step.isCancel ? <span className="w-2.5 h-2.5 bg-red-500 rounded-full" /> :
                                                 step.done && !step.current ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : 
                                                 step.current ? <span className="w-2.5 h-2.5 bg-orange-500 rounded-full" /> : 
                                                 <span className="w-2 h-2 bg-gray-300 rounded-full" />}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-bold ${step.current ? 'text-[#333333]' : step.done ? 'text-[#333333]' : 'text-[#777777]'}`}>{step.title}</p>
                                                {idx === 0 && <p className="text-[10px] text-[#777777] mt-1">{order.date}</p>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {toastMsg && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#333333] text-white px-6 py-3 rounded-full shadow-lg z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {toastMsg}
                </div>
            )}
        </div>
    );
}
