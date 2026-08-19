'use client';

import { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

interface AdminLayoutClientProps {
  children: React.ReactNode;
  userName?: string;
  userEmail?: string;
}

export function AdminLayoutClient({
  children,
  userName,
  userEmail,
}: AdminLayoutClientProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex">
      {/* Collapsible Sidebar */}
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        userName={userName}
        userEmail={userEmail}
      />

      {/* Main Content Shell with Dynamic Padding */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          collapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Header */}
        <AdminHeader
          onOpenMobileMenu={() => setMobileOpen(true)}
          userName={userName}
        />

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
