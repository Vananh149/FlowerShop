import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import CartItem from './CartItem';
import CartSummary from './CartSummary';

export default function CartPage() {
    const { cart, updateQuantity, removeFromCart } = useCart();
    const [selectedIds, setSelectedIds] = useState([]);
    const navigate = useNavigate();

    // Tự động chọn tất cả khi vào giỏ hàng lần đầu
    useEffect(() => {
        if (cart.length > 0 && selectedIds.length === 0) {
            setSelectedIds(cart.map(item => item.variantId));
        }
    }, [cart]);

    const toggleSelect = (variantId) => {
        setSelectedIds(prev => 
            prev.includes(variantId) 
                ? prev.filter(id => id !== variantId) 
                : [...prev, variantId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === cart.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(cart.map(item => item.variantId));
        }
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

    const selectedItems = cart.filter(item => selectedIds.includes(item.variantId));
    const selectedTotal = selectedItems.reduce((total, item) => total + (calculateItemPrice(item) * item.quantity), 0);
    const selectedCount = selectedItems.reduce((count, item) => count + item.quantity, 0);

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            return;
        }
        // Chuyển sang trang checkout với danh sách món đã chọn
        navigate('/checkout', { state: { selectedItems, selectedTotal } });
    };

    return (
        <div className="bg-[#FDFCFB] min-h-screen py-10">
            <div className="w-full px-6 md:px-10 lg:px-16">
                
                <h1 className="text-3xl font-serif text-gray-800 mb-8">Giỏ hàng của bạn</h1>

                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center bg-white border border-[#F1F1F1] rounded-3xl py-20 px-4 text-center shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <ShoppingBag className="w-10 h-10 text-gray-300" />
                        </div>
                        <h2 className="text-xl font-serif text-gray-800 mb-2">Giỏ hàng đang trống</h2>
                        <p className="text-sm text-gray-500 mb-8 max-w-md">
                            Chưa có sản phẩm nào trong giỏ hàng của bạn. Hãy khám phá những bó hoa tươi thắm tại cửa hàng của chúng tôi nhé.
                        </p>
                        <Link 
                            to="/shop" 
                            className="bg-[#FFB6C1] text-white px-8 py-3 rounded-full hover:scale-105 transition-transform duration-300 font-medium text-sm inline-block shadow-sm"
                        >
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* Select All Header */}
                            <div className="flex items-center gap-4 bg-white border border-[#F1F1F1] rounded-2xl p-4 shadow-sm mb-4">
                                <button 
                                    onClick={toggleSelectAll}
                                    className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
                                        selectedIds.length === cart.length 
                                        ? 'bg-[#FFB6C1] border-[#FFB6C1] text-white' 
                                        : 'bg-white border-gray-200'
                                    }`}
                                >
                                    {selectedIds.length === cart.length && <Check size={14} strokeWidth={4} />}
                                </button>
                                <span className="text-sm font-medium text-gray-700">Chọn tất cả ({cart.length} sản phẩm)</span>
                            </div>

                            {cart.map(item => (
                                <CartItem 
                                    key={item.variantId} 
                                    item={item} 
                                    isSelected={selectedIds.includes(item.variantId)}
                                    onToggleSelect={() => toggleSelect(item.variantId)}
                                    onUpdateQuantity={updateQuantity} 
                                    onRemove={removeFromCart} 
                                />
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <CartSummary 
                                cartTotal={selectedTotal} 
                                cartCount={selectedCount} 
                                isSelectionEmpty={selectedItems.length === 0}
                                onCheckout={handleCheckout}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
