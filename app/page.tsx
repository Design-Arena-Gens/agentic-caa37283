'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

export default function Home() {
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFaceImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!faceImage) {
      setError('Vui lòng tải lên ảnh khuôn mặt trước');
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ faceImage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra khi tạo ảnh');
      }

      setGeneratedImage(data.output);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFaceImage(null);
    setGeneratedImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
              Tạo Chân Dung Cô Gái Bên Hoa Dã Quỳ
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Sử dụng AI để tạo chân dung Việt Nam đẹp tự nhiên với hoa dã quỳ
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 mb-8">
            {/* Upload Section */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
                📸 Tải lên ảnh khuôn mặt tham chiếu
              </label>
              <div className="flex flex-col items-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 dark:text-gray-400
                    file:mr-4 file:py-3 file:px-6
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-amber-500 file:text-white
                    hover:file:bg-amber-600
                    file:cursor-pointer cursor-pointer"
                />
                {faceImage && (
                  <div className="mt-6 relative w-64 h-64">
                    <Image
                      src={faceImage}
                      alt="Face reference"
                      fill
                      className="object-cover rounded-lg shadow-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center mb-8">
              <button
                onClick={handleGenerate}
                disabled={loading || !faceImage}
                className="px-8 py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400
                  text-white font-semibold rounded-full shadow-lg
                  transform transition hover:scale-105 disabled:hover:scale-100
                  disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Đang tạo ảnh...
                  </span>
                ) : (
                  '✨ Tạo Chân Dung'
                )}
              </button>
              {(faceImage || generatedImage) && (
                <button
                  onClick={handleReset}
                  disabled={loading}
                  className="px-8 py-4 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400
                    text-white font-semibold rounded-full shadow-lg
                    transform transition hover:scale-105 disabled:hover:scale-100"
                >
                  🔄 Làm Lại
                </button>
              )}
            </div>

            {/* Generated Image */}
            {generatedImage && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
                  🌻 Kết Quả
                </h2>
                <div className="relative w-full aspect-square max-w-2xl mx-auto">
                  <Image
                    src={generatedImage}
                    alt="Generated portrait"
                    fill
                    className="object-contain rounded-lg shadow-2xl"
                  />
                </div>
                <div className="mt-4 text-center">
                  <a
                    href={generatedImage}
                    download="vietnamese-portrait.png"
                    className="inline-block px-6 py-3 bg-green-500 hover:bg-green-600
                      text-white font-semibold rounded-full shadow-lg
                      transform transition hover:scale-105"
                  >
                    💾 Tải Xuống
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              📝 Mô tả chân dung được tạo:
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Một bức chân dung ngoài trời chân thực của một cô gái trẻ người Việt Nam đang đứng cạnh bụi hoa dã quỳ cao và rậm rạp đang nở rộ.
              Những bông hoa có màu vàng óng rực rỡ, giống như những bông cúc lớn với cánh hoa thon dài và nhụy cam đậm, bao quanh bởi lá xanh rì có răng cưa.
              Cô mặc áo dài trắng xanh mềm mại, kết hợp cầm một chiếc nón lá vành rộng trên tay tạo vẻ thanh lịch, hài hòa.
              Mái tóc thẳng ngang vai ôm lấy khuôn mặt dịu dàng; làn da sáng, mịn và khỏe khoắn.
              Cô đứng duyên dáng bên chiếc xe đạp trắng cổ điển, trên giỏ mây là bó hoa dã quỳ mới hái.
              Khung cảnh gợi nên bầu không khí yên bình, hoài niệm và thơ mộng, tái hiện vẻ đẹp tự nhiên của hoa dã quỳ nở rực dọc con đường quê mộc mạc.
              <span className="font-semibold">Ánh sáng:</span> nắng vàng nhẹ của buổi hoàng hôn, chiếu ngược tự nhiên, độ sâu điện ảnh, tông màu ấm dịu.
              <span className="font-semibold">Phong cách:</span> ảnh chụp siêu thực (photorealistic), lấy nét toàn cảnh.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
