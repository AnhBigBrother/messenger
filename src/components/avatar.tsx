import Image from 'next/image';
import React from 'react';

type Props = {
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
};

export const Avatar = ({ user, size, active }: { user: Props | undefined; size: 'sm' | 'md'; active: boolean }) => {
  return (
    <div className='relative h-fit w-fit flex-shrink-0'>
      <Image
        src={user?.image || '/images/man-avatar-2.jpg'}
        alt='user'
        width={size === 'sm' ? 32 : 40}
        height={size === 'sm' ? 32 : 40}
        className='rounded-full'></Image>
      <span className={`${size === 'sm' ? 'w-[0.625rem] h-[0.625rem] ring-2' : 'w-3 h-3 ring'} rounded-full bg-green-500 absolute top-0 right-0 ring-white`}></span>
    </div>
  );
};
