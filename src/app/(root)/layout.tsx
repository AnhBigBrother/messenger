import { DesktopSidebar } from '@/components/navigation/desktop-sidebar';
import { MobileTopbar } from '@/components/navigation/mobile-topbar';
import FindBox from '@/components/find-box/find-box';
import React from 'react';

async function Userlayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='h-full w-full'>
      <DesktopSidebar />
      <MobileTopbar />
      <main className='h-full w-full pt-16 md:pt-0 md:pl-20 flex flex-row justify-start items-start'>
        <FindBox />
        <div className='h-full flex-grow'>{children}</div>
      </main>
    </div>
  );
}

export default Userlayout;
