import React from 'react';
import { HiChatBubbleOvalLeftEllipsis } from 'react-icons/hi2';
import { BsPeopleFill } from 'react-icons/bs';
import { NavItem } from '@/components/navigation/nav-item';
import { SignOutBtn } from '@/components/navigation/sign-out-btn';
import { UserAvatar } from '@/components/navigation/user-avatar';

export const DesktopSidebar = () => {
  return (
    <nav className='fixed z-10 top-0 left-0 hidden md:flex w-20 h-full py-6 bg-white border-r border-gray-200 flex-col justify-between items-center'>
      <ul className='flex flex-col gap-y-5 items-center'>
        <NavItem sectionName='chat'>
          <HiChatBubbleOvalLeftEllipsis className='w-6 h-6' />
        </NavItem>
        <NavItem sectionName='people'>
          <BsPeopleFill className='w-6 h-6' />
        </NavItem>
      </ul>
      <ul className='flex flex-col w-full items-center gap-y-5'>
        <UserAvatar />
        <SignOutBtn />
      </ul>
    </nav>
  );
};
