import React from 'react';
import { Send } from 'lucide-react';
import ContactInfoCard from './ContactInfoCard';
import ContactForm from './ContactForm';
import MapSection from './MapSection';
import Newsletter from '../home/Newsletter';

export default function Contact() {
    return (
        <div className="bg-[#FDFCFB] min-h-screen">
            
            {/* Hero Section */}
            <div className="relative pt-32 pb-24 md:pt-40 md:pb-32 px-4 bg-gradient-to-br from-yellow-100/60 via-green-100/60 to-teal-200/60">
                <div className="absolute inset-0 bg-white/40"></div>
                <div className="relative z-10 max-w-3xl mx-auto text-center animate-[fadeIn_0.8s_ease-out]">
                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#FFB6C1] mb-4">
                        FLORÉ STUDIO
                    </p>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#333333] mb-6">
                        Liên hệ với chúng tôi
                    </h1>
                    <p className="text-[#777777] text-lg mb-10 max-w-xl mx-auto font-light leading-relaxed">
                        Chúng tôi luôn lắng nghe và sẵn sàng hỗ trợ. Hãy để lại lời nhắn, Floré sẽ liên hệ với bạn trong thời gian sớm nhất.
                    </p>

                    {/* Quick Input Bar */}
                    <form className="max-w-lg mx-auto flex items-center bg-white rounded-full shadow-sm border border-gray-100 p-1.5 focus-within:ring-2 focus-within:ring-pink-200 transition-all" onSubmit={(e) => e.preventDefault()}>
                        <input 
                            type="text" 
                            placeholder="Nhập email hoặc câu hỏi ngắn..." 
                            className="flex-1 bg-transparent px-5 py-3 text-sm text-[#333333] placeholder-gray-400 focus:outline-none"
                        />
                        <button className="bg-[#FFB6C1] hover:bg-[#734A4A] text-white px-6 py-3 rounded-full text-sm font-medium transition-colors flex items-center gap-2">
                            <span>GỬI</span>
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>

            {/* Main Content Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
                
                {/* Contact Section: Info + Form */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 animate-[fadeInUp_1s_ease-out]">
                    <div className="lg:col-span-1">
                        <ContactInfoCard />
                    </div>
                    <div className="lg:col-span-2">
                        <ContactForm />
                    </div>
                </div>

                {/* Map Section */}
                <MapSection />

                {/* Newsletter Section */}
                <Newsletter />
                
            </div>

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
