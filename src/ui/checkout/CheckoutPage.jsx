import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import CheckoutForm from './CheckoutForm';
import CheckoutSummary from './CheckoutSummary';
import Toast from '../shared/Toast';

export default function CheckoutPage() {
    const { cart, cartTotal, removeMultipleFromCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Lấy dữ liệu sản phẩm đã chọn từ state của Link/Navigate (từ CartPage truyền sang)
    // Nếu không có (ví dụ vào thẳng link), ta dùng toàn bộ giỏ hàng làm mặc định
    const checkoutItems = location.state?.selectedItems || cart;
    const checkoutTotal = location.state?.selectedTotal || cartTotal;

    const [shippingMethod, setShippingMethod] = useState('standard');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showToast, setShowToast] = useState(false);

    // If cart is empty and no state passed, redirect back
    useEffect(() => {
        if (checkoutItems.length === 0 && !isSubmitting && !showToast) {
            navigate('/cart');
        }
    }, [checkoutItems, navigate, isSubmitting, showToast]);

    const shippingFee = shippingMethod === 'express' ? 50000 : 15000;
    const finalTotal = checkoutTotal + shippingFee;

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

    const handlePlaceOrder = async (formData) => {
        if (!user) {
            alert("Vui lòng đăng nhập để đặt hàng!");
            navigate('/login');
            return;
        }

        setIsSubmitting(true);
        try {
            const orderData = {
                userId: user._id || user.id,
                name: formData.fullName,
                items: checkoutItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    image: item.image,
                    price: calculateItemPrice(item),
                    quantity: item.quantity,
                    selectedSize: item.selectedSize || 'Tiêu chuẩn',
                    selectedGifts: item.selectedGifts || []
                })),
                totalAmount: finalTotal,
                shippingAddress: formData.address,
                phone: formData.phone,
                paymentMethod: paymentMethod === 'cod' ? 'COD' : 'Thẻ tín dụng'
            };

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();

            if (response.ok) {
                setIsSubmitting(false);
                setShowToast(true);
                
                // Chỉ xóa những món đã đặt ra khỏi giỏ hàng
                const variantIdsToRemove = checkoutItems.map(item => item.variantId);
                removeMultipleFromCart(variantIdsToRemove);
                
                // Redirect sau 2 giây
                setTimeout(() => {
                    navigate('/success', { state: { orderData: data } });
                }, 2000);
            } else {
                alert(data.message || "Lỗi khi tạo đơn hàng");
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error("Lỗi khi đặt hàng:", error);
            alert("Không thể kết nối đến máy chủ");
            setIsSubmitting(false);
        }
    };

    if (checkoutItems.length === 0 && !showToast) {
        return null; // Redirecting
    }

    return (
        <div className="bg-[#FDFCFB] min-h-screen py-10">
            <div className="w-full px-6 md:px-10 lg:px-16">
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
                            finalTotal={finalTotal}
                        />
                    </div>

                    {/* Right Column: Summary */}
                    <div className="lg:col-span-1">
                        <CheckoutSummary 
                            cart={checkoutItems}
                            cartTotal={checkoutTotal}
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
