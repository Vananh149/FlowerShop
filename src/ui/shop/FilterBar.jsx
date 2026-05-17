export default function FilterBar({ categories, activeCategory, onCategoryChange }) {
    return (
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
            {categories.map(category => (
                <button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                        activeCategory === category 
                            ? 'bg-flore-accent text-white shadow-md' 
                            : 'bg-flore-beige/30 text-gray-600 hover:bg-flore-beige/60'
                    }`}
                >
                    {category}
                </button>
            ))}
        </div>
    );
}
