import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export function useWishlist() {
    return useContext(WishlistContext);
}

export const WishlistProvider = ({ children }) => {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState([]);
    const [toastMessage, setToastMessage] = useState(null);

    // Load from localStorage on mount or user change
    useEffect(() => {
        if (user) {
            const stored = localStorage.getItem(`wishlist_${user.email}`);
            if (stored) {
                setWishlist(JSON.parse(stored));
            } else {
                setWishlist([]);
            }
        } else {
            setWishlist([]);
        }
    }, [user]);

    // Save to localStorage when wishlist changes
    useEffect(() => {
        if (user) {
            localStorage.setItem(`wishlist_${user.email}`, JSON.stringify(wishlist));
        }
    }, [wishlist, user]);

    const addToWishlist = (product) => {
        setWishlist(prev => {
            if (!prev.find(item => item.id === product.id)) {
                return [...prev, product];
            }
            return prev;
        });
        showToast('Đã thêm vào mục yêu thích');
    };

    const removeFromWishlist = (productId) => {
        setWishlist(prev => prev.filter(item => item.id !== productId));
        showToast('Đã bỏ yêu thích');
    };

    const toggleWishlist = (product) => {
        if (wishlist.find(item => item.id === product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    const isFavorite = (productId) => {
        return wishlist.some(item => item.id === productId);
    };

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const value = {
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isFavorite,
        toastMessage
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
            {/* Simple global toast for wishlist */}
            {toastMessage && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {toastMessage}
                </div>
            )}
        </WishlistContext.Provider>
    );
};
