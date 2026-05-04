import React from 'react';
import { Heart } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useWishlist } from '../../contexts/WishlistContext';

export default function ProductCard({ id, image, name, price, oldPrice, tag }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorite, toggleWishlist } = useWishlist();

  const product = { id, image, name, price, oldPrice, tag };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    alert('Đã thêm vào giỏ hàng!');
  };
  const formattedPrice = typeof price === 'number' ? `${price.toLocaleString('vi-VN')} VND` : price;
  const formattedOldPrice = typeof oldPrice === 'number' ? `${oldPrice.toLocaleString('vi-VN')} VND` : oldPrice;

  return (
    <div className="group relative block">
      <div className="block relative overflow-hidden rounded-2xl mb-4">
        <Link to={`/shop/${id}`}>
          <img 
            alt={name} 
            className="w-full h-[300px] sm:h-[400px] object-cover transition-transform duration-500 group-hover:scale-110" 
            src={image} 
          />
        </Link>
        {/* Wishlist icon overlay */}
        <button 
          onClick={(e) => { 
            e.preventDefault(); 
            e.stopPropagation(); 
            if (!user) {
                navigate('/login');
                return;
            }
            toggleWishlist(product); 
          }}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all z-20 shadow-sm ${
            isFavorite(id) 
              ? 'bg-white text-[#F472B6] opacity-100 scale-110' 
              : 'bg-white/80 text-gray-400 hover:text-[#F472B6] opacity-0 group-hover:opacity-100'
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite(id) ? 'fill-current' : ''}`} />
        </button>

        {/* Badge/Tag */}
        {tag && (
          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <span className={`px-3 py-1 text-[10px] sm:text-xs font-semibold rounded-full shadow-sm text-white tracking-wider ${
              tag === 'MỚI' ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {tag}
            </span>
          </div>
        )}
      </div>

      <div className="text-left px-1">
        <Link to={`/shop/${id}`} className="static before:absolute before:inset-0 before:z-0">
          <h3 className="text-base sm:text-lg font-serif mb-1 text-gray-900 group-hover:text-[#FFB6C1] transition-colors relative z-10">{name}</h3>
        </Link>
        <div className="flex items-center space-x-2 mb-3 relative z-10 pointer-events-none">
          <p className="text-sm text-gray-800 font-semibold">
            {formattedPrice}
          </p>
          {formattedOldPrice && (
            <p className="text-xs text-gray-400 line-through">
              {formattedOldPrice}
            </p>
          )}
        </div>
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(e); }}
          className="w-full bg-flore-pink/50 text-gray-700 py-2.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-flore-pink transition-colors relative z-20 cursor-pointer"
        >
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}
