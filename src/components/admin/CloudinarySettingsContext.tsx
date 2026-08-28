'use client';

import React, { createContext, useContext } from 'react';

interface CloudinarySettingsContextType {
  cloudName?: string;
  uploadPreset?: string;
}

const CloudinarySettingsContext = createContext<CloudinarySettingsContextType>({
  cloudName: undefined,
  uploadPreset: undefined,
});

export function CloudinarySettingsProvider({
  cloudName,
  uploadPreset,
  children,
}: {
  cloudName?: string | null;
  uploadPreset?: string | null;
  children: React.ReactNode;
}) {
  return (
    <CloudinarySettingsContext.Provider
      value={{
        cloudName: cloudName || undefined,
        uploadPreset: uploadPreset || undefined,
      }}
    >
      {children}
    </CloudinarySettingsContext.Provider>
  );
}

export function useCloudinarySettings() {
  return useContext(CloudinarySettingsContext);
}
