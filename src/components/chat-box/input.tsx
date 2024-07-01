'use client';

import React, { useState, useTransition } from 'react';
import { CldUploadButton } from 'next-cloudinary';

import { BsFileEarmarkImage } from 'react-icons/bs';
import { FaPaperPlane } from 'react-icons/fa';

export const ChatboxInput = ({ chatId }: { chatId: string }) => {
  const [message, setMessage] = useState<string>('');
  const [isPending, startTransition] = useTransition();

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message !== '') {
      startTransition(async () => {
        const res = await fetch('/api/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ body: message, chatId }),
        });
        setMessage('');
        const data = await res.json();
        console.log(data);
      });
    }
  };

  const handleUpload = (result: any) => {
    console.log('result', result);
    fetch('/api/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: result?.info?.secure_url, chatId }),
    })
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.log(err));
  };

  return (
    <div className='flex-shrink-0 w-full h-16 bg-white border-b px-3 border-t flex flex-row gap-x-2 items-center'>
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onSuccess={handleUpload}
        uploadPreset='fphjwso6'
        className='p-[0.625rem] rounded-lg hover:bg-gray-100'>
        <BsFileEarmarkImage
          size={24}
          className='text-sky-500 rotate-6'
          title='Send image'
        />
      </CldUploadButton>
      <form
        className='flex flex-row items-center gap-x-2 flex-grow'
        onSubmit={handleSendMessage}>
        <input
          type='text'
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder='Write your message...'
          className='flex-grow w-32 h-10 rounded-full bg-gray-100 px-5 outline outline-1 outline-gray-300 focus:outline-sky-500'></input>
        <button
          type='submit'
          className='p-3 rounded-lg hover:bg-gray-100 text-sky-500 disabled:text-sky-300'
          disabled={isPending}
          title='Send message'>
          <FaPaperPlane size={20} />
        </button>
      </form>
    </div>
  );
};
