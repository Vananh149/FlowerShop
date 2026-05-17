import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, Package, RefreshCcw, X, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        type: '',
        category: '',
        price: '',
        description: '',
        image: '',
        tag: '',
        isPopular: false
    });

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/products');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            toast.error("Lỗi khi tải danh sách hoa");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                type: product.type || '',
                category: product.category || '',
                price: product.price,
                description: product.description || '',
                image: product.image,
                tag: product.tag || '',
                isPopular: product.isPopular || false
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '', type: '', category: '', price: '', description: '', image: '', tag: '', isPopular: false
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editingProduct 
            ? `/api/products/${editingProduct._id}` 
            : '/api/products';
        const method = editingProduct ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                toast.success(editingProduct ? "Đã cập nhật sản phẩm!" : "Đã thêm sản phẩm mới!");
                setIsModalOpen(false);
                fetchProducts();
            }
        } catch (error) {
            toast.error("Lỗi khi lưu sản phẩm");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
            try {
                const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    toast.success("Đã xóa sản phẩm thành công!");
                    fetchProducts();
                }
            } catch (error) {
                toast.error("Lỗi khi xóa sản phẩm");
            }
        }
    };

    const filteredProducts = useMemo(() => {
        return products.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            p.type?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    return (
        <div className="animate-[fadeIn_0.5s_ease-out]">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-serif text-gray-800">Quản lý sản phẩm</h1>
                    <p className="text-sm text-gray-400 mt-1">Quản lý kho hoa và danh mục sản phẩm</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchProducts} className="p-2.5 bg-white border border-gray-100 rounded-full text-gray-400 hover:text-pink-400 hover:shadow-sm transition-all">
                        <RefreshCcw size={20} className={isLoading ? 'animate-spin' : ''} />
                    </button>
                    <button 
                        onClick={() => handleOpenModal()}
                        className="bg-[#8C5D5D] text-white px-6 py-2.5 rounded-full text-sm font-medium shadow-md hover:scale-105 transition-transform flex items-center gap-2"
                    >
                        <Plus size={18} /> Thêm sản phẩm
                    </button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Tìm theo tên hoa hoặc loại hoa..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-pink-100"
                    />
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 px-4">
                    TỔNG CỘNG: <span className="text-[#8C5D5D]">{filteredProducts.length} SẢN PHẨM</span>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-pink-100 border-t-pink-400 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400 text-sm italic">Đang tải danh sách hoa...</p>
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Hình ảnh</th>
                                <th className="px-6 py-4">Thông tin hoa</th>
                                <th className="px-6 py-4">Loại hoa</th>
                                <th className="px-6 py-4">Giá bán</th>
                                <th className="px-6 py-4 text-center">Nổi bật</th>
                                <th className="px-6 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm">
                            {filteredProducts.map((p) => (
                                <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <img src={p.image} className="w-14 h-14 rounded-xl object-cover border border-white shadow-sm" alt={p.name} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-800">{p.name}</p>
                                        <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-tight">{p.category}</p>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 font-medium">
                                        {p.type}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-[#8C5D5D]">
                                        {Number(p.price).toLocaleString()}đ
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {p.isPopular ? <span className="text-pink-400">❤</span> : <span className="text-gray-200">❤</span>}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => handleOpenModal(p)}
                                                className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg transition-all"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(p._id)}
                                                className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Package size={48} className="text-gray-100 mb-4" />
                        <p className="text-gray-400 italic">Không tìm thấy sản phẩm nào.</p>
                    </div>
                )}
            </div>

            {/* Modal Thêm/Sửa */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-[modalIn_0.3s_ease-out]">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-xl font-serif text-gray-800">
                                {editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm hoa mới"}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Tên hoa</label>
                                <input 
                                    required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-pink-100"
                                />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Giá bán (VNĐ)</label>
                                <input 
                                    required type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-pink-100"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Loại hoa</label>
                                <input 
                                    value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}
                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-pink-100"
                                    placeholder="VD: Hoa hồng, Hoa cúc..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Phân loại</label>
                                <input 
                                    value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-pink-100"
                                    placeholder="VD: Bó hoa, Kệ hoa..."
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Link hình ảnh</label>
                                <div className="flex gap-3">
                                    <input 
                                        required value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})}
                                        className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-pink-100"
                                        placeholder="Dán link ảnh từ web hoặc Cloudinary..."
                                    />
                                    {formData.image && <img src={formData.image} className="w-12 h-12 rounded-lg object-cover border border-gray-100" alt="Preview" />}
                                </div>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Mô tả sản phẩm</label>
                                <textarea 
                                    rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-pink-100 resize-none"
                                ></textarea>
                            </div>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="checkbox" checked={formData.isPopular} onChange={(e) => setFormData({...formData, isPopular: e.target.checked})}
                                    className="w-4 h-4 rounded text-pink-400 focus:ring-pink-100"
                                />
                                <label className="text-sm text-gray-600">Đặt làm sản phẩm nổi bật</label>
                            </div>
                            <div className="col-span-2 flex gap-4 mt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-3 bg-gray-100 rounded-xl text-gray-500 font-bold hover:bg-gray-200 transition-all uppercase text-xs">Hủy</button>
                                <button type="submit" className="flex-1 px-6 py-3 bg-[#8C5D5D] rounded-xl text-white font-bold hover:shadow-lg transition-all uppercase text-xs">Lưu sản phẩm</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes modalIn {
                    from { opacity: 0; transform: scale(0.95) translateY(-20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </div>
    );
}
