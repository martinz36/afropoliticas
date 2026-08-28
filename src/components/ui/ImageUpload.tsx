'use client';

import { useState, useEffect } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { ImagePlus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useCloudinarySettings } from '@/components/admin/CloudinarySettingsContext';

interface ImageUploadProps {
  disabled?: boolean;
  onChange?: (url: string) => void;
  onUpload: (url: string) => void;
  onRemove?: (url: string) => void;
  value?: string;
  uploadPreset?: string;
  cloudName?: string;
}

export function ImageUpload({
  disabled = false,
  onChange,
  onUpload,
  onRemove,
  value = '',
  uploadPreset: customPreset,
  cloudName: customCloudName,
}: ImageUploadProps) {
  const [isMounted, setIsMounted] = useState(false);
  const contextSettings = useCloudinarySettings();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const effectiveCloudName =
    customCloudName ||
    contextSettings.cloudName ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    'afropoliticas';

  const effectiveUploadPreset =
    customPreset ||
    contextSettings.uploadPreset ||
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
    'afropoliticas_uploads';

  const handleUploadSuccess = (result: any) => {
    const secureUrl = result?.info?.secure_url;
    if (typeof secureUrl === 'string') {
      onUpload(secureUrl);
      if (onChange) {
        onChange(secureUrl);
      }
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="space-y-4 w-full">
      {/* Vista previa de la imagen si ya existe una URL */}
      {value ? (
        <div className="relative w-44 h-44 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl group">
          <Image
            fill
            className="object-cover"
            alt="Vista previa de imagen"
            src={value}
            unoptimized
          />
          {onRemove && (
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => onRemove(value)}
                disabled={disabled}
                className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
                title="Eliminar imagen"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      ) : null}

      {/* Widget de subida de Cloudinary */}
      <CldUploadWidget
        onSuccess={handleUploadSuccess}
        uploadPreset={effectiveUploadPreset}
        options={{
          cloudName: effectiveCloudName,
          uploadPreset: effectiveUploadPreset,
          maxFiles: 1,
          resourceType: 'image',
          sources: ['local', 'url', 'camera'],
          clientAllowedFormats: ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif'],
        }}
      >
        {({ open }) => {
          return (
            <button
              type="button"
              disabled={disabled}
              onClick={() => open()}
              className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl font-semibold text-xs text-slate-100 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
            >
              <ImagePlus className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>{value ? 'Cambiar Imagen' : 'Subir Imagen con Cloudinary'}</span>
            </button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}
