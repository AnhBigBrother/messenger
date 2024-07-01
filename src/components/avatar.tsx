import Image from 'next/image';
import React from 'react';

export const Avatar = ({ url, size, active }: { url: string | undefined; size: 'sm' | 'md' | 'lg'; active: boolean }) => {
  return (
    <div className='relative h-fit w-fit flex-shrink-0'>
      <Image
        src={url || '/images/man-avatar-2.jpg'}
        alt='user'
        width={size === 'sm' ? 36 : size === 'md' ? 40 : 54}
        height={size === 'sm' ? 36 : size === 'md' ? 40 : 54}
        className='rounded-full bg-gray-200'></Image>
      {active && <span className={`${size === 'sm' ? 'w-[0.625rem] h-[0.625rem] ring-2' : 'w-3 h-3 ring'} rounded-full bg-green-500 absolute top-0 right-0 ring-white`}></span>}
    </div>
  );
};
