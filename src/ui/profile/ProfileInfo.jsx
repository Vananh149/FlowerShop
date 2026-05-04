import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileInfo() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    
    // Mock data for demo since real user object might not have all fields
    const [formData, setFormData] = useState({
        name: user?.name || 'Nguyễn Văn A',
        email: user?.email || 'user@example.com',
        phone: '0901234567',
        dob: '1995-05-15',
        gender: 'Nữ'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        setIsEditing(false);
        // call api to save
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-[#F1F1F1] p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-serif text-gray-800">Thông tin cá nhân</h2>
                {isEditing ? (
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setIsEditing(false)}
                            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm hover:bg-gray-200 transition-colors"
                        >
                            Hủy
                        </button>
                        <button 
                            onClick={handleSave}
                            className="bg-[#2ECC71] text-white px-4 py-2 rounded-full text-sm hover:scale-105 transition-transform shadow-sm"
                        >
                            Lưu thay đổi
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="bg-[#8C5D5D] text-white px-4 py-2 rounded-full text-sm hover:scale-105 transition-transform shadow-sm"
                    >
                        Chỉnh sửa thông tin
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="border-b border-gray-100 pb-4">
                    <label className="block text-xs text-gray-400 mb-1">Họ và tên</label>
                    {isEditing ? (
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full text-sm text-gray-700 font-medium border rounded p-2 focus:outline-none focus:border-[#F472B6]" />
                    ) : (
                        <p className="text-sm text-gray-700 font-medium">{formData.name}</p>
                    )}
                </div>
                <div className="border-b border-gray-100 pb-4">
                    <label className="block text-xs text-gray-400 mb-1">Email</label>
                    {isEditing ? (
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full text-sm text-gray-700 font-medium border rounded p-2 focus:outline-none focus:border-[#F472B6] bg-gray-50" disabled />
                    ) : (
                        <p className="text-sm text-gray-700 font-medium">{formData.email}</p>
                    )}
                </div>
                <div className="border-b border-gray-100 pb-4">
                    <label className="block text-xs text-gray-400 mb-1">Số điện thoại</label>
                    {isEditing ? (
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full text-sm text-gray-700 font-medium border rounded p-2 focus:outline-none focus:border-[#F472B6]" />
                    ) : (
                        <p className="text-sm text-gray-700 font-medium">{formData.phone}</p>
                    )}
                </div>
                <div className="border-b border-gray-100 pb-4">
                    <label className="block text-xs text-gray-400 mb-1">Ngày sinh</label>
                    {isEditing ? (
                        <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full text-sm text-gray-700 font-medium border rounded p-2 focus:outline-none focus:border-[#F472B6]" />
                    ) : (
                        <p className="text-sm text-gray-700 font-medium">{formData.dob}</p>
                    )}
                </div>
                <div className="border-b border-gray-100 pb-4 md:col-span-2 lg:col-span-1">
                    <label className="block text-xs text-gray-400 mb-1">Giới tính</label>
                    {isEditing ? (
                        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full text-sm text-gray-700 font-medium border rounded p-2 focus:outline-none focus:border-[#F472B6]">
                            <option value="Nữ">Nữ</option>
                            <option value="Nam">Nam</option>
                            <option value="Khác">Khác</option>
                        </select>
                    ) : (
                        <p className="text-sm text-gray-700 font-medium">{formData.gender}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
