import React from 'react';
import { MapPin } from 'lucide-react';

export default function MapSection() {
    return (
        <div className="mt-20 md:mt-24">
            <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-sm group">
                {/* Map Placeholder Image */}
                <img 
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop" 
                    alt="Bản đồ vị trí Floré" 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[2s] ease-out"
                />
                
                {/* Overlay để làm dịu ảnh */}
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500"></div>

                {/* Button Overlay */}
                <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
                    <a 
                        href="https://maps.app.goo.gl/8SBYVwWzpFd2UY549" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white px-6 py-3.5 rounded-full shadow-lg text-[#333333] font-medium hover:bg-[#FFF5F5] hover:text-[#FFB6C1] transition-all duration-300 group/btn"
                    >
                        <MapPin className="w-5 h-5 text-[#FFB6C1] group-hover/btn:animate-bounce" />
                        Ghé thăm chúng tôi
                    </a>
                </div>
            </div>
        </div>
    );
}
