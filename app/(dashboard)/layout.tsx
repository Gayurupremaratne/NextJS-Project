'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { SideBar } from '@/components/layout';
import { Header } from '@/components/layout/header';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen flex-col">
        <SideBar />
        <div className="flex flex-col flex-1 xl:pl-64 lg:pl-56">
          <Header />
          <div className="flex flex-1 xl:pl-10 xl:pr-[52px] lg:pl-4 lg:pr-4 pl-6 pr-6 pb-4 lg:pt-[100px] pt-6 w-full">
            {children}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
