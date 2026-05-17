import React, { useState, useEffect } from 'react';
import { Search, Mail, MessageSquare, Send, Trash2, CheckCircle2, AlertCircle, RefreshCw, X, Calendar, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminContacts() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'replied'
    const [selectedContact, setSelectedContact] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [sendingReply, setSendingReply] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/contacts');
            const data = await response.json();
            if (response.ok && data.success) {
                setContacts(data.data || []);
            } else {
                toast.error(data.message || "Lỗi tải dữ liệu liên hệ");
            }
        } catch (error) {
            console.error("Lỗi tải liên hệ:", error);
            toast.error("Không thể kết nối đến máy chủ");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const handleDeleteContact = async (id) => {
        try {
            const response = await fetch(`/api/contacts/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (response.ok && data.success) {
                toast.success(data.message || "Xóa tin nhắn liên hệ thành công!");
                setContacts(contacts.filter(c => c._id !== id));
                setConfirmDeleteId(null);
                if (selectedContact?._id === id) {
                    setSelectedContact(null);
                }
            } else {
                toast.error(data.message || "Không thể xóa liên hệ");
            }
        } catch (error) {
            console.error("Lỗi khi xóa liên hệ:", error);
            toast.error("Không thể kết nối đến máy chủ");
        }
    };

    const handleSendReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) {
            toast.error("Vui lòng nhập nội dung phản hồi!");
            return;
        }

        setSendingReply(true);
        try {
            const response = await fetch(`/api/contacts/reply/${selectedContact._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ replyMessage: replyText })
            });
            const data = await response.json();
            if (response.ok && data.success) {
                toast.success("Phản hồi đã được gửi và lưu thành công!");
                
                // Cập nhật lại danh sách local
                setContacts(contacts.map(c => 
                    c._id === selectedContact._id 
                        ? { ...c, isReplied: true, replyMessage: replyText } 
                        : c
                ));
                
                setSelectedContact(null);
                setReplyText('');
            } else {
                toast.error(data.message || "Gặp lỗi khi gửi phản hồi");
            }
        } catch (error) {
            console.error("Lỗi phản hồi liên hệ:", error);
            toast.error("Không thể kết nối đến máy chủ");
        } finally {
            setSendingReply(false);
        }
    };

    const openReplyModal = (contact) => {
        setSelectedContact(contact);
        setReplyText(contact.replyMessage || '');
    };

    // Lọc theo tìm kiếm & tab trạng thái
    const filteredContacts = contacts.filter(contact => {
        const name = (contact.name || '').toLowerCase();
        const email = (contact.email || '').toLowerCase();
        const subject = (contact.subject || '').toLowerCase();
        const message = (contact.message || '').toLowerCase();
        const keyword = searchTerm.toLowerCase();

        const matchesSearch = name.includes(keyword) || email.includes(keyword) || subject.includes(keyword) || message.includes(keyword);
        
        if (activeTab === 'pending') {
            return matchesSearch && !contact.isReplied;
        }
        if (activeTab === 'replied') {
            return matchesSearch && contact.isReplied;
        }
        return matchesSearch;
    });

    const pendingCount = contacts.filter(c => !c.isReplied).length;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-serif text-gray-800">Liên hệ của khách hàng</h1>
                    <p className="text-xs text-gray-400 mt-1">Xem các yêu cầu, ý kiến đóng góp từ khách hàng gửi qua form liên hệ của Floré</p>
                </div>
                <button 
                    onClick={fetchContacts}
                    className="p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm hover:bg-pink-50 hover:text-[#FFB6C1] transition-all flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider"
                >
                    <RefreshCw size={14} className={loading ? "animate-spin text-[#FFB6C1]" : ""} />
                    {loading ? "Đang tải..." : "Tải lại"}
                </button>
            </div>

            {/* Filter Tabs & Search */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                {/* Search */}
                <div className="lg:col-span-2 relative">
                    <Search className="absolute left-4 top-3 text-gray-400 w-4 h-4" />
                    <input 
                        type="text"
                        placeholder="Tìm kiếm tin nhắn theo tên, email, tiêu đề..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-100 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FFB6C1]/20 focus:border-[#FFB6C1] transition-all shadow-sm"
                    />
                </div>
                {/* Tabs */}
                <div className="lg:col-span-2 flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm max-w-md w-full justify-self-end">
                    <button 
                        onClick={() => setActiveTab('all')}
                        className={`flex-1 py-2 text-center text-xs font-bold rounded-xl transition-all ${
                            activeTab === 'all' 
                                ? 'bg-pink-50 text-[#FFB6C1]' 
                                : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        Tất cả ({contacts.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('pending')}
                        className={`flex-1 py-2 text-center text-xs font-bold rounded-xl transition-all flex justify-center items-center gap-1.5 ${
                            activeTab === 'pending' 
                                ? 'bg-[#FFF5F7] text-amber-600' 
                                : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        Chưa phản hồi
                        {pendingCount > 0 && (
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                        )}
                        <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-md text-[10px]">{pendingCount}</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('replied')}
                        className={`flex-1 py-2 text-center text-xs font-bold rounded-xl transition-all ${
                            activeTab === 'replied' 
                                ? 'bg-[#EBFDF5] text-emerald-600' 
                                : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        Đã phản hồi ({contacts.length - pendingCount})
                    </button>
                </div>
            </div>

            {/* List Contact Cards */}
            {loading ? (
                <div className="bg-white border border-gray-100 rounded-3xl py-20 text-center shadow-sm">
                    <RefreshCw className="animate-spin text-[#FFB6C1] mx-auto w-8 h-8 mb-3" />
                    <p className="text-sm text-gray-400">Đang tải tin nhắn liên hệ từ MongoDB...</p>
                </div>
            ) : filteredContacts.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-3xl py-20 text-center shadow-sm">
                    <Mail className="text-gray-300 mx-auto w-12 h-12 mb-3" />
                    <p className="text-sm text-gray-400">Không tìm thấy yêu cầu liên hệ nào phù hợp</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredContacts.map((contact) => (
                        <div 
                            key={contact._id} 
                            className={`bg-white border rounded-3xl p-6 shadow-sm flex flex-col justify-between transition-all relative ${
                                contact.isReplied 
                                    ? 'border-emerald-50 bg-emerald-50/5 hover:border-emerald-100' 
                                    : 'border-amber-100/70 hover:border-amber-200 shadow-[0_4px_20px_-10px_rgba(245,158,11,0.15)]'
                            }`}
                        >
                            {/* Card Top */}
                            <div>
                                <div className="flex justify-between items-start gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-sm border ${
                                            contact.isReplied 
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                                : 'bg-amber-50 text-amber-600 border-amber-100'
                                        }`}>
                                            {contact.name ? contact.name.charAt(0).toUpperCase() : <User size={16} />}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800 text-sm block">{contact.name}</h4>
                                            <span className="text-[10px] text-gray-400 block mt-0.5">{contact.email}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Status Badge */}
                                    {contact.isReplied ? (
                                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-100 uppercase tracking-wide">
                                            <CheckCircle2 size={10} /> Đã phản hồi
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-100 uppercase tracking-wide animate-pulse">
                                            <AlertCircle size={10} /> Chờ phản hồi
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-2 mt-4 bg-gray-50/50 rounded-2xl p-4 border border-gray-50">
                                    <div className="flex items-start gap-2">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mt-0.5">Tiêu đề:</span>
                                        <span className="text-xs font-semibold text-gray-800">{contact.subject}</span>
                                    </div>
                                    <div className="pt-2 border-t border-gray-100/50">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Nội dung thư:</span>
                                        <p className="text-xs text-gray-600 leading-relaxed break-words whitespace-pre-line">{contact.message}</p>
                                    </div>
                                </div>

                                {/* Reply section if replied */}
                                {contact.isReplied && contact.replyMessage && (
                                    <div className="mt-4 bg-emerald-50/20 rounded-2xl p-4 border border-emerald-100/30 animate-in slide-in-from-bottom-2 duration-300">
                                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">Nội dung phản hồi của Admin:</span>
                                        <p className="text-xs text-emerald-800 leading-relaxed italic">"{contact.replyMessage}"</p>
                                    </div>
                                )}
                            </div>

                            {/* Card Bottom / Footer Actions */}
                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-50 flex-wrap gap-3">
                                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                    <Calendar size={12} /> {new Date(contact.createdAt).toLocaleString('vi-VN')}
                                </span>

                                <div className="flex items-center gap-2">
                                    {confirmDeleteId === contact._id ? (
                                        <div className="flex items-center gap-1.5 animate-in fade-in duration-200">
                                            <button 
                                                onClick={() => setConfirmDeleteId(null)}
                                                className="px-2 py-1 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded text-[9px] font-bold uppercase tracking-wider transition-colors border border-gray-100"
                                            >
                                                Hủy
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteContact(contact._id)}
                                                className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-[9px] font-bold uppercase tracking-wider shadow-sm transition-all"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <button 
                                                onClick={() => setConfirmDeleteId(contact._id)}
                                                className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-colors"
                                                title="Xóa liên hệ"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => openReplyModal(contact)}
                                                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm border ${
                                                    contact.isReplied 
                                                        ? 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50' 
                                                        : 'bg-[#FFB6C1] text-white border-transparent hover:bg-[#734A4A]'
                                                }`}
                                            >
                                                {contact.isReplied ? "Xem / Sửa phản hồi" : "Phản hồi ngay"}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Reply Modal */}
            {selectedContact && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]" onClick={() => setSelectedContact(null)}></div>
                    
                    {/* Modal Content */}
                    <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 lg:p-8 animate-in zoom-in-95 fade-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-base font-serif text-gray-800 flex items-center gap-2">
                                <MessageSquare size={18} className="text-[#FFB6C1]" />
                                {selectedContact.isReplied ? 'Chỉnh sửa phản hồi' : 'Gửi phản hồi cho khách hàng'}
                            </h3>
                            <button 
                                onClick={() => setSelectedContact(null)} 
                                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Customer Message details */}
                        <div className="mb-5 bg-gray-50 rounded-2xl p-4 border border-gray-100 text-xs">
                            <div className="grid grid-cols-3 gap-y-2 mb-2 pb-2 border-b border-gray-200/50 text-gray-600">
                                <span className="font-bold">Khách hàng:</span>
                                <span className="col-span-2 font-medium text-gray-800">{selectedContact.name}</span>
                                <span className="font-bold">Email:</span>
                                <span className="col-span-2 font-medium text-gray-800">{selectedContact.email}</span>
                                <span className="font-bold">Tiêu đề:</span>
                                <span className="col-span-2 font-semibold text-gray-800">{selectedContact.subject}</span>
                            </div>
                            <div>
                                <span className="font-bold text-gray-600 block mb-1">Nội dung thư:</span>
                                <p className="text-gray-700 bg-white p-2.5 rounded-lg border border-gray-100 whitespace-pre-wrap leading-relaxed">
                                    {selectedContact.message}
                                </p>
                            </div>
                        </div>

                        {/* Response Form */}
                        <form onSubmit={handleSendReply} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Lời nhắn phản hồi của Admin</label>
                                <textarea 
                                    required 
                                    rows="5"
                                    value={replyText} 
                                    onChange={(e) => setReplyText(e.target.value)}
                                    className="w-full text-xs text-gray-700 font-medium border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#FFB6C1]/20 focus:border-[#FFB6C1] transition-all resize-none leading-relaxed" 
                                    placeholder="Nhập nội dung phản hồi, câu trả lời giải đáp thắc mắc cho khách hàng..."
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button 
                                    type="button"
                                    onClick={() => setSelectedContact(null)}
                                    className="flex-1 py-3 bg-gray-50 text-gray-500 hover:bg-gray-100 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors border border-gray-100"
                                >
                                    Đóng
                                </button>
                                <button 
                                    type="submit"
                                    disabled={sendingReply}
                                    className="flex-1 py-3 bg-[#FFB6C1] text-white hover:bg-[#734A4A] disabled:bg-gray-300 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
                                >
                                    {sendingReply ? (
                                        <>
                                            <RefreshCw size={14} className="animate-spin" /> Đang gửi...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={14} /> Gửi phản hồi
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
