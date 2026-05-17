import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

export default function OrderCard({ order, showToast, isReviewed }) {
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const getStatusBadge = (status) => {
        switch(status) {
            case 'Chờ xác nhận':
                return <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-medium">{status}</span>;
            case 'Chờ lấy hàng':
                return <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs font-medium">{status}</span>;
            case 'Đang giao':
                return <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">{status}</span>;
            case 'Đã giao':
                return <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">{status}</span>;
            case 'Đã hủy':
                return <span className="bg-red-100 text-red-500 px-2 py-1 rounded-full text-xs font-medium">{status}</span>;
            default:
                return <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">{status}</span>;
        }
    };

    const handleReorder = () => {
        // Mock add to cart for the first item
        if(order.items && order.items.length > 0) {
            addToCart(order.items[0], 1);
            showToast('Đã thêm sản phẩm vào giỏ hàng!');
        }
    };

    return (
        <div className="bg-white rounded-2xl p-5 border border-[#F1F1F1] shadow-sm hover:shadow-md transition-shadow duration-300 animate-in fade-in slide-in-from-bottom-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-gray-800">{order.id}</span>
                {getStatusBadge(order.status)}
            </div>
            
            <p className="text-xs text-gray-400 mb-4">Ngày đặt: {order.date}</p>

            {/* Items preview */}
            <div className="space-y-3 mb-4">
                {order.items.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-gray-100" />
                        <div>
                            <h4 className="text-sm text-gray-800 font-medium">{item.name}</h4>
                            <p className="text-xs text-gray-500">Số lượng: {item.quantity}</p>
                        </div>
                    </div>
                ))}
                {order.items.length > 2 && (
                    <p className="text-xs text-gray-400 italic">...và {order.items.length - 2} sản phẩm khác</p>
                )}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50">
                <div className="text-sm font-bold text-[#8C5D5D]">{order.total.toLocaleString()}đ</div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => navigate(`/orders/${order.id.replace('#', '')}`)}
                        className="text-xs px-4 py-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                    >
                        Xem chi tiết
                    </button>
                    {order.status === 'Đã giao' && (
                        isReviewed ? (
                            <button 
                                onClick={() => navigate('/reviews')}
                                className="text-xs px-4 py-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors font-medium border border-gray-200"
                            >
                                Xem đánh giá
                            </button>
                        ) : (
                            <button 
                                onClick={() => navigate('/write-review', { state: { product: order.items[0], orderId: order.id } })}
                                className="text-xs px-4 py-2 bg-pink-100 text-pink-600 rounded-full hover:bg-pink-200 transition-colors font-medium border border-pink-200"
                            >
                                Đánh giá
                            </button>
                        )
                    )}
                    <button 
                        onClick={handleReorder}
                        className="text-xs px-4 py-2 bg-[#8C5D5D] text-white rounded-full hover:scale-105 transition-transform font-medium"
                    >
                        Mua lại
                    </button>
                </div>
            </div>
        </div>
    );
}
