import React from 'react';
import { Send } from 'lucide-react';
import ContactInfoCard from './ContactInfoCard';
import ContactForm from './ContactForm';
import MapSection from './MapSection';
import Newsletter from '../home/Newsletter';
import toast from 'react-hot-toast';

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

                </div>
            </div>

            {/* Main Content Container */}
            <div className="w-full px-6 md:px-10 lg:px-16 sm:px-6 lg:px-8 -mt-10 relative z-20">
                
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
            <style>{`
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
