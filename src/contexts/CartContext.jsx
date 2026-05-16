import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();

    // Load from localStorage on init
    const [cart, setCart] = useState(() => {
        try {
            const localData = localStorage.getItem('flore_cart');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            return [];
        }
    });

    // 1. Fetch cart from Backend when user logs in
    useEffect(() => {
        const fetchUserCart = async () => {
            if (user) {
                console.log("Dòng 24 - Đang lấy giỏ hàng từ Server cho User:", user._id || user.id);
                try {
                    const userId = user._id || user.id;
                    const response = await fetch(`http://localhost:5000/api/cart/${userId}`);
                    const data = await response.json();
                    if (response.ok && data.items) {
                        console.log("Dòng 30 - Đã lấy được giỏ hàng từ Server:", data.items);
                        setCart(data.items);
                    }
                } catch (error) {
                    console.error("Lỗi khi đồng bộ giỏ hàng từ Server:", error);
                }
            }
        };

        fetchUserCart();
    }, [user]);

    // 2. Sync to Backend whenever cart changes locally
    useEffect(() => {
        const syncCartToBackend = async () => {
            if (user) {
                console.log("Dòng 45 - Đang lưu giỏ hàng lên Server...", cart);
                try {
                    const userId = user._id || user.id;
                    const response = await fetch('http://localhost:5000/api/cart', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId, items: cart })
                    });
                    if (response.ok) {
                        console.log("Dòng 54 - Lưu lên Server THÀNH CÔNG!");
                    } else {
                        const errorData = await response.json();
                        console.error("Dòng 57 - Server báo lỗi khi lưu:", errorData);
                    }
                } catch (error) {
                    console.error("Lỗi kết nối khi lưu giỏ hàng:", error);
                }
            }
            // Luôn lưu vào localStorage để dự phòng
            localStorage.setItem('flore_cart', JSON.stringify(cart));
        };

        // Chỉ sync nếu có giỏ hàng (kể cả giỏ trống)
        syncCartToBackend();
    }, [cart, user]);

    const addToCart = (product) => {
        if (!user) {
            alert("Vui lòng đăng nhập để thêm vào giỏ hàng!");
            return;
        }
        
        // Tạo một ID duy nhất cho biến thể (ID + Size + Quà tặng)
        const giftsKey = (product.selectedGifts || []).sort().join('-');
        const variantId = `${product.id}-${product.selectedSize || 'Tiêu chuẩn'}-${giftsKey}`;

        setCart(prev => {
            const existing = prev.find(item => item.variantId === variantId);
            if (existing) {
                return prev.map(item => item.variantId === variantId 
                    ? { ...item, quantity: item.quantity + (product.quantity || 1) } 
                    : item
                );
            }
            return [...prev, { ...product, variantId, quantity: product.quantity || 1 }];
        });
    };

    const removeFromCart = (variantId) => {
        setCart(prev => prev.filter(item => item.variantId !== variantId));
    };

    const updateQuantity = (variantId, newQuantity) => {
        if (newQuantity < 1) return;
        setCart(prev => prev.map(item => item.variantId === variantId ? { ...item, quantity: newQuantity } : item));
    };

    const clearCart = async () => {
        setCart([]);
        if (user) {
            try {
                const userId = user._id || user.id;
                await fetch(`http://localhost:5000/api/cart/${userId}`, { method: 'DELETE' });
            } catch (error) {
                console.error("Lỗi khi xóa giỏ hàng trên Server:", error);
            }
        }
    };

    const removeMultipleFromCart = (variantIds) => {
        setCart(prev => prev.filter(item => !variantIds.includes(item.variantId)));
    };

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Tính tổng tiền bao gồm phụ phí
    const calculateItemPrice = (item) => {
        let price = item.price;
        
        // Cộng tiền Size (giả định)
        if (item.selectedSize === 'Lớn') price += 150000;
        if (item.selectedSize === 'Đặc biệt') price += 300000;
        
        // Cộng tiền Quà tặng (giả định theo tên)
        if (item.selectedGifts) {
            if (item.selectedGifts.includes('Gấu bông Teddy')) price += 150000;
            if (item.selectedGifts.includes('Hộp Socola Ferrero')) price += 250000;
            if (item.selectedGifts.includes('Nến thơm tinh dầu')) price += 180000;
        }
        
        return price;
    };

    const cartTotal = cart.reduce((total, item) => total + (calculateItemPrice(item) * item.quantity), 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, removeMultipleFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
};
