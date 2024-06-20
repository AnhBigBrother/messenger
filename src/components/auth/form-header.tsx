import Image from 'next/image';
import React from 'react';

function FormHeader({ label }: { label: string }) {
  return (
    <div className='flex flex-col gap-1 items-center justify-center'>
      <h1 className='text-3xl font-semibold flex gap-1 items-center text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600'>
        <Image
          className=''
          src='/images/logo.png'
          alt='messenger'
          width={30}
          height={30}></Image>
        <span>Messenger</span>
      </h1>
      <p className='text-muted-foreground text-sm'>{label}</p>
    </div>
  );
}

export { FormHeader };
