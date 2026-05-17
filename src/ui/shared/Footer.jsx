import React from 'react';
import { Link } from 'react-router-dom';
export default function Footer() {
    return (
        <footer className="bg-white border-t border-[#F1F1F1] pt-16 pb-8 text-[#777777]">
            <div className="w-full px-6 md:px-10 lg:px-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Logo + slogan */}
                    <div className="col-span-1">
                        <Link to="/" className="text-3xl font-serif tracking-[0.2em] text-[#FFB6C1] font-bold uppercase mb-4 block">
                            Floré
                        </Link>
                        <p className="text-sm leading-relaxed max-w-sm">
                            Tôn vinh vẻ đẹp của sự lãng mạn hiện đại qua từng cánh hoa rực rỡ. Chúng tôi cam kết mang đến những sản phẩm tốt nhất cho bạn.
                        </p>
                    </div>

                    {/* Hỗ trợ */}
                    <div>
                        <h4 className="font-serif text-lg text-[#333333] mb-6">Hỗ Trợ</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/about" className="hover:text-[#FFB6C1] transition-colors">Về chúng tôi</Link></li>
                            <li><Link to="/shop" className="hover:text-[#FFB6C1] transition-colors">Cửa hàng</Link></li>
                            <li><Link to="/reviews" className="hover:text-[#FFB6C1] transition-colors">Đánh giá của khách hàng</Link></li>
                            <li><Link to="#" className="hover:text-[#FFB6C1] transition-colors">Chính sách giao hàng</Link></li>
                        </ul>
                    </div>

                    {/* Liên hệ */}
                    <div>
                        <h4 className="font-serif text-lg text-[#333333] mb-6">Liên Hệ</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start">
                                <span className="font-medium mr-2">Hotline:</span> 1900 8888
                            </li>
                            <li className="flex items-start">
                                <span className="font-medium mr-2">Email:</span> hello@flore.vn
                            </li>
                            <li className="flex items-start">
                                <span className="font-medium mr-2">Địa chỉ:</span> 12 Nguyễn Văn Bảo, P. Hạnh Thông, Thành phố Hồ Chí Minh
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-[#F1F1F1] pt-8 text-center">
                    <p className="text-xs">Copyright © 2024 Floré</p>
                </div>
            </div>
        </footer>
    );
}