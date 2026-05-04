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
            <div className="max-w-7xl mx-auto px-4">
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
                                <h2 className="text-lg font-serif text-gray-800 mb-4">Địa chỉ của tôi</h2>
                                <p className="text-sm text-gray-500">Chức năng đang được phát triển...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
