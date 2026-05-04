export default function Button({ children, variant = 'primary', className = '', ...props }) {
    const baseStyle = "px-6 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow-md";
    
    const variants = {
        primary: "bg-flore-accent text-white hover:bg-opacity-90",
        secondary: "bg-flore-pink/10 text-flore-accent hover:bg-flore-pink hover:text-white",
        outline: "border-2 border-flore-accent text-flore-accent hover:bg-flore-accent hover:text-white"
    };

    return (
        <button 
            className={`${baseStyle} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
