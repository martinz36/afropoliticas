'use client';

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
        className={`bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center font-bold text-xs ${className}`}
        style={fill ? { width: '100%', height: '100%' } : { width, height }}
      >
        <span>📷 Sin imagen</span>
      </div>
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
