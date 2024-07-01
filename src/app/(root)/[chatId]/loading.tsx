import { Spinner } from '@/components/ui/loader';
import React from 'react';

function ChatLoading() {
  return (
    <div className='w-full h-full flex flex-col gap-y-5 items-center justify-center'>
      <Spinner
        size='lg'
        color='black'
      />
      <p>Loading...</p>
    </div>
  );
}

export default ChatLoading;
