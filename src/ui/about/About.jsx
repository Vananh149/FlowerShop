import React from 'react';
import SectionTitle from '../shared/SectionTitle';
import TimelineItem from './TimelineItem';
import TeamCard from './TeamCard';
import { timeline } from '../../data/timeline';
import { team } from '../../data/team';

export default function About() {
    return (
        <div className="bg-white min-h-screen">
            
            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] w-full flex items-center">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=2000&auto=format&fit=crop" 
                        alt="About Floré" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10"></div>
                </div>
                
                <div className="w-full px-6 md:px-10 lg:px-16 relative z-10">
                    <div className="bg-white/95 backdrop-blur-md p-8 md:p-12 lg:p-16 rounded-2xl max-w-xl shadow-2xl animate-[fadeIn_0.8s_ease-out]">
                        <p className="text-xs font-bold tracking-[0.2em] uppercase text-flore-gray mb-4">
                            Về với Floré, về với thiên nhiên
                        </p>
                        <h1 className="text-4xl md:text-5xl font-serif text-flore-dark mb-6 leading-tight">
                            Câu chuyện của Floré
                        </h1>
                        <p className="text-flore-gray leading-relaxed text-sm md:text-base font-light">
                            Floré được sinh ra từ tình yêu mãnh liệt đối với nghệ thuật cắm hoa và khao khát mang đến những cảm xúc chân thực nhất qua từng đóa hoa tươi.
                        </p>
                    </div>
                </div>
            </div>

            {/* Mission Section */}
            <div className="py-24 md:py-32 w-full px-6 md:px-10 lg:px-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="relative group animate-[fadeIn_1s_ease-out]">
                        <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-lg">
                            <img 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEtKU_KG8FimAlDT3cWEvsG1JRvNYWwwQoHSkWsL9-0V6CzB8C6UeNn0sPAqVD9v2sHh0Uwfo1n0a1OhMw5K0exd53W4Osno9tBTwnTT2NV2r_OsvkRvEKmhVG1-Do3JcbbfpDJlgIrhP-0a4SM2MlvwXJMfXwAM4PDG3kMbbqDIL2X2SUp1AYZqadhd0DD0nz_2a16vVnRWal01H5FpwTyzIBmoZWOLL8pOZU94BLoQvRW0Ujfoe0OXe_q2z0LtYZMtkmW1UqBwI" 
                                alt="Nghệ nhân Floré" 
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                            />
                        </div>
                        {/* Decorative element */}
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-flore-bg rounded-full -z-10 hidden md:block"></div>
                    </div>
                    
                    <div className="animate-[fadeIn_1.2s_ease-out]">
                        <SectionTitle 
                            subtitle="Chia sẻ & Gắn kết" 
                            title="Sứ mệnh của chúng tôi" 
                        />
                        <p className="text-flore-gray leading-relaxed mb-8 font-light">
                            Chúng tôi tin rằng mỗi khoảnh khắc trong cuộc sống đều xứng đáng được kỷ niệm bằng những sắc hoa tươi thắm. Floré cam kết mang đến những thiết kế hoa độc bản, tinh tế, giúp bạn gửi gắm trọn vẹn yêu thương.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-8 border-t border-gray-100 pt-8 mt-8">
                            <div>
                                <div className="text-4xl font-serif text-flore-d mb-2">99%</div>
                                <div className="text-xs font-medium tracking-wider text-flore-gray uppercase">Khách hàng hài lòng</div>
                            </div>
                            <div>
                                <div className="text-4xl font-serif text-flore-dark mb-2">15+</div>
                                <div className="text-xs font-medium tracking-wider text-flore-gray uppercase">Nghệ nhân tài năng</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline Section */}
            <div className="bg-flore-bg py-24 md:py-32 relative overflow-hidden">
                <div className="w-full px-6 md:px-10 lg:px-16 relative z-10">
                    <SectionTitle 
                        subtitle="Nhìn lại quá khứ" 
                        title="Hành trình phát triển" 
                        centered={true}
                    />
                    
                    <div className="max-w-4xl mx-auto mt-16 md:mt-24 relative">
                        {/* Center Line for Desktop */}
                        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-[1px] bg-gray-300/50"></div>
                        
                        {timeline.map((item, index) => (
                            <TimelineItem 
                                key={item.id}
                                year={item.year}
                                title={item.title}
                                description={item.description}
                                isLeft={index % 2 === 0}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="py-24 md:py-32 w-full px-6 md:px-10 lg:px-16">
                <SectionTitle 
                    subtitle="Những bàn tay tài hoa" 
                    title="Đội ngũ nghệ nhân" 
                    centered={true}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mt-16">
                    {team.map((member) => (
                        <TeamCard 
                            key={member.id}
                            name={member.name}
                            role={member.role}
                            image={member.image}
                        />
                    ))}
                </div>
            </div>

            {/* Quote Section */}
            <div className="bg-flore-bg py-24 md:py-32 border-t border-b border-flore-pink/30">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <div className="text-4xl text-flore-pink mb-6">❝</div>
                    <p className="text-2xl md:text-4xl font-serif text-flore-dark leading-snug mb-8">
                        "Flowers are the music of the ground. From earth's lips spoken without sound."
                    </p>
                    <p className="text-sm font-medium tracking-widest text-flore-gray uppercase italic">
                        — Edwin Curran
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
