'use client';

import getChats from '@/actions/get-chats';
import React, { useEffect, useState } from 'react';
import { GoXCircleFill } from 'react-icons/go';

export const ChatSearchBox = () => {
  const [search, setSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const get_chats = async () => {
      setIsLoading(true);
      const chats = await getChats();
      setChats(chats);
      console.log(chats);
      setIsLoading(false);
    };
    get_chats();
  }, []);

  return (
    <div className='flex flex-col w-full'>
      <h3 className='pl-1 text-xl font-semibold mb-1 text-gray-500'>Chat</h3>
      <div className='w-full rounded-lg border flex flex-row justify-start items-center'>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          className='w-40 grow shrink pl-3 h-10 rounded-lg outline-sky-500 focus:outline'
          placeholder='Search your chat ...'></input>
        {search && (
          <button
            className='p-[0.625rem] w-10 h-10 text-gray-500 hover:text-sky-500'
            onClick={() => setSearch('')}>
            <GoXCircleFill className='w-full h-full' />
          </button>
        )}
      </div>
    </div>
  );
};
