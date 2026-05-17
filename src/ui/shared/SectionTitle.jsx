import React from 'react';

export default function SectionTitle({ title, subtitle, centered = false }) {
    return (
        <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
            {subtitle && (
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-flore-gray mb-3 animate-[fadeIn_0.5s_ease-out]">
                    {subtitle}
                </p>
            )}
            <h2 className="text-3xl md:text-4xl font-serif text-flore-dark animate-[fadeIn_0.7s_ease-out]">
                {title}
            </h2>
        </div>
    );
}
