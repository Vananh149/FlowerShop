import React, { useState, useMemo, useEffect } from 'react';
import { Star } from 'lucide-react';
import ReviewCard from './ReviewCard';
import FilterTabs from '../shop/FilterTabs';
import CTASection from './CTASection';

export default function Reviews() {
    const [activeTab, setActiveTab] = useState('all');
    const [visibleCount, setVisibleCount] = useState(6);
    const [allReviews, setAllReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch('/api/reviews');
                const data = await response.json();
                setAllReviews(data);
            } catch (error) {
                console.error("Lỗi khi tải đánh giá:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReviews();
    }, []);

    const [sortBy, setSortBy] = useState('newest');

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setVisibleCount(6);
    };

    const tabs = [
        { id: 'all', label: 'Tất cả' },
        { id: '5star', label: `5 Sao (${allReviews.filter(r => r.rating === 5).length})` },
        { id: '4star', label: `4 Sao (${allReviews.filter(r => r.rating === 4).length})` },
        { id: '3star', label: `3 Sao (${allReviews.filter(r => r.rating === 3).length})` },
        { id: '2star', label: `2 Sao (${allReviews.filter(r => r.rating === 2).length})` },
        { id: '1star', label: `1 Sao (${allReviews.filter(r => r.rating === 1).length})` },
        { id: 'withImage', label: 'Có hình ảnh / video' }
    ];

    const filteredAndSortedReviews = useMemo(() => {
        let result = [...allReviews];

        // Lọc theo Tab
        if (activeTab === '5star') result = result.filter(r => r.rating === 5);
        else if (activeTab === '4star') result = result.filter(r => r.rating === 4);
        else if (activeTab === '3star') result = result.filter(r => r.rating === 3);
        else if (activeTab === '2star') result = result.filter(r => r.rating === 2);
        else if (activeTab === '1star') result = result.filter(r => r.rating === 1);
        else if (activeTab === 'withImage') result = result.filter(r => r.image && r.image !== "");

        // Sắp xếp
        if (sortBy === 'newest') {
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortBy === 'helpful') {
            result.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
        }

        return result;
    }, [activeTab, sortBy, allReviews]);

    return (
        <div className="bg-[#FDFCFB] min-h-screen pt-12 md:pt-20 pb-10">
            <div className="w-full px-6 md:px-10 lg:px-16 sm:px-6 lg:px-8">
                
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

                {/* Filter Tabs & Sort Dropdown */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 animate-[fadeIn_0.7s_ease-out]">
                    <div className="flex-1 w-full overflow-x-auto">
                        <FilterTabs 
                            tabs={tabs} 
                            activeTab={activeTab} 
                            onTabChange={handleTabChange} 
                        />
                    </div>
                    
                    <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-full border border-[#F1F1F1] shadow-sm shrink-0 self-center md:self-auto">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Sắp xếp</span>
                        <div className="w-px h-4 bg-gray-200 mx-1"></div>
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="text-sm font-semibold text-gray-700 bg-transparent outline-none cursor-pointer pr-2"
                        >
                            <option value="newest">Mới nhất</option>
                            <option value="relevant">Liên quan</option>
                            <option value="helpful">Hữu ích nhất</option>
                        </select>
                    </div>
                </div>

                {/* Review Grid */}
                {filteredAndSortedReviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 animate-[fadeIn_0.9s_ease-out]">
                        {filteredAndSortedReviews.slice(0, visibleCount).map((review) => (
                            <ReviewCard key={review._id || review.id} review={review} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-[#F1F1F1] shadow-sm animate-[fadeIn_0.9s_ease-out]">
                        <p className="text-[#777777]">Không tìm thấy đánh giá nào phù hợp.</p>
                        <button 
                            onClick={() => handleTabChange('all')}
                            className="mt-4 px-6 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
                        >
                            Xem tất cả đánh giá
                        </button>
                    </div>
                )}

                {/* Load More Button */}
                {filteredAndSortedReviews.length > visibleCount && (
                    <div className="flex justify-center mt-12 mb-20">
                        <button 
                            onClick={() => setVisibleCount(prev => prev + 6)}
                            className="px-8 py-2.5 rounded-full border border-[#F1F1F1] bg-white text-[#777777] font-medium hover:bg-gray-50 hover:text-[#333333] transition-colors shadow-sm"
                        >
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
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
