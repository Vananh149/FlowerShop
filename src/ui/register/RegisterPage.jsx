import React, { useState } from 'react';
import { User, Mail, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../shared/InputField';
import SocialButton from '../shared/SocialButton';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateField = (name, value, currentForm) => {
        let error = '';
        if (name === 'name' && !value.trim()) {
            error = 'Vui lòng nhập họ và tên';
        }
        if (name === 'email') {
            if (!value) error = 'Vui lòng nhập email';
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Email không đúng định dạng';
        }
        if (name === 'password') {
            if (!value) error = 'Vui lòng nhập mật khẩu';
            else if (value.length < 6) error = 'Mật khẩu phải có ít nhất 6 ký tự';
        }
        if (name === 'confirmPassword') {
            if (!value) error = 'Vui lòng xác nhận mật khẩu';
            else if (value !== currentForm.password) error = 'Mật khẩu không khớp';
        }
        if (name === 'agreeTerms' && !value) {
            error = 'Bạn phải đồng ý với điều khoản sử dụng';
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        const newForm = { ...form, [name]: val };
        setForm(newForm);
        
        // Real-time validation
        const error = validateField(name, val, newForm);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
        
        // Cross-validation: If user changes password, also re-validate confirmPassword
        if (name === 'password' && newForm.confirmPassword) {
            const confirmError = validateField('confirmPassword', newForm.confirmPassword, newForm);
            setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate all fields on submit
        const newErrors = {};
        Object.keys(form).forEach(key => {
            const error = validateField(key, form[key], form);
            if (error) newErrors[key] = error;
        });
        
        setErrors(newErrors);

        // Check if there are any error messages that are not empty strings
        const hasErrors = Object.values(newErrors).some(err => err !== '');
        
        if (!hasErrors) {
            setIsSubmitting(true);
            // Simulate API call
            setTimeout(() => {
                console.log('Register Form Submitted:', form);
                setIsSubmitting(false);
                // navigate('/login'); // Optional redirect after success
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8">
            
            <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row transform transition-all duration-700 hover:shadow-3xl animate-[fadeIn_0.6s_ease-out]">
                
                {/* Left Side Banner */}
                <div className="lg:w-5/12 bg-gradient-to-br from-slate-800 via-stone-700 to-amber-700 p-12 text-white flex flex-col justify-between relative overflow-hidden hidden md:flex">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-amber-500/20 blur-3xl"></div>
                    
                    <div className="relative z-10">
                        <Link to="/" className="inline-block text-2xl font-serif font-bold tracking-widest mb-12 hover:opacity-80 transition-opacity">
                            FLORÉ
                        </Link>
                        
                        <h2 className="text-4xl lg:text-5xl font-serif font-bold leading-tight mb-6">
                            Tham gia<br />hành trình<br />hoa tươi<br />của chúng tôi
                        </h2>
                        
                        <p className="text-slate-200/90 text-sm leading-relaxed max-w-xs">
                            Đăng ký tài khoản để nhận những ưu đãi đặc biệt, theo dõi đơn hàng và tận hưởng trải nghiệm mua sắm tuyệt vời nhất.
                        </p>
                    </div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center space-x-2 text-sm text-slate-300">
                            <span className="w-8 h-px bg-slate-400"></span>
                            <span>Thiết kế độc bản</span>
                        </div>
                    </div>
                </div>

                {/* Right Side Form */}
                <div className="lg:w-7/12 p-8 md:p-12 lg:px-16 lg:py-14 relative flex flex-col justify-center">
                    
                    {/* Mobile Logo & Back button */}
                    <div className="flex items-center justify-between mb-8 lg:hidden">
                        <button 
                            onClick={() => navigate(-1)} 
                            className="text-gray-400 hover:text-gray-800 transition-colors flex items-center text-sm font-medium"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                        </button>
                        <span className="text-xl font-serif font-bold tracking-widest text-gray-800">FLORÉ</span>
                    </div>

                    <div className="hidden lg:block absolute top-8 left-8">
                        <button 
                            onClick={() => navigate(-1)} 
                            className="text-gray-400 hover:text-gray-800 transition-colors flex items-center text-sm font-medium"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Quay lại
                        </button>
                    </div>

                    <div className="mb-8 mt-2 lg:mt-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Bắt đầu hành trình</h1>
                        <p className="text-gray-500 text-sm">Điền thông tin bên dưới để tạo tài khoản mới</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <InputField
                            label="Họ và tên"
                            name="name"
                            icon={User}
                            type="text"
                            placeholder="Nguyễn Văn A"
                            value={form.name}
                            onChange={handleChange}
                            error={errors.name}
                        />

                        <InputField
                            label="Email"
                            name="email"
                            icon={Mail}
                            type="email"
                            placeholder="yourname@email.com"
                            value={form.email}
                            onChange={handleChange}
                            error={errors.email}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4">
                            <InputField
                                label="Mật khẩu"
                                name="password"
                                icon={Lock}
                                type="password"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={handleChange}
                                error={errors.password}
                            />
                            
                            <InputField
                                label="Xác nhận mật khẩu"
                                name="confirmPassword"
                                icon={Lock}
                                type="password"
                                placeholder="••••••••"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                error={errors.confirmPassword}
                            />
                        </div>

                        <div className="mt-2 mb-6">
                            <label className="flex items-start text-sm text-gray-600 cursor-pointer group select-none">
                                <div className="relative flex items-center justify-center w-4 h-4 border border-gray-300 rounded mr-3 mt-0.5 group-hover:border-soft-pink-login transition-colors shrink-0">
                                    <input
                                        type="checkbox"
                                        name="agreeTerms"
                                        className="peer sr-only"
                                        checked={form.agreeTerms}
                                        onChange={handleChange}
                                    />
                                    <div className="absolute inset-0 bg-soft-pink-login scale-0 peer-checked:scale-100 transition-transform rounded flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    Tôi đồng ý với{' '}
                                    <a href="#" className="text-soft-pink-login font-semibold hover:underline">Điều khoản dịch vụ</a>
                                    {' '}và{' '}
                                    <a href="#" className="text-soft-pink-login font-semibold hover:underline">Chính sách bảo mật</a>
                                    {' '}của FLORÉ.
                                    {errors.agreeTerms && (
                                        <p className="text-red-500 text-xs font-medium mt-1">⚠ {errors.agreeTerms}</p>
                                    )}
                                </div>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-pink-400 to-soft-pink-login text-white py-3.5 rounded-full font-semibold shadow-lg shadow-pink-200/50 hover:from-pink-500 hover:to-pink-400 transition-all duration-300 transform active:scale-[0.98] hover:-translate-y-0.5 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "TẠO TÀI KHOẢN"
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-gray-100"></div>
                        <span className="px-4 text-[11px] font-bold text-gray-300 tracking-widest uppercase">Hoặc đăng ký với</span>
                        <div className="flex-1 border-t border-gray-100"></div>
                    </div>

                    {/* Social Login */}
                    <div className="flex space-x-4 mb-6">
                        <SocialButton provider="Google">
                            <GoogleIcon />
                        </SocialButton>
                        <SocialButton provider="Apple">
                            <AppleIcon />
                        </SocialButton>
                    </div>

                    {/* Footer link */}
                    <div className="text-center text-sm text-gray-500 mt-auto">
                        Đã có tài khoản?{" "}
                        <Link to="/login" className="font-semibold text-gray-900 hover:text-soft-pink-login transition-colors">
                            Đăng nhập tại đây
                        </Link>
                    </div>
                </div>
            </div>

            {/* Custom Animation Keyframes */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
