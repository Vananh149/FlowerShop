import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function InputField({ label, icon: Icon, type = 'text', placeholder, value, onChange, error }) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Icon className="w-5 h-5" />
                </div>
                <input
                    type={inputType}
                    className={`w-full pl-11 pr-10 py-3 border rounded-xl outline-none transition-all duration-300 text-gray-800 ${
                        error 
                            ? 'border-red-300 ring-2 ring-red-100 bg-red-50/50' 
                            : 'border-gray-200 bg-gray-50/50 focus:bg-white focus:border-soft-pink-login focus:ring-2 focus:ring-pink-100'
                    }`}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
                {isPassword && (
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                )}
            </div>
            {/* Error Message */}
            <div className={`mt-1.5 text-xs font-medium text-red-500 transition-all duration-300 overflow-hidden flex items-center ${error ? 'max-h-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                {error && <span className="mr-1">⚠</span>} {error}
            </div>
        </div>
    );
}
