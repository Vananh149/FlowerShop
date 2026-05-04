import React from 'react';

export default function SocialButton({ provider, children, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex-1 flex items-center justify-center space-x-2.5 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 active:scale-95"
        >
            {children}
            <span className="text-sm font-semibold text-gray-700">{provider}</span>
        </button>
    );
}
