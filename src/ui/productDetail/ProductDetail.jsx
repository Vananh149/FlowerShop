import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { ChevronRight, Home } from 'lucide-react';
import ProductImage from './ProductImage';
import ProductInfo from './ProductInfo';
import RelatedProducts from './RelatedProducts';
import Toast from '../shared/Toast';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart } = useCart();
    const [showToast, setShowToast] = useState(false);

    // Tìm sản phẩm hiện tại
    const product = products.find(p => p.id === id);

    // Lấy danh sách sản phẩm liên quan (cùng danh mục, loại trừ sản phẩm hiện tại)
    const relatedProducts = useMemo(() => {
        if (!product) return [];
        return products
            .filter(p => p.category === product.category && p.id !== product.id)
            .slice(0, 4); // Lấy tối đa 4 sản phẩm
    }, [product]);

    if (!product) {
        return (
            <div className="py-20 text-center min-h-[50vh] flex flex-col items-center justify-center bg-[#FDFCFB]">
                <h2 className="text-2xl font-serif text-gray-800 mb-4">Không tìm thấy sản phẩm.</h2>
                <Link to="/shop" className="text-[#FFB6C1] hover:underline">Quay lại cửa hàng</Link>
            </div>
        );
    }

    const handleAddToCart = (quantity, selectedSize) => {
        if (!user) {
            navigate('/login');
            return;
        }
        
        // Thêm vào giỏ hàng (Gọi hàm addToCart nhiều lần tùy thuộc vào logic Context hiện tại, hoặc truyền số lượng nếu Context hỗ trợ)
        // Hiện tại giả lập gọi addToCart theo quantity
        for(let i = 0; i < quantity; i++) {
            addToCart({ ...product, selectedSize });
        }
        
        setShowToast(true);
    };

    return (
        <div className="bg-[#FDFCFB] min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4">
                
                {/* Breadcrumb */}
                <nav className="flex items-center text-sm text-gray-400 mb-8">
                    <Link to="/" className="hover:text-gray-700 transition-colors flex items-center">
                        <Home className="w-4 h-4 mr-1" />
                        Trang chủ
                    </Link>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <Link to="/shop" className="hover:text-gray-700 transition-colors">
                        Cửa hàng
                    </Link>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <span className="text-gray-600 truncate">{product.name}</span>
                </nav>

                {/* Hero Product Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-[#FFFFFF] p-6 sm:p-10 rounded-3xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] border border-[#F1F1F1]">
                    <ProductImage 
                        image={product.image} 
                        name={product.name} 
                        tag={product.tag} 
                    />
                    
                    <ProductInfo 
                        product={product} 
                        onAddToCart={handleAddToCart} 
                    />
                </div>

                {/* Related Products */}
                <RelatedProducts products={relatedProducts} />
                
            </div>

            {/* Toast Notification */}
            {showToast && (
                <Toast 
                    message="Đã thêm sản phẩm vào giỏ hàng!" 
                    onClose={() => setShowToast(false)} 
                />
            )}
        </div>
    );
}
