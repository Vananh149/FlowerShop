import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function CTASection() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleWriteReview = () => {
        if (user) {
            navigate('/orders?filter=Hoàn tất');
        } else {
            navigate('/login', { state: { returnUrl: '/orders?filter=Hoàn tất' } });
        }
    };

    return (
        <div className="bg-[#FFF5F5] rounded-3xl p-10 md:p-16 text-center max-w-4xl mx-auto my-20 shadow-sm border border-pink-50/50">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#FFB6C1] mb-4">
                Tham gia cùng chúng tôi
            </p>
            <h2 className="text-3xl md:text-4xl font-serif text-[#333333] mb-6">
                Chia sẻ trải nghiệm của bạn
            </h2>
            <p className="text-[#777777] leading-relaxed max-w-lg mx-auto mb-10 text-sm md:text-base">
                Mỗi đóa hoa là một câu chuyện. Hãy kể cho chúng tôi nghe câu chuyện của bạn cùng Floré để lan tỏa vẻ đẹp và yêu thương.
            </p>
            
            <button 
                onClick={handleWriteReview}
                className="bg-[#FFB6C1] text-white px-8 py-3.5 rounded-full font-medium tracking-wide shadow-lg hover:bg-[#734A4A] transform hover:scale-105 transition-all duration-300"
            >
                VIẾT ĐÁNH GIÁ
            </button>
            
            <p className="text-xs text-[#777777] mt-5 font-light">
                * Nhận ngay voucher giảm giá 10% cho lần mua hàng tiếp theo sau khi đánh giá được duyệt.
            </p>
        </div>
    );
}
