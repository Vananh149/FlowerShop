import React, { useRef } from 'react';
import { UploadCloud, X } from 'lucide-react';

export default function ImageUpload({ images, onImagesChange }) {
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            // Lưu url tạm thời để preview
            const newImages = files.map(file => ({
                file,
                previewUrl: URL.createObjectURL(file)
            }));
            onImagesChange([...images, ...newImages]);
        }
    };

    const removeImage = (indexToRemove) => {
        const imageToRemove = images[indexToRemove];
        URL.revokeObjectURL(imageToRemove.previewUrl); // Giải phóng bộ nhớ
        
        const filteredImages = images.filter((_, index) => index !== indexToRemove);
        onImagesChange(filteredImages);
    };

    return (
        <div className="w-full">
            <div 
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
            >
                <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
                <div className="flex flex-col items-center justify-center text-gray-500">
                    <UploadCloud className="w-10 h-10 text-[#FFB6C1] mb-2" />
                    <p className="text-sm font-medium">Bấm vào đây để tải ảnh lên</p>
                    <p className="text-xs mt-1 text-gray-400">Hỗ trợ JPG, PNG (Tối đa 5MB)</p>
                </div>
            </div>

            {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-4">
                    {images.map((img, idx) => (
                        <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square">
                            <img 
                                src={img.previewUrl} 
                                alt={`preview-${idx}`} 
                                className="w-full h-full object-cover"
                            />
                            <button 
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="absolute top-1 right-1 bg-white/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
