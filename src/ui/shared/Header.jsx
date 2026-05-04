import React, { useState } from 'react';
import { Search, Heart, ShoppingCart, User } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import AvatarMenu from './AvatarMenu';

export default function Header() {
    const [search, setSearch] = useState("");
    const { user } = useAuth();
    const { cartCount } = useCart();
    const { wishlist } = useWishlist();

    const navItems = [
        { name: 'Trang chủ', path: '/' },
        { name: 'Cửa hàng', path: '/shop' },
        { name: 'Đánh giá', path: '/reviews' },
        { name: 'Giới thiệu', path: '/about' },
        { name: 'Liên hệ', path: '/contact' }
    ];

    return (
        <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 lg:h-20">
                {/* Logo */}
                <div className="flex-shrink-0">
                    <Link to="/" className="text-2xl font-serif tracking-widest text-flore-accent font-bold uppercase">
                        Floré
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
                    {navItems.map((item, index) => (
                        <NavLink 
                            key={index}
                            to={item.path}
                            className={({ isActive }) => `transition-colors ${
                                isActive 
                                    ? 'text-flore-accent border-b-2 border-flore-accent pb-1' 
                                    : 'hover:text-flore-accent'
                            }`}
                        >
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                {/* Search and Icons */}
                <div className="flex items-center space-x-4">
                    <div className="relative hidden lg:block">
                        <input 
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tìm kiếm hoa..." 
                            className="bg-flore-beige border-none rounded-full py-2 px-4 text-xs w-48 focus:ring-1 focus:ring-flore-accent outline-none"
                        />
                        <Search className="w-4 h-4 absolute right-3 top-2.5 text-gray-400" />
                    </div>
                    
                    <div className="flex space-x-4 text-gray-500">
                        <Link to="/wishlist" className="hover:text-flore-accent transition-colors relative">
                            <Heart className={`w-5 h-5 ${wishlist?.length > 0 ? 'text-[#F472B6] fill-current' : ''}`} />
                            {wishlist?.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#FFB6C1] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                    {wishlist.length}
                                </span>
                            )}
                        </Link>
                        <Link to="/cart" className="hover:text-flore-accent transition-colors relative">
                            <ShoppingCart className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#FFB6C1] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        {user ? (
                            <AvatarMenu />
                        ) : (
                            <Link to="/login" className="hover:text-flore-accent transition-colors">
                                <User className="w-5 h-5" />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}