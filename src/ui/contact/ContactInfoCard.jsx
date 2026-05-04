import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactInfoCard() {
    return (
        <div className="bg-[#FFF5F5] rounded-2xl p-6 md:p-8 space-y-8 shadow-sm border border-pink-50">
            <div className="flex items-start gap-4 group">
                <div className="mt-1 bg-white p-2.5 rounded-full shadow-sm text-[#FFB6C1] group-hover:bg-[#FFB6C1] group-hover:text-white transition-colors duration-300">
                    <MapPin className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="font-serif text-[#333333] font-semibold mb-1">Cửa hàng chính</h4>
                    <p className="text-[#777777] text-sm leading-relaxed">
                        12 Nguyễn Văn Bảo, P. Hạnh Thông, Thành phố Hồ Chí Minh
                    </p>
                </div>
            </div>

            <div className="flex items-start gap-4 group">
                <div className="mt-1 bg-white p-2.5 rounded-full shadow-sm text-[#FFB6C1] group-hover:bg-[#FFB6C1] group-hover:text-white transition-colors duration-300">
                    <Phone className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="font-serif text-[#333333] font-semibold mb-1">Hotline</h4>
                    <p className="text-[#777777] text-sm mb-1">0123 456 789 (Zalo)</p>
                    <p className="text-[#777777] text-sm">1900 8888 (Chăm sóc khách hàng)</p>
                </div>
            </div>

            <div className="flex items-start gap-4 group">
                <div className="mt-1 bg-white p-2.5 rounded-full shadow-sm text-[#FFB6C1] group-hover:bg-[#FFB6C1] group-hover:text-white transition-colors duration-300">
                    <Mail className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="font-serif text-[#333333] font-semibold mb-1">Email</h4>
                    <p className="text-[#777777] text-sm">hello@flore.vn</p>
                    <p className="text-[#777777] text-sm">support@flore.vn</p>
                </div>
            </div>

            <div className="flex items-start gap-4 group">
                <div className="mt-1 bg-white p-2.5 rounded-full shadow-sm text-[#FFB6C1] group-hover:bg-[#FFB6C1] group-hover:text-white transition-colors duration-300">
                    <Clock className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="font-serif text-[#333333] font-semibold mb-1">Giờ mở cửa</h4>
                    <p className="text-[#777777] text-sm mb-1">Thứ 2 - Thứ 6: 08:00 - 21:00</p>
                    <p className="text-[#777777] text-sm">Thứ 7 - CN: 09:00 - 22:00</p>
                </div>
            </div>
        </div>
    );
}
