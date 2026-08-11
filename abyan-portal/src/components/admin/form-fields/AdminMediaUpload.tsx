import React, { useState, useEffect } from 'react';

export interface AdminMediaUploadProps {
  label: string;
  value?: string;
  onChange?: (file: File | null, previewUrl: string, mediaType?: 'image' | 'video' | 'audio') => void;
  containerClassName?: string;
  required?: boolean;
  error?: string;
  accept?: string;
  folderName?: string;
}

type MediaType = 'image' | 'video' | 'audio';

export default function AdminMediaUpload({ 
  label, 
  value = '', 
  onChange, 
  containerClassName = '', 
  required,
  error,
  accept = 'image/*,audio/*,video/*',
  folderName
}: AdminMediaUploadProps) {
  const [preview, setPreview] = useState<string>(value || '');
  const [mode, setMode] = useState<'upload' | 'link'>('upload');
  const [linkInput, setLinkInput] = useState<string>('');
  const [mediaType, setMediaType] = useState<MediaType>('image');

  const detectMediaType = (url: string): MediaType => {
    if (!url) return 'image';
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.match(/\.(mp4|webm|ogg|mov)$/) || lowerUrl.includes('youtube.com') || lowerUrl.includes('vimeo.com')) {
      return 'video';
    }
    if (lowerUrl.match(/\.(mp3|wav|m4a|aac)$/)) {
      return 'audio';
    }
    return 'image'; // fallback
  };

  useEffect(() => {
    if (value && value !== preview) {
      setPreview(value);
      setMediaType(detectMediaType(value));
      setMode(value.startsWith('http') ? 'link' : 'upload');
      if (value.startsWith('http')) {
        setLinkInput(value);
      }
    }
  }, [value]);

  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      let type: MediaType = 'image';
      if (file.type.startsWith('video/')) type = 'video';
      else if (file.type.startsWith('audio/')) type = 'audio';
      else if (!file.type.startsWith('image/')) {
        alert('نوع الملف غير مدعوم. الرجاء اختيار صورة، فيديو، أو مقطع صوتي.');
        return;
      }

      // Size limits
      const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
      const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
      const MAX_AUDIO_SIZE = 30 * 1024 * 1024; // 30MB

      if (type === 'image' && file.size > MAX_IMAGE_SIZE) {
        alert('حجم الصورة يتجاوز الحد المسموح (10 ميجابايت).');
        return;
      }
      if (type === 'video' && file.size > MAX_VIDEO_SIZE) {
        alert('حجم الفيديو يتجاوز الحد المسموح (100 ميجابايت).');
        return;
      }
      if (type === 'audio' && file.size > MAX_AUDIO_SIZE) {
        alert('حجم الملف الصوتي يتجاوز الحد المسموح (30 ميجابايت).');
        return;
      }

      // Temporary local preview
      const localUrl = URL.createObjectURL(file);
      setPreview(localUrl);
      setMediaType(type);
      
      try {
        setIsUploading(true);
        // We dynamically import UploadService to avoid circular deps or server-side issues if any
        const { UploadService } = await import('@/services/upload.service');
        
        // Clean up any prefix if passed from frontend, then append media type (images/videos/audios)
        const cleanFolder = (folderName || 'general').replace(/^abyan-portal\//, '');
        const finalFolderName = `${cleanFolder}/${type}s`;
        
        const response = await UploadService.uploadFile(file, finalFolderName);
        
        // Update with real Cloudinary URL
        setPreview(response.url);
        if (onChange) onChange(file, response.url, type);
      } catch (err) {
        console.error("Upload failed", err);
        alert('فشل الرفع إلى Cloudinary. يرجى التحقق من إعدادات API.');
        setPreview('');
        if (onChange) onChange(null, '', type);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleLinkSubmit = () => {
    if (linkInput.trim()) {
      let finalUrl = linkInput.trim();
      // Automatically convert Google Drive share links to direct image links
      const driveMatch = finalUrl.match(/drive\.google\.com\/file\/d\/([^\/]+)/);
      if (driveMatch && driveMatch[1]) {
        finalUrl = `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
      } else {
        const driveOpenMatch = finalUrl.match(/drive\.google\.com\/open\?id=([^&]+)/);
        if (driveOpenMatch && driveOpenMatch[1]) {
          finalUrl = `https://drive.google.com/uc?export=view&id=${driveOpenMatch[1]}`;
        }
      }

      const type = detectMediaType(finalUrl);
      setPreview(finalUrl);
      setLinkInput(finalUrl); // update input visually as well
      setMediaType(type);
      if (onChange) onChange(null, finalUrl, type);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview('');
    setLinkInput('');
    if (onChange) onChange(null, '', 'image');
  };

  const renderPreview = () => {
    if (!preview) return null;
    
    if (mediaType === 'video') {
      return (
        <video 
          src={preview} 
          controls 
          className="h-10 w-16 sm:w-20 object-cover rounded border border-slate-200/80 shadow-sm shrink-0"
        />
      );
    }
    
    if (mediaType === 'audio') {
      return (
        <audio 
          src={preview} 
          controls 
          className="h-8 w-full sm:w-48 shrink-0"
        />
      );
    }

    return (
      <img 
        src={preview} 
        alt="معاينة المرفق" 
        className="h-10 w-16 sm:w-20 object-cover rounded border border-slate-200/80 shadow-sm shrink-0"
      />
    );
  };

  const typeLabels = {
    image: 'صورة',
    video: 'فيديو',
    audio: 'صوت',
  };

  const isImageOnly = accept === 'image/*';
  const isVideoOnly = accept === 'video/*';
  const isAudioOnly = accept === 'audio/*';

  let uploadHint = '(صور، فيديو، أو صوتيات)';
  let linkPlaceholder = 'أدخل رابط الملف (صورة، يوتيوب، mp3...)';

  if (isImageOnly) {
    uploadHint = '(صور فقط)';
    linkPlaceholder = 'أدخل رابط الصورة...';
  } else if (isVideoOnly) {
    uploadHint = '(فيديو فقط)';
    linkPlaceholder = 'أدخل رابط الفيديو (يوتيوب، vimeo...)';
  } else if (isAudioOnly) {
    uploadHint = '(صوتيات فقط)';
    linkPlaceholder = 'أدخل رابط الملف الصوتي (mp3...)';
  }

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      <div className="flex flex-wrap items-center justify-between gap-y-1">
        <label className="font-abyan-title text-xs text-slate-800">
          {label} {required && <span className="text-red-500 mr-1">*</span>}
        </label>
        
        {/* Toggle Mode */}
        <div className="flex items-center gap-2 px-1">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`text-[10px] font-abyan-title transition-colors p-0 bg-transparent border-none cursor-pointer ${
              mode === 'upload' ? 'text-sky-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            رفع ملف
          </button>
          <span className="text-slate-300 text-[9px]">|</span>
          <button
            type="button"
            onClick={() => setMode('link')}
            className={`text-[10px] font-abyan-title transition-colors p-0 bg-transparent border-none cursor-pointer ${
              mode === 'link' ? 'text-sky-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            إدراج رابط
          </button>
        </div>
      </div>
      
      <div className={`w-full flex-1 flex flex-col items-center justify-center border rounded-lg transition-all relative overflow-hidden group ${
        preview ? 'p-1.5' : 'p-2 sm:p-3 min-h-[70px]'
      } ${
        error ? 'border-red-500 bg-red-50/10' : 'border-dashed border-slate-200 bg-slate-50/20 hover:bg-slate-50/50'
      }`}>
          {isUploading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/90 rounded-lg">
              <span className="text-xs font-abyan-title text-emerald-600">جاري التحميل ...</span>
            </div>
          )}
          
          {preview ? (
          <div className="relative w-full h-full flex flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {renderPreview()}
              <span className="text-[11px] font-abyan-body text-sky-600 hidden sm:block shrink-0 leading-none">
                {typeLabels[mediaType]}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0 pl-1">
              {mode === 'upload' ? (
                <label className="text-[11px] font-abyan-title text-[#10b981] hover:text-[#059669] cursor-pointer transition-colors m-0 leading-none bg-transparent p-0 border-none shadow-none">
                  تغيير
                  <input 
                    type="file" 
                    accept={accept}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : null}

              {mode === 'upload' && <span className="text-slate-300 text-[9px] leading-none">|</span>}
              <button
                type="button"
                onClick={handleRemove}
                className="text-[11px] font-abyan-title text-red-500 hover:text-red-700 transition-colors bg-transparent p-0 border-none shadow-none cursor-pointer leading-none m-0"
              >
                إزالة
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            {mode === 'upload' ? (
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-4 text-center">
                <input 
                  type="file" 
                  accept={accept}
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <span className="font-abyan-title text-xs sm:text-sm text-slate-600 group-hover:text-[#10b981] transition-colors">
                  انقر أو اسحب الملف هنا
                </span>
                <span className="font-abyan-body text-[11px] text-slate-400 mt-1">
                  {uploadHint}
                </span>
              </label>
            ) : (
              <div className="w-full flex flex-col items-center gap-2 px-2 max-w-sm relative z-10">
                <input
                  type="url"
                  placeholder={linkPlaceholder}
                  className="w-full font-abyan-body text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] text-right"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleLinkSubmit())}
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={handleLinkSubmit}
                  disabled={!linkInput.trim()}
                  className="font-abyan-title text-xs text-sky-600 hover:text-sky-700 font-bold bg-transparent border-none p-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-1"
                >
                  معاينة واعتماد الرابط
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 font-abyan-body mt-0.5">{error}</p>}
    </div>
  );
}