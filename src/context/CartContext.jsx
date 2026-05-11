import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

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

    // Save to localStorage when cart changes
    useEffect(() => {
        localStorage.setItem('flore_cart', JSON.stringify(cart));
    }, [cart]);

    // Clear cart if logged out (optional: clear local storage too if desired, but here we just hide it)
    const activeCart = user ? cart : [];

    const addToCart = (product) => {
        if (!user) return; // Prevent adding if not logged in
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + (product.quantity || 1) } : item);
            }
            return [...prev, { ...product, quantity: product.quantity || 1 }];
        });
    };

    const removeFromCart = (productId) => {
        if (!user) return;
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        if (!user || newQuantity < 1) return;
        setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item));
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartCount = activeCart.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = activeCart.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ cart: activeCart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
};
