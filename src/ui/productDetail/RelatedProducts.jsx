import React from 'react';
import { Link } from 'react-router-dom';

export default function RelatedProducts({ products }) {
    if (!products || products.length === 0) return null;

    return (
        <div className="mt-20">
            <h2 className="text-2xl font-serif text-gray-800 mb-6">Có thể bạn sẽ yêu thích</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {products.map(p => (
                    <Link key={p.id} to={`/shop/${p.id}`} className="group block">
                        <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 shadow-sm relative">
                            <img 
                                src={p.image} 
                                alt={p.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {p.tag && (
                                <div className="absolute top-2 left-2 bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded font-medium">
                                    {p.tag}
                                </div>
                            )}
                        </div>
                        <div className="mt-3">
                            <h3 className="text-sm font-semibold text-gray-800 truncate">{p.name}</h3>
                            <p className="text-sm font-bold text-[#FFB6C1] mt-1">{p.priceFormatted}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
