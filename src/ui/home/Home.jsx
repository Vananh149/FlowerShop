import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "../shared/ProductCard";
import Newsletter from "./Newsletter";
import PromoMarquee from "./PromoMarquee";

import { products as allProducts } from "../../data/products";

export default function Home() {
    const products = allProducts.slice(0, 4);

    return (
        <div className="bg-white overflow-x-hidden text-[#4A4A4A]">
            <section className="relative w-full h-[600px] lg:h-[800px] bg-flore-beige overflow-hidden">
                <div className="absolute inset-0">
                    <img 
                        alt="Beautiful Ranunculus Flowers" 
                        className="w-full h-full object-cover object-center opacity-90 transition-transform duration-1000 hover:scale-105" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbsM9QwvN3BAz7MV73fzif4_ss_1z4jhlh_L0KkERmQx7IV22uaq1U51ldACdAa72BzJe_kvCkTWoVnMFHRj9_hF0vD27Exmggxy2CVMZfSUYtqYn0_phPnEd4zzRyrvYGqAw6OtUQ7zZNkSz8c09hs_MqakoSBG7QStCx8ojFxms79-9_AV2Vq45qvPA5bC5Pp2Tb2xkQhmpeqnquRlpWf_ZXNJpuYvH1hWZKKXXPsEo3aI8_SnMFJYoyLdXU6u4tTIcqbO5t6QM" 
                    />
                </div>
                <div className="relative z-10 w-full px-6 md:px-10 lg:px-16 h-full flex items-center">
                    <div className="max-w-xl">
                        <p className="uppercase tracking-[0.2em] text-xs font-semibold text-flore-accent mb-4 transition-all duration-500 hover:tracking-[0.25em]">
                            Artisan Florist Vietnam
                        </p>
                        <h1 className="text-5xl lg:text-7xl font-serif text-gray-800 leading-tight mb-6">
                            Gửi trao yêu thương<br/>qua những bó hoa
                        </h1>
                        <p className="text-gray-600 text-lg mb-8 max-w-md leading-relaxed">
                            Mỗi nhành hoa tại Floré là một tác phẩm nghệ thuật thủ công, được tuyển chọn kỹ lưỡng để kể câu chuyện của riêng bạn.
                        </p>
                        <Link to="/shop" className="inline-block border-2 border-gray-800 text-gray-800 font-medium py-3 px-8 rounded-full hover:bg-gray-800 hover:text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                            Khám phá bộ sưu tập
                        </Link>
                    </div>
                </div>
            </section>

            <PromoMarquee />

            <section className="py-20 bg-white">
                <div className="w-full px-6 md:px-10 lg:px-16">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-serif text-gray-800 mb-4 transition-colors hover:text-flore-accent">
                            Sản phẩm bán chạy
                        </h2>
                        <p className="text-gray-500">
                            Những thiết kế hoa được yêu thích nhất bởi khách hàng tinh tế của Floré.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((p) => (
                            <ProductCard 
                                key={p.id} 
                                id={p.id}
                                image={p.image} 
                                name={p.name} 
                                price={p.price} 
                            />
                        ))}
                    </div>
                </div>
            </section>

            <Newsletter />
        </div>
    );
}