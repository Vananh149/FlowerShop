import React from 'react';
import { Link } from 'react-router-dom';
export default function Footer() {
    return (
        <footer className="bg-flore-beige/30 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Info */}
                    <div className="col-span-1 md:col-span-2">
                        <span className="text-2xl font-serif tracking-widest text-flore-accent font-bold uppercase mb-6 block">Floré</span>
                        <p className="text-gray-500 leading-relaxed max-w-sm">
                            Tôn vinh vẻ đẹp của sự lãng mạn hiện đại qua từng cánh hoa rực rỡ. Chúng tôi cam kết mang đến những sản phẩm tốt nhất cho bạn.
                        </p>
                    </div>

                    {/* Help Links */}
                    <div>
                        <h4 className="font-serif text-lg text-gray-800 mb-6">Hỗ Trợ</h4>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li><Link to="/about" className="hover:text-flore-accent transition-colors">Our Story</Link></li>
                            <li><Link to="#" className="hover:text-flore-accent transition-colors">Shipping Policy</Link></li>
                            <li><Link to="#" className="hover:text-flore-accent transition-colors">Privacy Policy</Link></li>
                            <li><Link to="#" className="hover:text-flore-accent transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Contact Details */}
                    <div>
                        <h4 className="font-serif text-lg text-gray-800 mb-6">Liên Hệ</h4>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li className="flex items-start">
                                <svg className="w-4 h-4 mr-3 mt-0.5 text-flore-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                <span>1900 8888</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-4 h-4 mr-3 mt-0.5 text-flore-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                <span>hello@flore.vn</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-4 h-4 mr-3 mt-0.5 text-flore-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                <span>12 Nguyễn Văn Bảo, P. Hạnh Thông, Thành phố Hồ Chí Minh</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright & Socials */}
                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-400">© 2024 Floré. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-400 hover:text-flore-accent transition-colors"><span className="sr-only">Facebook</span>FB</a>
                        <a href="#" className="text-gray-400 hover:text-flore-accent transition-colors"><span className="sr-only">Instagram</span>IG</a>
                        <a href="#" className="text-gray-400 hover:text-flore-accent transition-colors"><span className="sr-only">Pinterest</span>PN</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}