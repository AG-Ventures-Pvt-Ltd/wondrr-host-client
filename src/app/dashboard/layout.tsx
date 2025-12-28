'use client'

import React from "react";
import SideNavbar from "./components/SideNavbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <div className='w-auto border-r-2 border-[#E2E8F0]'>
        <SideNavbar />
      </div>
      <div className='flex-1 overflow-y-scroll p-10'>
        {children}
      </div>
    </div>
  );
}