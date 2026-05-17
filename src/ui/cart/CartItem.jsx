import { Trash2, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CartItem({ item, isSelected, onToggleSelect, onUpdateQuantity, onRemove }) {
    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN') + ' VND';
    };

    const calculateItemPrice = (item) => {
        let price = item.price;
        if (item.selectedSize === 'Lớn') price += 150000;
        if (item.selectedSize === 'Đặc biệt') price += 300000;
        if (item.selectedGifts) {
            if (item.selectedGifts.includes('Gấu bông Teddy')) price += 150000;
            if (item.selectedGifts.includes('Hộp Socola Ferrero')) price += 250000;
            if (item.selectedGifts.includes('Nến thơm tinh dầu')) price += 180000;
        }
        return price;
    };

    const unitPrice = calculateItemPrice(item);

    return (
        <div className="flex items-center gap-4 bg-white border border-[#F1F1F1] rounded-2xl p-4 shadow-sm transition-shadow hover:shadow-md">
            {/* Checkbox */}
            <button 
                onClick={onToggleSelect}
                className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                    isSelected 
                    ? 'bg-[#FFB6C1] border-[#FFB6C1] text-white' 
                    : 'bg-white border-gray-200'
                }`}
            >
                {isSelected && <Check size={14} strokeWidth={4} />}
            </button>

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
                <div className="flex flex-wrap gap-2 mt-1">
                    {item.selectedSize && (
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                            Size: {item.selectedSize}
                        </span>
                    )}
                    {item.selectedGifts && item.selectedGifts.map(gift => (
                        <span key={gift} className="text-[10px] bg-pink-50 text-[#FFB6C1] px-2 py-0.5 rounded-full">
                            + {gift}
                        </span>
                    ))}
                </div>
                
                {/* Quantity Control */}
                <div className="flex items-center border border-gray-200 rounded-full overflow-hidden mt-3 w-fit bg-white">
                    <button 
                        className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                        onClick={() => onUpdateQuantity(item.variantId, item.quantity - 1)}
                    >-</button>
                    <span className="w-8 text-center text-sm font-medium text-gray-800">{item.quantity}</span>
                    <button 
                        className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                        onClick={() => onUpdateQuantity(item.variantId, item.quantity + 1)}
                    >+</button>
                </div>
            </div>

            {/* Price & Remove */}
            <div className="flex flex-col items-end justify-between h-full min-w-[100px]">
                <div className="text-right">
                    <p className="text-sm font-bold text-[#FFB6C1] whitespace-nowrap">
                        {formatPrice(unitPrice * item.quantity)}
                    </p>
                    {item.quantity > 1 && (
                        <p className="text-[10px] text-gray-400">{formatPrice(unitPrice)} / sản phẩm</p>
                    )}
                </div>
                <button 
                    onClick={() => onRemove(item.variantId)}
                    className="text-xs text-red-400 hover:text-red-500 mt-4 flex items-center gap-1 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                    <span>Xóa</span>
                </button>
            </div>
        </div>
    );
}
