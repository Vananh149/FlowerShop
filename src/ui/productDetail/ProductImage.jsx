import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function ProductImage({ image, name, tag }) {
    const [isZoomed, setIsZoomed] = useState(false);

    return (
        <>
            <div 
                className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-zoom-in shadow-sm"
                onClick={() => setIsZoomed(true)}
            >
                <img 
                    src={image} 
                    alt={name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Badge */}
                {tag && (
                    <div className="absolute top-3 left-3 bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-medium">
                        {tag}
                    </div>
                )}
            </div>

            {/* Modal Zoom */}
            {isZoomed && (
                <div 
                    className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setIsZoomed(false)}
                >
                    <button 
                        className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors"
                        onClick={() => setIsZoomed(false)}
                    >
                        <X className="w-8 h-8" />
                    </button>
                    <img 
                        src={image} 
                        alt={name} 
                        className="max-w-full max-h-full object-contain rounded-lg animate-[fadeIn_0.3s_ease-out]"
                        onClick={(e) => e.stopPropagation()} 
                    />
                </div>
            )}
        </>
    );
}
