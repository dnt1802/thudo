
import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import { performTryOn } from './services/geminiService';
import { ImageData, ProcessingResult } from './types';

const App: React.FC = () => {
  const [modelImage, setModelImage] = useState<ImageData | null>(null);
  const [garmentImage, setGarmentImage] = useState<ImageData | null>(null);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async () => {
    if (!modelImage || !garmentImage) {
      setError("Yêu cầu upload đủ 2 ảnh: Ảnh người mẫu và Ảnh trang phục.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await performTryOn(modelImage, garmentImage);
      setResult(res);
    } catch (err: any) {
      setError(err.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      const link = document.createElement('a');
      link.href = result.imageUrl;
      link.download = `ket-qua-thay-do-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-6 py-5 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-indigo-200 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">AI Virtual Try-On</h1>
          </div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 bg-neutral-100 px-2 py-1 rounded">Studio Mode</span>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-10 space-y-12">
        {/* Input Boxes */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-neutral-500 uppercase flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-[10px] text-neutral-600">01</span>
              MODEL_IMAGE
            </h3>
            <ImageUploader 
              id="model-image"
              label="Ảnh người mẫu (toàn thân/nửa thân)"
              previewUrl={modelImage ? `data:${modelImage.mimeType};base64,${modelImage.data}` : null}
              onImageSelect={(data, mimeType) => setModelImage({ data, mimeType })}
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-neutral-500 uppercase flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-[10px] text-neutral-600">02</span>
              GARMENT_IMAGE
            </h3>
            <ImageUploader 
              id="garment-image"
              label="Ảnh trang phục mẫu"
              previewUrl={garmentImage ? `data:${garmentImage.mimeType};base64,${garmentImage.data}` : null}
              onImageSelect={(data, mimeType) => setGarmentImage({ data, mimeType })}
            />
          </div>
        </section>

        {/* Action Button Area */}
        <div className="flex flex-col items-center gap-6 py-4 border-y border-neutral-100">
          <button
            onClick={handleProcess}
            disabled={loading}
            className={`group relative px-10 py-5 rounded-2xl font-bold text-white transition-all overflow-hidden shadow-2xl hover:shadow-indigo-300 active:scale-95
              ${loading ? 'bg-neutral-400 cursor-wait' : 'bg-neutral-900 hover:bg-indigo-600'}`}
          >
            <div className="relative z-10 flex items-center gap-3">
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>ĐANG XỬ LÝ...</span>
                </>
              ) : (
                <>
                  <span>THAY TRANG PHỤC</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </>
              )}
            </div>
          </button>
          
          {error && (
            <div className="text-red-500 font-medium text-sm flex items-center gap-2 animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
        </div>

        {/* Output Area - Following strict format */}
        {result && (
          <div className="space-y-10 py-6 animate-in slide-in-from-bottom-8 duration-700">
            {/* PHẦN A */}
            <section className="space-y-6">
              <h2 className="text-lg font-black text-neutral-900 border-l-4 border-indigo-600 pl-4 tracking-tight uppercase italic">
                PHẦN A — ẢNH KẾT QUẢ
              </h2>
              <div className="bg-white p-2 rounded-3xl shadow-2xl ring-1 ring-neutral-200">
                <img src={result.imageUrl} alt="AI Virtual Try-On Result" className="w-full h-auto rounded-2xl max-h-[80vh] object-contain mx-auto" />
              </div>
              <div className="flex justify-center">
                <button 
                  onClick={handleDownload}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all hover:-translate-y-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Tải về
                </button>
              </div>
            </section>

            {/* PHẦN B */}
            <section className="space-y-6">
              <h2 className="text-lg font-black text-neutral-900 border-l-4 border-neutral-900 pl-4 tracking-tight uppercase italic">
                PHẦN B — THÔNG TIN TẢI VỀ
              </h2>
              <div className="bg-neutral-900 text-neutral-300 p-8 rounded-3xl font-mono text-sm leading-relaxed shadow-xl">
                <p className="flex items-center gap-3">
                  <span className="text-neutral-500">•</span>
                  <span className="text-neutral-100">Output size (px):</span> 
                  <span className="text-indigo-400 font-bold">{result.width}x{result.height}</span>
                </p>
                <p className="flex items-center gap-3 mt-4">
                  <span className="text-neutral-500">•</span>
                  <span className="text-neutral-100">Download:</span> 
                  <span className="text-neutral-400">“Bạn có thể tải ảnh kết quả về từ file ảnh ở trên.”</span>
                </p>
              </div>
            </section>
          </div>
        )}
      </main>

      <footer className="mt-auto py-10 px-6 border-t border-neutral-100 text-center">
        <p className="text-neutral-400 text-xs font-medium uppercase tracking-[0.2em]">
          AI Dressing Room &copy; 2024 • Powered by Gemini AI
        </p>
      </footer>
    </div>
  );
};

export default App;
