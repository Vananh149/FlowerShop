import React from 'react';

export default function TimelineItem({ year, title, description, isLeft }) {
    return (
        <div className={`flex flex-col md:flex-row w-full mb-16 md:mb-24 relative group ${isLeft ? 'md:flex-row-reverse' : ''}`}>
            
            {/* Timeline Dot (Desktop only) */}
            <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-flore-dark border-[3px] border-white shadow-sm top-2 z-10 group-hover:scale-[1.6] group-hover:bg-flore-pink transition-all duration-500"></div>

            {/* Empty space for opposite side */}
            <div className="hidden md:block w-1/2"></div>

            {/* Content */}
            <div className={`w-full md:w-1/2 ${isLeft ? 'md:pr-16 md:text-right' : 'md:pl-16'} pl-8 md:pl-0 relative`}>
                
                {/* Timeline Dot (Mobile only) */}
                <div className="md:hidden absolute left-0 top-2.5 w-3 h-3 rounded-full bg-flore-dark border-2 border-white shadow-sm z-10"></div>
                
                {/* Mobile Line */}
                <div className="md:hidden absolute left-[5px] top-4 bottom-[-64px] w-[2px] bg-gray-100 last:hidden"></div>

                <div className="text-flore-pink font-serif text-3xl font-bold mb-3 tracking-wider">{year}</div>
                <h3 className="text-xl font-serif text-flore-dark mb-4">{title}</h3>
                <p className="text-flore-gray leading-relaxed text-sm md:text-base font-light">{description}</p>
            </div>
        </div>
    );
}
