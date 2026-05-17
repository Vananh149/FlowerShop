import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { ChevronRight, Home, Loader2 } from 'lucide-react';
import ProductImage from './ProductImage';
import ProductInfo from './ProductInfo';
import RelatedProducts from './RelatedProducts';
import Toast from '../shared/Toast';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);

    // Fetch sản phẩm từ MongoDB
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products/${id}`);
                const data = await response.json();
                setProduct(data);
            } catch (error) {
                console.error("Lỗi khi tải chi tiết sản phẩm:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    // Lấy danh sách sản phẩm liên quan
    const [relatedProducts, setRelatedProducts] = useState([]);
    useEffect(() => {
        if (product) {
            fetch('/api/products')
                .then(res => res.json())
                .then(data => {
                    const related = data
                        .filter(p => p.category === product.category && p._id !== product._id)
                        .slice(0, 4);
                    setRelatedProducts(related);
                });
        }
    }, [product]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 animate-spin text-[#FFB6C1] mb-4" />
                <p className="text-gray-500 font-serif">Đang tìm hoa cho bạn...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="py-20 text-center min-h-[50vh] flex flex-col items-center justify-center bg-[#FDFCFB]">
                <h2 className="text-2xl font-serif text-gray-800 mb-4">Không tìm thấy sản phẩm.</h2>
                <Link to="/shop" className="text-[#FFB6C1] hover:underline">Quay lại cửa hàng</Link>
            </div>
        );
    }

    const handleAddToCart = (quantity, selectedSize, selectedGifts) => {
        if (!user) {
            navigate('/login');
            return;
        }
        
        // Thêm vào giỏ hàng kèm theo size và quà tặng
        for(let i = 0; i < quantity; i++) {
            addToCart({ ...product, selectedSize, selectedGifts });
        }
        
        setShowToast(true);
    };

    return (
        <div className="bg-[#FDFCFB] min-h-screen py-10">
            <div className="w-full px-6 md:px-10 lg:px-16">
                
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
