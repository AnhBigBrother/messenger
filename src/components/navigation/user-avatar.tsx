'use client';

import { Avatar } from '@/components/avatar';
import { useSession } from 'next-auth/react';
import React from 'react';

export const UserAvatar = () => {
  const session = useSession();
  const user = session.data?.user;
  return (
    <button
      className='w-fit h-fit'
      onClick={() => console.log(user)}>
      <Avatar
        user={user}
        size='md'
        active={true}
      />
    </button>
  );
};
