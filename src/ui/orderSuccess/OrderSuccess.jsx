import React, { useState, useEffect } from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import SuccessMessage from './SuccessMessage';
import OrderSummary from './OrderSummary';

export default function OrderSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const orderData = location.state?.orderData;
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading state for skeleton
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // If no order data, redirect to home
    if (!orderData && !isLoading) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="bg-[#FDFCFB] min-h-screen py-16 px-4">
            <div className="w-full px-6 md:px-10 lg:px-16 flex flex-col items-center">
                <SuccessMessage isLoading={isLoading} />
                
                {isLoading ? (
                    <OrderSummarySkeleton />
                ) : (
                    <OrderSummary orderData={orderData} />
                )}

                <div className="mt-8 flex flex-col items-center">
                    <button 
                        onClick={() => navigate('/')}
                        className="bg-[#FFB6C1] text-white px-6 py-3 rounded-full hover:scale-105 transition-transform duration-300 shadow-sm font-medium"
                    >
                        Tiếp tục mua sắm →
                    </button>
                    <p className="text-xs text-gray-400 mt-4 text-center">
                        Hỗ trợ khách hàng: 1900 8888
                    </p>
                </div>
            </div>
        </div>
    );
}

function OrderSummarySkeleton() {
    return (
        <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-[#F1F1F1] p-6 mt-10 animate-pulse">
            <div className="flex justify-between border-b border-[#F1F1F1] pb-4 mb-4">
                <div className="w-24 h-4 bg-gray-200 rounded"></div>
                <div className="w-24 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="py-3 border-b border-[#F1F1F1] flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                    <div className="space-y-2">
                        <div className="w-32 h-4 bg-gray-200 rounded"></div>
                        <div className="w-16 h-3 bg-gray-200 rounded"></div>
                    </div>
                </div>
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-2">
                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                    <div className="w-32 h-3 bg-gray-200 rounded"></div>
                    <div className="w-48 h-3 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-2">
                    <div className="w-32 h-4 bg-gray-200 rounded"></div>
                    <div className="w-full h-12 bg-gray-50 rounded-lg"></div>
                </div>
            </div>
        </div>
    );
}
