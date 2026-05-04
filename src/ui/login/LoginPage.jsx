import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import InputField from '../shared/InputField';
import SocialButton from '../shared/SocialButton';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!email) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email không đúng định dạng';
        }

        if (!password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        } else if (password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            setIsLoading(true);
            // Simulate API call
            setTimeout(() => {
                console.log('Login Form Submitted:', { email, password, rememberMe });
                login({ 
                    name: email.split('@')[0], // Tên giả lập từ email
                    email: email,
                    avatar: "" // Có thể bỏ trống để dùng chữ cái đầu
                });
                setIsLoading(false);
                navigate('/');
            }, 1500);
        }
    };

    const GoogleIcon = () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
    );

    const AppleIcon = () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.79 3.59-.76 1.54.04 2.8.76 3.55 1.87-3.05 1.83-2.58 5.86.32 6.96-.65 1.64-1.49 3.23-2.54 4.1z" />
            <path d="M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
        </svg>
    );

    return (
        <div 
            className="min-h-screen flex flex-col items-center justify-center p-4 relative"
            style={{
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuADa_vBdb0atXmNFG4a5V2_43Lv7OurXPTz7pf_PmMjDkW3fRVW-k-oGgcXcmZTOog-19qzKJbK1BBGnmRLqfigh-gNjPs3-xgyw4SdSHgv2s6rnvSZBmU_v2wuqIaZzr9JBryM-z9__8EoJdyKLpm26JRcf0u5qhOAm2jKhqEzkW9T7DpV-hIvjOpHgCmMzAFuaK28Nuh8Fm2oW8_JxnUv_eh46aJGE4N2ygg7qm6V4VveUWaMigpZSjzcgoK9_InWJJCFXrZFG-c")', // Beautiful soft floral background
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Dark/Blur Overlay to make card pop */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] z-0"></div>
            
            {/* Login Card */}
            <div className="w-full max-w-[440px] bg-white rounded-3xl shadow-2xl p-8 md:p-10 transform transition-all duration-700 hover:scale-[1.01] animate-[fadeIn_0.6s_ease-out] relative z-10">
                
                {/* Header */}
                <div className="text-center mb-8 relative">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="absolute left-0 top-1 text-gray-400 hover:text-gray-800 transition-colors flex items-center text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Quay lại
                    </button>
                    
                    <h1 className="text-4xl font-serif font-bold text-gray-800 tracking-widest mt-12 md:mt-0">FLORÉ</h1>
                    <p className="text-[10px] text-gray-400 font-semibold tracking-[0.25em] uppercase mt-2">
                        Trải nghiệm hoa được tuyển chọn
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <InputField
                        label="Email"
                        icon={Mail}
                        type="email"
                        placeholder="yourname@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={errors.email}
                    />

                    <InputField
                        label="Mật khẩu"
                        icon={Lock}
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={errors.password}
                    />

                    <div className="flex items-center justify-between text-sm mt-3 mb-8">
                        <label className="flex items-center text-gray-600 cursor-pointer group select-none">
                            <div className="relative flex items-center justify-center w-4 h-4 border border-gray-300 rounded mr-2 group-hover:border-soft-pink-login transition-colors">
                                <input
                                    type="checkbox"
                                    className="peer sr-only"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <div className="absolute inset-0 bg-soft-pink-login scale-0 peer-checked:scale-100 transition-transform rounded flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            Ghi nhớ trong 30 ngày
                        </label>
                        <a href="#" className="text-soft-pink-login font-semibold hover:underline transition-all">
                            Quên mật khẩu?
                        </a>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-soft-pink-login text-white py-3.5 rounded-full font-semibold shadow-lg shadow-pink-200/50 hover:bg-pink-500 transition-all duration-300 transform active:scale-[0.98] hover:-translate-y-0.5 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            "Đăng nhập"
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-8">
                    <div className="flex-1 border-t border-gray-100"></div>
                    <span className="px-4 text-[11px] font-bold text-gray-300 tracking-widest uppercase">Hoặc tiếp tục với</span>
                    <div className="flex-1 border-t border-gray-100"></div>
                </div>

                {/* Social Login */}
                <div className="flex space-x-4">
                    <SocialButton provider="Google">
                        <GoogleIcon />
                    </SocialButton>
                    <SocialButton provider="Apple">
                        <AppleIcon />
                    </SocialButton>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    Bạn mới đến với FLORÉ?{" "}
                    <Link to="/register" className="font-semibold text-gray-900 hover:text-soft-pink-login transition-colors">
                        Tạo tài khoản
                    </Link>
                </div>
            </div>
            
            {/* Custom Animation Keyframes via Tailwind Arbitrary Values */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
