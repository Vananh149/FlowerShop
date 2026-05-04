import React from 'react';

export default function Newsletter() {
    return (
        <div className="bg-[#FFF5F5] rounded-3xl py-16 px-6 mt-20 mb-10 text-center max-w-5xl mx-auto shadow-sm border border-pink-50">
            <h2 className="text-3xl md:text-4xl font-serif text-[#333333] mb-4">
                Đăng ký nhận bản tin
            </h2>
            <p className="text-[#777777] mb-8 max-w-lg mx-auto text-sm md:text-base">
                Cập nhật những bộ sưu tập hoa mới nhất, ưu đãi độc quyền và những mẹo chăm sóc hoa từ các chuyên gia của Floré.
            </p>
            
            <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
                <input 
                    type="email" 
                    placeholder="Nhập địa chỉ email của bạn" 
                    required
                    className="flex-1 bg-white rounded-full px-6 py-3.5 text-sm text-[#333333] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] border border-gray-100 shadow-sm"
                />
                <button 
                    type="submit"
                    className="bg-[#FFB6C1] text-white px-8 py-3.5 rounded-full font-medium tracking-wide shadow-md hover:bg-[#734A4A] transition-colors whitespace-nowrap"
                >
                    ĐĂNG KÝ
                </button>
            </form>
        </div>
    );
}
