import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';
import CartSummary from './CartSummary';

export default function CartPage() {
    const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();

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
                            {cart.map(item => (
                                <CartItem 
                                    key={`${item.id}-${item.selectedSize}`} 
                                    item={item} 
                                    onUpdateQuantity={updateQuantity} 
                                    onRemove={removeFromCart} 
                                />
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <CartSummary cartTotal={cartTotal} cartCount={cartCount} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
