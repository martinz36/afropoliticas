'use client';

import { CldImage } from 'next-cloudinary';
import Image from 'next/image';
import { useState } from 'react';

interface CldImageWrapperProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function CldImageWrapper({
  src,
  alt,
  className = '',
  fill = false,
  width,
  height,
  priority = false,
}: CldImageWrapperProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div
        className={`bg-slate-800 border border-slate-700 text-slate-500 flex items-center justify-center font-bold text-xs ${className}`}
        style={fill ? { width: '100%', height: '100%' } : { width, height }}
      >
        <span>📷 Sin imagen</span>
      </div>
    );
  }

  // Si la URL proviene directamente de Cloudinary
  const isCloudinaryUrl = src.includes('res.cloudinary.com') || src.includes('cloudinary.com');

  if (isCloudinaryUrl) {
    // Extraer public_id si es una URL completa de Cloudinary
    const parts = src.split('/upload/');
    const publicIdWithExt = parts.length > 1 ? parts[1].replace(/^v\d+\//, '') : src;

    return (
      <CldImage
        src={publicIdWithExt}
        alt={alt}
        className={className}
        fill={fill}
        width={fill ? undefined : width || 400}
        height={fill ? undefined : height || 400}
        crop="fill"
        gravity="auto"
        quality="auto"
        format="auto"
        onError={() => setError(true)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      fill={fill}
      width={fill ? undefined : width || 400}
      height={fill ? undefined : height || 400}
      priority={priority}
      unoptimized
      onError={() => setError(true)}
    />
  );
}
