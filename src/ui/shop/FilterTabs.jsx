import React from 'react';

export default function FilterTabs({ tabs, activeTab, onTabChange }) {
    return (
        <div className="flex flex-wrap justify-center gap-3">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                        activeTab === tab.id
                            ? 'bg-[#FFB6C1] text-white shadow-md border-transparent'
                            : 'bg-white text-[#777777] border border-[#F1F1F1] hover:bg-gray-50 hover:text-[#333333]'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
