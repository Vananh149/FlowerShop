import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import RatingStars from './RatingStars';
import ImageUpload from './ImageUpload';

export default function WriteReviewPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        productId: '',
        rating: 0,
        title: '',
        content: '',
        images: []
    });

    useEffect(() => {
        // Nếu có thông tin sản phẩm từ đơn hàng truyền sang, tự động điền vào form
        if (location.state?.product) {
            setFormData(prev => ({ 
                ...prev, 
                productId: location.state.product.id || location.state.product._id 
            }));
        }
    }, [location.state]);

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Cập nhật state
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Xóa lỗi khi user bắt đầu nhập lại
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.productId) newErrors.productId = "Vui lòng chọn sản phẩm để đánh giá.";
        if (formData.rating === 0) newErrors.rating = "Vui lòng chọn số sao đánh giá.";
        if (!formData.content.trim()) newErrors.content = "Vui lòng nhập nội dung đánh giá.";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const reviewData = {
                userId: user?._id || user?.id,
                orderId: location.state?.orderId,
                productId: formData.productId,
                name: user?.name || "Khách hàng",
                rating: formData.rating,
                content: formData.content,
                image: formData.images[0] || "", // Lấy ảnh đầu tiên nếu có
                avatarLetter: user?.name ? user.name.charAt(0) : "K",
                avatarBg: "#" + Math.floor(Math.random()*16777215).toString(16) // Màu ngẫu nhiên cho avatar
            };

            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewData)
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Đánh giá của bạn đã được gửi thành công!", {
                    duration: 4000,
                    position: 'top-center',
                    style: { background: '#4CAF50', color: '#fff' }
                });
                navigate('/reviews');
            } else {
                toast.error(data.message || "Lỗi khi gửi đánh giá");
            }
        } catch (error) {
            console.error("Lỗi khi gửi đánh giá:", error);
            toast.error("Không thể kết nối đến máy chủ");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Nếu không có sản phẩm nào được chọn để đánh giá
    if (!location.state?.product) {
        return (
            <div className="bg-[#FDFCFB] min-h-screen py-20 px-4 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-sm border border-[#F1F1F1] p-10 max-w-md text-center">
                    <h2 className="text-2xl font-serif text-[#333333] mb-4">Chưa chọn sản phẩm</h2>
                    <p className="text-[#777777] mb-8">Vui lòng chọn sản phẩm từ lịch sử đơn hàng để viết đánh giá.</p>
                    <button 
                        onClick={() => navigate('/orders')}
                        className="bg-[#8C5D5D] text-white px-8 py-3 rounded-full font-medium hover:scale-105 transition-transform"
                    >
                        Xem đơn hàng
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#FDFCFB] min-h-screen py-12 md:py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-2xl md:text-4xl font-serif text-gray-800">
                        Viết đánh giá của bạn
                    </h1>
                    <p className="text-sm md:text-base text-gray-400 mt-2">
                        Chia sẻ trải nghiệm của bạn cùng Floré
                    </p>
                </div>

                <form 
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl shadow-sm border border-[#F1F1F1] p-6 md:p-10"
                >
                    {/* Tên hiển thị (Tự động điền từ user) */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-[#333333] mb-2">
                            Người đánh giá
                        </label>
                        <input 
                            type="text" 
                            disabled
                            value={user?.name || "Khách hàng"}
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                    </div>

                    {/* Chọn sản phẩm / Hiển thị sản phẩm đã chọn */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-[#333333] mb-2">
                            Sản phẩm đánh giá <span className="text-red-500">*</span>
                        </label>
                        
                        {location.state?.product ? (
                            <div className="flex items-center gap-4 p-4 bg-pink-50/50 border border-pink-100 rounded-xl">
                                <img 
                                    src={location.state.product.image} 
                                    alt={location.state.product.name} 
                                    className="w-16 h-16 rounded-lg object-cover border border-white shadow-sm"
                                />
                                <div>
                                    <h4 className="font-medium text-gray-800">{location.state.product.name}</h4>
                                    <p className="text-xs text-gray-500">Đơn hàng: {location.state.orderId || "Hoàn tất"}</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <select 
                                    value={formData.productId}
                                    onChange={(e) => handleChange('productId', e.target.value)}
                                    className={`w-full border ${errors.productId ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F472B6] bg-white`}
                                >
                                    <option value="">-- Chọn sản phẩm bạn đã mua --</option>
                                    {purchasedProducts.map(product => (
                                        <option key={product.id} value={product.id}>
                                            {product.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.productId && <p className="text-red-500 text-xs mt-1">{errors.productId}</p>}
                            </>
                        )}
                    </div>

                    {/* Đánh giá sao */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-[#333333] mb-2">
                            Chất lượng <span className="text-red-500">*</span>
                        </label>
                        <RatingStars 
                            rating={formData.rating} 
                            onChange={(val) => handleChange('rating', val)} 
                        />
                        {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
                    </div>

                    {/* Tiêu đề */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-[#333333] mb-2">
                            Tiêu đề đánh giá
                        </label>
                        <input 
                            type="text" 
                            placeholder="Tiêu đề đánh giá của bạn (Ví dụ: Hoa rất đẹp và tươi)"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F472B6]"
                        />
                    </div>

                    {/* Nội dung */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-[#333333] mb-2">
                            Nội dung đánh giá <span className="text-red-500">*</span>
                        </label>
                        <textarea 
                            placeholder="Hãy chia sẻ trải nghiệm của bạn về sản phẩm..."
                            value={formData.content}
                            onChange={(e) => handleChange('content', e.target.value)}
                            className={`w-full border ${errors.content ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F472B6] min-h-[120px] resize-y`}
                        ></textarea>
                        {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
                    </div>

                    {/* Hình ảnh */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-[#333333] mb-2">
                            Hình ảnh thực tế / Video (Không bắt buộc)
                        </label>
                        <ImageUpload 
                            images={formData.images}
                            onImagesChange={(imgs) => handleChange('images', imgs)}
                        />
                    </div>

                    {/* Nút Submit */}
                    <button 
                        type="submit"
                        className="bg-[#8C5D5D] text-white rounded-full px-6 py-3.5 w-full font-medium hover:scale-105 transition-transform duration-300 shadow-md"
                    >
                        Gửi đánh giá
                    </button>
                </form>
            </div>
        </div>
    );
}
