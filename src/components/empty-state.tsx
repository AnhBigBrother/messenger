import React from 'react';

function EmptyState() {
  return (
    <div className='px-4 py-10 sm:px-6 lg:px-8 h-full flex justify-center items-center bg-gray-100'>
      <div className='text-center flex flex-col items-center'>
        <h3 className='mt-2 text-2xl font-semibol text-gray-900'>Select chat or start a new conversation</h3>
      </div>
    </div>
  );
}

export { EmptyState };
