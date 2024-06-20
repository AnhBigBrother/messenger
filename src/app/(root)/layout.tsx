import { DesktopSidebar } from '@/components/navigation/desktop-sidebar';
import { MobileTopbar } from '@/components/navigation/mobile-topbar';
import SearchBox from '@/components/search-box/searchbox';
import React from 'react';

async function Userlayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='h-full bg-gray-100'>
      <DesktopSidebar />
      <MobileTopbar />
      <main className='h-full pt-16 md:pt-0 md:pl-20 flex flex-row justify-start items-start'>
        <SearchBox />
        <div className='h-full flex-grow'>{children}</div>
      </main>
    </div>
  );
}

export default Userlayout;
