import React from 'react';

function EmptyState() {
  return (
    <div className='p-12 sm:px-6 lg:px-8 h-full flex justify-center items-center bg-gray-100'>
      <h3 className='text-2xl text-center font-semibol text-gray-900'>Select a chat or start a new conversation.</h3>
    </div>
  );
}

export { EmptyState };
