'use client';

import React from 'react';
import { SideBar } from './SideBar';
import { Header } from './header';

export const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="flex h-screen flex-col">
      <SideBar />
      <div className="flex flex-col flex-1 lg:pl-64">
        <Header />
        <div className="flex flex-1 lg:pl-10 lg:pr-[52px] pl-6 lg:pt-[100px] pt-6 pr-6">
          {children}
        </div>
      </div>
    </div>
  );
};
