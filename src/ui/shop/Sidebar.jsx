import React from 'react';
import FilterSection from './FilterSection';

export default function Sidebar({ filters, setFilters }) {
  const collections = ['Tất cả các loài hoa', 'Mẫu bán chạy 2026', 'Bộ sưu tập đám cưới'];
  const flowerTypes = ['Hoa hồng', 'Hoa mẫu đơn', 'Hoa baby', 'Hoa tulip', 'Hoa hướng dương'];

  // Handle Collection toggle
  const handleCollectionClick = (col) => {
    setFilters(prev => ({ ...prev, collection: col }));
  };

  // Handle Type toggle
  const handleTypeChange = (type) => {
    setFilters(prev => {
      const isSelected = prev.types.includes(type);
      if (isSelected) {
        return { ...prev, types: prev.types.filter(t => t !== type) };
      } else {
        return { ...prev, types: [...prev.types, type] };
      }
    });
  };

  return (
    <aside className="w-full">
      {/* Collections */}
      <FilterSection title="Bộ sưu tập">
        <ul className="space-y-3">
          {collections.map(col => (
            <li key={col}>
              <button
                onClick={() => handleCollectionClick(col)}
                className={`text-sm transition-colors text-left w-full flex items-center justify-between px-4 py-2 rounded-lg ${filters.collection === col
                    ? 'text-white font-medium'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                style={filters.collection === col ? { backgroundColor: '#7B4D53' } : {}}
              >
                <span>{col}</span>
              </button>
            </li>
          ))}
        </ul>
      </FilterSection>

      {/* Flower Types */}
      <FilterSection title="Loại hoa">
        <div className="space-y-3">
          {flowerTypes.map(type => (
            <label key={type} className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative flex items-center justify-center w-4 h-4 border rounded border-gray-300 group-hover:border-flore-accent">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={filters.types.includes(type)}
                  onChange={() => handleTypeChange(type)}
                />
                <div className="absolute inset-0 bg-flore-accent scale-0 peer-checked:scale-100 transition-transform rounded flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                {type}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Khoảng giá">
        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max="3000000"
            step="100000"
            className="w-full accent-flore-accent"
            value={filters.maxPrice}
            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) }))}
          />
          <div className="flex justify-between text-xs text-gray-500 font-medium">
            <span>0 VND</span>
            <span>{filters.maxPrice.toLocaleString('vi-VN')} VND</span>
          </div>
        </div>
      </FilterSection>
    </aside>
  );
}
