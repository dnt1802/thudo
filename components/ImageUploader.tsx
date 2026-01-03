
import React from 'react';

interface ImageUploaderProps {
  label: string;
  onImageSelect: (data: string, mimeType: string) => void;
  previewUrl: string | null;
  id: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ label, onImageSelect, previewUrl, id }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        const base64Data = result.split(',')[1];
        onImageSelect(base64Data, file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor={id} className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
        {label}
      </label>
      <div 
        className={`relative h-64 w-full border-2 border-dashed rounded-xl flex items-center justify-center overflow-hidden transition-all
          ${previewUrl ? 'border-indigo-400 bg-white' : 'border-slate-300 bg-slate-100 hover:border-indigo-300 hover:bg-slate-50'}`}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
        ) : (
          <div className="flex flex-col items-center text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs">Nhấn để tải ảnh lên</span>
          </div>
        )}
        <input 
          id={id}
          type="file" 
          accept="image/*" 
          onChange={handleChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default ImageUploader;
