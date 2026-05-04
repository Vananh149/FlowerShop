import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CheckoutForm from './CheckoutForm';
import CheckoutSummary from './CheckoutSummary';
import Toast from '../shared/Toast';

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    const [shippingMethod, setShippingMethod] = useState('standard');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showToast, setShowToast] = useState(false);

    // If cart is empty, redirect to cart or shop
    useEffect(() => {
        if (cart.length === 0 && !isSubmitting && !showToast) {
            navigate('/cart');
        }
    }, [cart, navigate, isSubmitting, showToast]);

    const shippingFee = shippingMethod === 'express' ? 50000 : 15000;
    const finalTotal = cartTotal + shippingFee;

    const handlePlaceOrder = (formData) => {
        setIsSubmitting(true);
        // Giả lập API call
        setTimeout(() => {
            setIsSubmitting(false);
            setShowToast(true);
            
            // Generate mock order ID
            const orderId = '#' + Math.floor(10000000 + Math.random() * 90000000);
            const date = new Date().toISOString();
            
            const orderData = {
                orderId,
                date,
                cart: [...cart],
                formData,
                paymentMethod,
                finalTotal
            };

            clearCart();
            // Redirect sau 2 giây
            setTimeout(() => {
                navigate('/success', { state: { orderData } });
            }, 2000);
        }, 1500);
    };

    if (cart.length === 0 && !showToast) {
        return null; // Redirecting
    }

    return (
        <div className="bg-[#FDFCFB] min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-3xl font-serif text-gray-800 mb-8">Thanh toán</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column: Form */}
                    <div className="lg:col-span-2">
                        <CheckoutForm 
                            shippingMethod={shippingMethod}
                            setShippingMethod={setShippingMethod}
                            paymentMethod={paymentMethod}
                            setPaymentMethod={setPaymentMethod}
                            onSubmit={handlePlaceOrder}
                        />
                    </div>

                    {/* Right Column: Summary */}
                    <div className="lg:col-span-1">
                        <CheckoutSummary 
                            cart={cart}
                            cartTotal={cartTotal}
                            shippingFee={shippingFee}
                            finalTotal={finalTotal}
                            isSubmitting={isSubmitting}
                        />
                    </div>
                </div>
            </div>

            {showToast && (
                <Toast 
                    message="Đặt hàng thành công! Đang chuyển hướng..." 
                    onClose={() => setShowToast(false)} 
                />
            )}
        </div>
    );
}
