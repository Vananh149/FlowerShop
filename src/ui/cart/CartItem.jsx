import React from 'react';
import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN') + ' VND';
    };

    return (
        <div className="flex items-center gap-4 bg-white border border-[#F1F1F1] rounded-2xl p-4 shadow-sm transition-shadow hover:shadow-md">
            {/* Image */}
            <Link to={`/shop/${item.id}`} className="flex-shrink-0">
                <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-24 h-24 rounded-xl object-cover hover:scale-105 transition-transform duration-300"
                />
            </Link>

            {/* Info */}
            <div className="flex-1 flex flex-col justify-center">
                <Link to={`/shop/${item.id}`}>
                    <h3 className="font-serif text-lg text-gray-800 hover:text-[#FFB6C1] transition-colors line-clamp-1">{item.name}</h3>
                </Link>
                {item.selectedSize && (
                    <p className="text-xs text-gray-400 mt-1">Kích thước: {item.selectedSize}</p>
                )}
                
                {/* Quantity Control */}
                <div className="flex items-center border border-gray-200 rounded-full overflow-hidden mt-3 w-fit bg-white">
                    <button 
                        className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    >-</button>
                    <span className="w-8 text-center text-sm font-medium text-gray-800">{item.quantity}</span>
                    <button 
                        className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >+</button>
                </div>
            </div>

            {/* Price & Remove */}
            <div className="flex flex-col items-end justify-between h-full">
                <span className="text-sm font-bold text-[#FFB6C1] whitespace-nowrap">
                    {formatPrice(item.price * item.quantity)}
                </span>
                <button 
                    onClick={() => onRemove(item.id)}
                    className="text-xs text-red-400 hover:text-red-500 mt-4 flex items-center gap-1 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                    <span>Xóa</span>
                </button>
            </div>
        </div>
    );
}
