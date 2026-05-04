import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../../contexts/WishlistContext';

export default function WishlistItem({ item, onAddToCart }) {
    const { removeFromWishlist } = useWishlist();

    const formattedPrice = typeof item.price === 'number' ? `${item.price.toLocaleString('vi-VN')} VND` : item.price;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-[#F1F1F1] hover:shadow-md transition group animate-in fade-in zoom-in-95 duration-500 fill-mode-both relative flex flex-col">
            <div className="relative overflow-hidden rounded-t-2xl aspect-[3/4]">
                <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button 
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-3 right-3 bg-white/80 p-2 rounded-full text-[#F472B6] hover:bg-white transition-colors z-20 shadow-sm"
                    title="Bỏ yêu thích"
                >
                    <Heart className="w-4 h-4 fill-current" />
                </button>
            </div>
            
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">{item.name}</h3>
                <p className="text-sm font-bold text-[#8C5D5D] mt-1">{formattedPrice}</p>
                
                <div className="flex items-center justify-between mt-auto pt-4">
                    <button 
                        onClick={() => removeFromWishlist(item.id)}
                        className="text-xs text-red-400 hover:underline transition-colors"
                    >
                        Xóa
                    </button>
                    <button 
                        onClick={() => onAddToCart(item)}
                        className="bg-[#8C5D5D] text-white rounded-full px-4 py-2 text-xs hover:scale-105 transition-transform"
                    >
                        Thêm vào giỏ
                    </button>
                </div>
            </div>
        </div>
    );
}
