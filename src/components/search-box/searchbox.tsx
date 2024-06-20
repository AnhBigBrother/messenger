'use client';
import { ChatSearchBox } from '@/components/search-box/chat-searchbox';
import { PeopleSearchBox } from '@/components/search-box/people-searchbox';
import { useNavbarContext } from '@/context/navbar-context';
import React from 'react';

function SearchBox() {
  const { activeSearchBox, activeSection } = useNavbarContext();

  return (
    <div className={`absolute top-0 pt-16 md:relative w-full md:h-full md:pt-0 bg-white overflow-hidden duration-300 ease-in-out ${activeSearchBox ? 'h-full md:w-64' : 'md:w-0 h-0'}`}>
      <div className='w-full h-full p-3'>{activeSection === 'chat' ? <ChatSearchBox /> : <PeopleSearchBox />}</div>
    </div>
  );
}

export default SearchBox;
