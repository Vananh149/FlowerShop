import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

export default function SuccessMessage({ isLoading }) {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            // Trigger animation after loading
            setTimeout(() => setAnimate(true), 100);
        }
    }, [isLoading]);

    return (
        <div className="flex flex-col items-center text-center">
            <div 
                className={`w-16 h-16 rounded-full flex items-center justify-center bg-[#2ECC71] text-white shadow-sm transition-all duration-700 ease-out transform
                ${animate ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
            >
                <Check className="w-8 h-8" strokeWidth={3} />
            </div>
            
            <h1 className={`font-serif text-3xl text-gray-800 mt-6 transition-all duration-700 delay-100 ease-out
                ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                Đặt hàng thành công!
            </h1>
            
            <p className={`text-sm text-gray-500 mt-3 max-w-md mx-auto transition-all duration-700 delay-200 ease-out
                ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                Cảm ơn bạn đã tin tưởng Floré. Đơn hàng của bạn đang được chuẩn bị với tất cả sự nâng niu.
            </p>
        </div>
    );
}
