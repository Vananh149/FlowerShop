import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function ChatButton() {
  return (
    <button className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white p-4 rounded-full shadow-lg shadow-gray-900/20 hover:scale-110 hover:bg-gray-800 transition-all duration-300 group flex items-center justify-center">
      <MessageCircle className="w-6 h-6" />
      {/* Tooltip on hover */}
      <span className="absolute right-full mr-4 bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Trò chuyện
      </span>
    </button>
  );
}
