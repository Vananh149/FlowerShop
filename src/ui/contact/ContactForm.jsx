import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/contacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message || 'Cảm ơn bạn đã liên hệ!', {
                    duration: 4000,
                    position: 'top-center',
                    style: { background: '#4CAF50', color: '#fff', borderRadius: '10px' },
                });
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                toast.error(data.message || 'Có lỗi xảy ra, vui lòng thử lại.');
            }
        } catch (error) {
            toast.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại.');
            console.error('Submit error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-[#F1F1F1] p-6 md:p-8">
            <h3 className="text-2xl font-serif text-[#333333] mb-8">Gửi tin nhắn cho chúng tôi</h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Họ và tên *" 
                            required
                            className="w-full bg-gray-50 rounded-lg px-4 py-3.5 text-sm text-[#333333] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] focus:bg-white transition-all border border-transparent focus:border-pink-200"
                        />
                    </div>
                    <div>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email của bạn *" 
                            required
                            className="w-full bg-gray-50 rounded-lg px-4 py-3.5 text-sm text-[#333333] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] focus:bg-white transition-all border border-transparent focus:border-pink-200"
                        />
                    </div>
                </div>
                
                <div>
                    <input 
                        type="text" 
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Tiêu đề *" 
                        required
                        className="w-full bg-gray-50 rounded-lg px-4 py-3.5 text-sm text-[#333333] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] focus:bg-white transition-all border border-transparent focus:border-pink-200"
                    />
                </div>
                
                <div>
                    <textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Nội dung tin nhắn *" 
                        required
                        className="w-full bg-gray-50 rounded-lg px-4 py-3.5 text-sm text-[#333333] placeholder-gray-400 min-h-[140px] resize-y focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] focus:bg-white transition-all border border-transparent focus:border-pink-200"
                    ></textarea>
                </div>
                
                <button 
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-[#FFB6C1] text-white rounded-full py-4 font-medium tracking-wide shadow-md hover:bg-[#734A4A] transform hover:scale-[1.02] transition-all duration-300 mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'ĐANG GỬI...' : 'GỬI TIN NHẮN'}
                </button>
            </form>
        </div>
    );
}
