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
        <header className="w-full bg-white shadow-sm transition-all duration-300 sticky top-0 z-50">
            <div className="flex items-center justify-between w-full px-8 py-4">
                {/* Logo */}
                <div className="flex-shrink-0">
                    <Link to="/" className="text-3xl font-serif tracking-[0.2em] text-[#FFB6C1] font-bold uppercase">
                        Floré
                    </Link>
                </div>

                {/* Menu giữa */}
                <nav className="hidden md:flex items-center justify-center flex-1 gap-8 text-base">
                    {navItems.map((item, index) => (
                        <NavLink 
                            key={index}
                            to={item.path}
                            className={({ isActive }) => `transition-all duration-300 hover:text-[#FFB6C1] py-1 border-b-2 ${
                                isActive 
                                    ? 'text-[#FFB6C1] font-bold border-[#FFB6C1]' 
                                    : 'text-gray-600 border-transparent hover:border-[#FFB6C1]'
                            }`}
                        >
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                {/* Bên phải */}
                <div className="flex items-center">
                    {/* Search box */}
                    <div className="relative hidden lg:flex items-center">
                        <Search className="w-4 h-4 absolute left-4 text-[#FFB6C1]" />
                        <input 
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tìm kiếm hoa..." 
                            className="bg-gray-50 rounded-full py-2 pl-10 pr-4 text-sm w-56 focus:outline-none focus:ring-1 focus:ring-[#FFB6C1] border border-transparent focus:border-[#FFB6C1] transition-all duration-300"
                        />
                    </div>
                    
                    {/* Icons */}
                    <div className="flex items-center gap-4 ml-4 text-[#FFB6C1]">
                        <Link to="/wishlist" className="relative hover:scale-110 transition-transform duration-300 block">
                            <Heart className={`w-5 h-5 ${wishlist?.length > 0 ? 'fill-[#FFB6C1]' : ''}`} />
                            {wishlist?.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#FFB6C1] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                    {wishlist.length}
                                </span>
                            )}
                        </Link>
                        <Link to="/cart" className="relative hover:scale-110 transition-transform duration-300 block">
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
                            <Link to="/login" className="hover:scale-110 transition-transform duration-300 block">
                                <User className="w-5 h-5" />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}