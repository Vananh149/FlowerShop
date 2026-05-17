import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating, onChange }) {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => {
                const isActive = hoverRating >= star || rating >= star;
                return (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className={`transition-all duration-200 transform hover:scale-125 focus:outline-none`}
                    >
                        <Star 
                            className={`w-8 h-8 ${isActive ? 'fill-[#FFB800] text-[#FFB800]' : 'fill-gray-200 text-gray-200'}`} 
                        />
                    </button>
                );
            })}
        </div>
    );
}
