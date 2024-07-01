'use client';

import { useNavbarContext } from '@/context/navbar-context';
import React from 'react';
import { ChatSection } from './chat-section';
import { PeopleSection } from './people-section';

function FindBox() {
  const { activeSideBox, activeSection } = useNavbarContext();

  return (
    <div className={`absolute md:relative z-10 flex-shrink-0 top-0 pt-16 md:pt-0 w-full md:h-full md:border-r bg-white overflow-hidden duration-300 ease-in-out ${activeSideBox ? 'h-full md:w-64' : 'md:w-0 h-0'}`}>
      <div className='w-full h-full px-5 py-3 md:px-3'>{activeSection === 'chat' ? <ChatSection /> : <PeopleSection />}</div>
    </div>
  );
}

export default FindBox;
