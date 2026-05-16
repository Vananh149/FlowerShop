import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import ProductCard from '../shared/ProductCard';
import Pagination from '../shared/Pagination';
import ChatButton from '../shared/ChatButton';
import { ChevronDown, Loader2 } from 'lucide-react';

export default function Shop() {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';

    const [allProducts, setAllProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        collection: 'Tất cả các loài hoa',
        types: [],
        occasions: [],
        maxPrice: 3000000,
        color: null
    });

    const [sortOption, setSortOption] = useState('popular');
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch sản phẩm từ MongoDB
    React.useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products');
                const data = await response.json();
                setAllProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Reset page to 1 when filters or search query change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [filters, searchQuery]);

    // Config for 4x4 grid (12 sản phẩm = 4 cột x 3 dòng)
    const itemsPerPage = 12;

    // Filter Logic
    const filteredProducts = useMemo(() => {
        return allProducts.filter(p => {
            // Search Query Filter
            if (searchQuery) {
                const searchLower = searchQuery.toLowerCase().trim();
                const matchName = p.name.toLowerCase().includes(searchLower);
                const matchCategory = p.category?.toLowerCase().includes(searchLower);
                const matchTag = p.tag?.toLowerCase().includes(searchLower);
                const matchType = p.type?.toLowerCase().includes(searchLower); // Thêm tìm kiếm theo loại hoa
                
                if (!matchName && !matchCategory && !matchTag && !matchType) return false;
            }

            // Collection Filter
            if (filters.collection !== 'Tất cả các loài hoa' && p.category !== filters.collection) return false;

            // Types Filter
            if (filters.types.length > 0) {
                const pType = (p.type || '').toLowerCase().trim();
                const hasMatch = filters.types.some(t => t.toLowerCase().trim() === pType);
                if (!hasMatch) return false;
            }

            // Price Filter
            if (p.price > filters.maxPrice) return false;

            // Occasions Filter
            if (filters.occasions && filters.occasions.length > 0) {
                const pOccasion = (p.occasion || '').toString().toLowerCase().trim();
                const hasMatch = filters.occasions.some(o => 
                    o.toString().toLowerCase().trim() === pOccasion
                );
                if (!hasMatch) return false;
            }

            return true;
        });
    }, [filters, searchQuery, allProducts]);

    // Sort Logic
    const sortedProducts = useMemo(() => {
        let sorted = [...filteredProducts];
        switch (sortOption) {
            case 'priceAsc':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'priceDesc':
                sorted.sort((a, b) => b.price - a.price);
                break;
            case 'popular':
            default:
                // Do nothing, default order
                break;
        }
        return sorted;
    }, [filteredProducts, sortOption]);

    // Pagination Logic
    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;
    const paginatedProducts = sortedProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50/50">
                <Loader2 className="w-12 h-12 animate-spin text-[#FFB6C1] mb-4" />
                <p className="text-gray-500 font-serif text-lg">Đang mở cửa hàng...</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50/50 min-h-screen py-16">
            <div className="w-full px-6 md:px-10 lg:px-16 sm:px-6">
                {/* Header Title */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-serif mb-4 text-gray-800">Cửa hàng</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Khám phá bộ sưu tập hoa tươi nghệ thuật, nơi mỗi đóa hoa đều kể một câu chuyện riêng biệt.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Sidebar */}
                    <div className="w-full lg:w-1/4 flex-shrink-0">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:sticky lg:top-24">
                            <Sidebar filters={filters} setFilters={setFilters} />
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="w-full lg:w-3/4">
                        {/* Top Bar: Results Count & Sort */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 gap-4">
                            <p className="text-sm text-gray-500">
                                Hiển thị <span className="font-medium text-gray-900">{paginatedProducts.length}</span> trên <span className="font-medium text-gray-900">{sortedProducts.length}</span> kết quả
                            </p>

                            <div className="relative">
                                <select
                                    className="appearance-none bg-transparent border border-gray-200 text-gray-700 text-sm rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-1 focus:ring-flore-accent focus:border-flore-accent cursor-pointer w-full sm:w-auto"
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                >
                                    <option value="popular">Phổ biến nhất</option>
                                    <option value="priceAsc">Giá tăng dần</option>
                                    <option value="priceDesc">Giá giảm dần</option>
                                </select>
                                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-2.5 pointer-events-none" />
                            </div>
                        </div>

                        {/* Product Grid */}
                        {paginatedProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                                {paginatedProducts.map((p) => (
                                    <ProductCard
                                        key={p._id}
                                        id={p._id}
                                        image={p.image}
                                        name={p.name}
                                        price={p.price}
                                        oldPrice={p.oldPrice}
                                        tag={p.tag}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                                <p className="text-gray-500 mb-4">Không tìm thấy sản phẩm nào phù hợp với bộ lọc hoặc tìm kiếm.</p>
                                <button
                                    onClick={() => {
                                        setFilters({ collection: 'Tất cả các loài hoa', types: [], occasions: [], maxPrice: 3000000, color: null });
                                        setSearchParams({});
                                    }}
                                    className="px-6 py-2 bg-flore-accent text-white rounded-full hover:bg-opacity-90 transition-colors text-sm font-medium"
                                >
                                    Xóa bộ lọc
                                </button>
                            </div>
                        )}

                        {/* Pagination */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>
            </div>

            {/* Chat Button fixed at bottom right */}
            <ChatButton />
        </div>
    );
}
