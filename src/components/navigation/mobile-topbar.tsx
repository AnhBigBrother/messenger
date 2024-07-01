import { NavItem } from '@/components/navigation/nav-item';
import { SignOutBtn } from '@/components/navigation/sign-out-btn';
import { UserAvatar } from '@/components/navigation/user-avatar';
import React from 'react';
import { BsPeopleFill } from 'react-icons/bs';
import { HiChatBubbleOvalLeftEllipsis } from 'react-icons/hi2';

export const MobileTopbar = () => {
  return (
    <nav className='z-20 fixed md:hidden left-0 top-0 h-16 w-full bg-white px-3 flex flex-row items-center justify-between border-b border-gray-200'>
      <ul className='flex flex-row w-fit h-full gap-x-2 items-center'>
        <NavItem sectionName='chat'>
          <HiChatBubbleOvalLeftEllipsis className='w-6 h-6' />
        </NavItem>
        <NavItem sectionName='people'>
          <BsPeopleFill className='w-6 h-6' />
        </NavItem>
      </ul>
      <ul className='flex flex-row w-fit h-full items-center gap-x-2 pr-3'>
        <SignOutBtn />
        <UserAvatar />
      </ul>
    </nav>
  );
};
