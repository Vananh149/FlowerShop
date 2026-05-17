import React from 'react';

export default function FilterSection({ title, children }) {
  return (
    <div className="mb-8 last:mb-0">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
        {title}
      </h3>
      <div>
        {children}
      </div>
    </div>
  );
}
