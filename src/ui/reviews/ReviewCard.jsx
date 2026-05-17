import React from 'react';
import { Star } from 'lucide-react';

export default function ReviewCard({ review }) {
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < rating ? 'fill-[#FFB800] text-[#FFB800]' : 'fill-gray-200 text-gray-200'}`} 
                />
            );
        }
        return stars;
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-[#F1F1F1] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div 
                        className="w-11 h-11 rounded-full flex items-center justify-center font-serif text-lg font-bold text-white shadow-sm"
                        style={{ backgroundColor: review.avatarBg || '#8C5D5D' }}
                    >
                        {review.avatarLetter || review.name?.charAt(0) || 'K'}
                    </div>
                    <div>
                        <h4 className="font-semibold text-[#333333] text-sm">{review.name}</h4>
                        <p className="text-xs text-[#777777] mt-0.5">
                            {review.createdAt ? new Date(review.createdAt).toLocaleDateString('vi-VN') : 'Mới đây'}
                        </p>
                    </div>
                </div>
                <div className="flex space-x-0.5">
                    {renderStars(review.rating)}
                </div>
            </div>
            
            <p className="text-[#777777] text-sm leading-relaxed mb-4">
                {review.content}
            </p>
            
            {review.image && (
                <div className="mt-4 aspect-[4/3] overflow-hidden rounded-xl">
                    <img 
                        src={review.image} 
                        alt="Review by customer" 
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                </div>
            )}
        </div>
    );
}
