import React from 'react';

export default function TeamCard({ name, role, image }) {
    return (
        <div className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-2xl mb-6 aspect-[3/4] shadow-sm">
                <img 
                    src={image} 
                    alt={name} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            <div className="text-center">
                <h3 className="font-serif text-lg text-flore-dark mb-1.5">{name}</h3>
                <p className="text-[11px] tracking-[0.15em] text-flore-gray uppercase font-medium">{role}</p>
            </div>
        </div>
    );
}
