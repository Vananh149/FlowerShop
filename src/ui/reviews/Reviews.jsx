import React, { useState, useMemo } from 'react';
import { Star } from 'lucide-react';
import ReviewCard from './ReviewCard';
import FilterTabs from '../shop/FilterTabs';
import CTASection from './CTASection';
import { reviews as initialReviews } from '../../data/reviews';

export default function Reviews() {
    const [activeTab, setActiveTab] = useState('all');

    const tabs = [
        { id: 'all', label: 'Tất cả' },
        { id: '5star', label: '5 Sao (420)' },
        { id: '4star', label: '4 Sao (75)' },
        { id: 'withImage', label: 'Có hình ảnh' }
    ];

    const filteredReviews = useMemo(() => {
        switch (activeTab) {
            case '5star':
                return initialReviews.filter(r => r.rating === 5);
            case '4star':
                return initialReviews.filter(r => r.rating === 4);
            case 'withImage':
                return initialReviews.filter(r => r.hasImage);
            case 'all':
            default:
                return initialReviews;
        }
    }, [activeTab]);

    return (
        <div className="bg-[#FDFCFB] min-h-screen pt-12 md:pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Summary Section */}
                <div className="text-center py-12 md:py-16">
                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#FFB6C1] mb-4">
                        CẢM NHẬN TỪ TRÁI TIM
                    </p>
                    <h1 className="text-4xl md:text-5xl font-serif text-[#333333] mb-12">
                        Khách hàng nói gì về chúng tôi
                    </h1>
                    
                    <div className="flex flex-col md:flex-row items-center justify-center bg-white rounded-2xl p-6 md:p-8 max-w-2xl mx-auto border border-[#F1F1F1] shadow-sm mb-16 animate-[fadeIn_0.5s_ease-out]">
                        <div className="flex flex-col items-center px-8">
                            <span className="text-5xl font-serif font-bold text-[#333333] mb-2">4.9</span>
                            <div className="flex space-x-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-5 h-5 ${i < 5 ? 'fill-[#FFB800] text-[#FFB800]' : 'fill-gray-200 text-gray-200'}`} />
                                ))}
                            </div>
                        </div>
                        
                        <div className="hidden md:block w-px h-20 bg-gray-200 mx-4"></div>
                        <div className="md:hidden h-px w-full bg-gray-200 my-6"></div>
                        
                        <div className="px-8 text-center md:text-left">
                            <p className="text-[#777777] leading-relaxed text-sm md:text-base">
                                Dựa trên hơn <span className="font-semibold text-[#333333]">500+</span> đánh giá thực tế từ khách hàng đã trải nghiệm dịch vụ hoa tươi của Floré.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="animate-[fadeIn_0.7s_ease-out]">
                    <FilterTabs 
                        tabs={tabs} 
                        activeTab={activeTab} 
                        onTabChange={setActiveTab} 
                    />
                </div>

                {/* Review Grid */}
                {filteredReviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 animate-[fadeIn_0.9s_ease-out]">
                        {filteredReviews.map((review) => (
                            <ReviewCard key={review.id} review={review} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-[#F1F1F1] shadow-sm animate-[fadeIn_0.9s_ease-out]">
                        <p className="text-[#777777]">Không tìm thấy đánh giá nào phù hợp.</p>
                        <button 
                            onClick={() => setActiveTab('all')}
                            className="mt-4 px-6 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
                        >
                            Xem tất cả đánh giá
                        </button>
                    </div>
                )}

                {/* Load More Button */}
                {filteredReviews.length > 0 && (
                    <div className="flex justify-center mt-12 mb-20">
                        <button className="px-8 py-2.5 rounded-full border border-[#F1F1F1] bg-white text-[#777777] font-medium hover:bg-gray-50 hover:text-[#333333] transition-colors shadow-sm">
                            Xem thêm đánh giá
                        </button>
                    </div>
                )}

                {/* CTA Section */}
                <div className="animate-[fadeIn_1.1s_ease-out]">
                    <CTASection />
                </div>
                
            </div>
            
            {/* Custom Animation Keyframes via Tailwind Arbitrary Values */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
