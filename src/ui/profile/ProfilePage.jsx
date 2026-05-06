import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import ProfileInfo from './ProfileInfo';
import OrderList from './OrderList';

export default function ProfilePage() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.tab || 'info');

    useEffect(() => {
        if (location.state?.tab) {
            setActiveTab(location.state.tab);
        }
    }, [location.state]);

    const handleLogout = () => {
        logout(); // Assuming this clears state and localStorage
        navigate('/');
    };

    return (
        <div className="bg-[#FDFCFB] min-h-screen py-10">
            <div className="w-full px-6 md:px-10 lg:px-16">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Sidebar 
                            activeTab={activeTab} 
                            setActiveTab={setActiveTab} 
                            handleLogout={handleLogout} 
                        />
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {activeTab === 'info' && (
                            <>
                                <ProfileInfo />
                                <OrderList />
                            </>
                        )}
                        {activeTab === 'orders' && (
                            <OrderList />
                        )}
                        {activeTab === 'address' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-[#F1F1F1] p-6 lg:p-8 animate-in fade-in duration-500">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
                                    <h2 className="text-xl font-serif text-[#333333]">Địa chỉ của tôi</h2>
                                    <button className="bg-[#FFB6C1] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#734A4A] transition-colors shadow-sm">
                                        + Thêm địa chỉ mới
                                    </button>
                                </div>
                                
                                {/* Address Card */}
                                <div className="border border-pink-100 rounded-xl p-5 relative bg-[#FFF5F7]">
                                    <div className="absolute top-5 right-5 flex gap-4 text-sm">
                                        <button className="text-[#FFB6C1] font-medium hover:text-[#734A4A] transition-colors">Cập nhật</button>
                                    </div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-medium text-[#333333] text-lg">Nguyễn Văn A</h3>
                                        <span className="text-gray-300">|</span>
                                        <span className="text-gray-600">0901234567</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">12 Nguyễn Văn Bảo, Phường 4</p>
                                    <p className="text-sm text-gray-600 mb-3">Quận Gò Vấp, TP. Hồ Chí Minh</p>
                                    <span className="inline-block border border-[#FFB6C1] text-[#FFB6C1] text-xs px-2 py-1 rounded bg-white">
                                        Mặc định
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
