import React, { useState, useEffect } from 'react';
import { Star, Trash2, Reply, MessageSquare, RefreshCcw, User, Calendar, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminReviews() {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState("");

    const fetchReviews = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/reviews');
            const data = await response.json();
            setReviews(data);
        } catch (error) {
            toast.error("Lỗi khi tải danh sách đánh giá");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa đánh giá này không?")) {
            try {
                const response = await fetch(`http://localhost:5000/api/reviews/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    toast.success("Đã xóa đánh giá thành công!");
                    fetchReviews();
                }
            } catch (error) {
                toast.error("Lỗi khi xóa đánh giá");
            }
        }
    };

    const handleSendReply = (reviewId) => {
        if (!replyText.trim()) return;
        // Giả lập gửi phản hồi (Bạn có thể làm thêm BE sau)
        toast.success("Đã gửi phản hồi cho khách hàng!");
        setReplyingTo(null);
        setReplyText("");
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={14} className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
        ));
    };

    return (
        <div className="animate-[fadeIn_0.5s_ease-out]">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif text-gray-800">Quản lý đánh giá</h1>
                    <p className="text-sm text-gray-400 mt-1">Lắng nghe ý kiến và phản hồi khách hàng</p>
                </div>
                <button onClick={fetchReviews} className="p-2.5 bg-white border border-gray-100 rounded-full text-gray-400 hover:text-pink-400 hover:shadow-sm transition-all">
                    <RefreshCcw size={20} className={isLoading ? 'animate-spin' : ''} />
                </button>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-pink-100 border-t-pink-400 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-400 text-sm italic">Đang tải đánh giá...</p>
                </div>
            ) : reviews.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                    {reviews.map((review) => (
                        <div key={review._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
                            {/* Decorative accent */}
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#FFB6C1] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Left: User Info */}
                                <div className="md:w-48 shrink-0">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-[#FFB6C1] font-bold text-sm">
                                            {(review.userName || review.name || 'K').charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{review.userName || review.name || 'Khách hàng'}</h4>
                                            <div className="flex mt-0.5">{renderStars(review.rating)}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                        <Calendar size={12} />
                                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                    </div>
                                </div>

                                {/* Right: Content */}
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600 leading-relaxed italic mb-4">
                                        "{review.comment || review.content}"
                                    </p>

                                    {review.image && (
                                        <div className="mb-4">
                                            <img 
                                                src={review.image} 
                                                alt="Review" 
                                                className="w-24 h-24 rounded-2xl object-cover border-2 border-white shadow-sm hover:scale-110 transition-transform cursor-zoom-in"
                                            />
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4 border-t border-gray-50 pt-4">
                                        <button 
                                            onClick={() => setReplyingTo(replyingTo === review._id ? null : review._id)}
                                            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-blue-400 transition-colors uppercase tracking-widest"
                                        >
                                            <Reply size={14} /> Phản hồi
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(review._id)}
                                            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-red-400 transition-colors uppercase tracking-widest"
                                        >
                                            <Trash2 size={14} /> Xóa
                                        </button>
                                    </div>

                                    {/* Reply Form */}
                                    {replyingTo === review._id && (
                                        <div className="mt-4 bg-gray-50 p-4 rounded-2xl animate-[slideDown_0.3s_ease-out]">
                                            <textarea 
                                                autoFocus
                                                placeholder="Viết lời cảm ơn hoặc phản hồi cho khách hàng..."
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                className="w-full bg-white border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-pink-100 outline-none resize-none h-20"
                                            ></textarea>
                                            <div className="flex justify-end mt-3">
                                                <button 
                                                    onClick={() => handleSendReply(review._id)}
                                                    className="bg-[#FFB6C1] text-white px-6 py-2 rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all uppercase"
                                                >
                                                    Gửi phản hồi
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-gray-100 p-20 text-center shadow-sm">
                    <MessageSquare size={48} className="text-gray-100 mx-auto mb-4" />
                    <p className="text-gray-400 italic">Chưa có đánh giá nào từ khách hàng.</p>
                </div>
            )}

            <style>{`
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
