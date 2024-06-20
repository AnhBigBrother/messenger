'use client';

import { signOut } from 'next-auth/react';
import { HiMiniArrowLeftStartOnRectangle } from 'react-icons/hi2';

export const SignOutBtn = () => {
  return (
    <button
      title='Log out'
      onClick={() => signOut()}
      className='p-3 rounded-md text-gray-500 hover:text-sky-500 hover:bg-gray-200'>
      <HiMiniArrowLeftStartOnRectangle className='w-6 h-6' />
    </button>
  );
};
