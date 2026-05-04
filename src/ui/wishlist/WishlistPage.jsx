import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useWishlist } from '../../contexts/WishlistContext';
import Sidebar from '../profile/Sidebar';
import WishlistItem from './WishlistItem';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
    const { logout } = useAuth();
    const { wishlist } = useWishlist();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleAddToCart = (item) => {
        // Just mock action, actually should add to CartContext
        alert(`Đã thêm ${item.name} vào giỏ hàng`);
    };

    return (
        <div className="bg-[#FDFCFB] min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Sidebar 
                            activeTab="wishlist" 
                            handleLogout={handleLogout} 
                        />
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl shadow-sm border border-[#F1F1F1] p-6 lg:p-8 min-h-[500px]">
                            {/* Section Header */}
                            <div className="mb-6">
                                <h1 className="font-serif text-2xl text-gray-800">Sản phẩm yêu thích</h1>
                                <p className="text-sm text-gray-400 mt-1">
                                    Những bó hoa bạn đã lưu lại {wishlist.length > 0 && `(${wishlist.length} sản phẩm)`}
                                </p>
                            </div>

                            {/* Content */}
                            {wishlist.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                                    {wishlist.map(item => (
                                        <WishlistItem 
                                            key={item.id} 
                                            item={item} 
                                            onAddToCart={handleAddToCart}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full py-20 text-center animate-in fade-in duration-500">
                                    <div className="w-20 h-20 rounded-full bg-pink-50 flex items-center justify-center mb-4">
                                        <Heart className="w-10 h-10 text-pink-300" strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">Chưa có sản phẩm yêu thích</h3>
                                    <p className="text-sm text-gray-500 mb-6">Hãy dạo quanh cửa hàng và lưu lại những bó hoa bạn thích nhé!</p>
                                    <Link 
                                        to="/shop"
                                        className="bg-[#8C5D5D] text-white px-6 py-3 rounded-full hover:scale-105 transition-transform shadow-sm font-medium"
                                    >
                                        Khám phá ngay
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
