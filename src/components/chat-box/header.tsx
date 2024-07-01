'use client';

import { Avatar } from '@/components/avatar';
import { HiDotsHorizontal } from 'react-icons/hi';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { format } from 'date-fns';
import { useMemo } from 'react';

const ChatboxHeader = ({ name, image, isGroup, createdAt, updatedAt, members }: { name?: string; image?: string; isGroup?: boolean; createdAt?: string; updatedAt?: string; members?: any[] }) => {
  const chatStatus = useMemo(() => {
    if (members?.length !== 2) {
      return members?.length + ' members';
    }
    if (members[0].name === name) {
      return members[0].email;
    }
    return members[1].email;
  }, [members]);
  return (
    <header className='flex-shrink-0 w-full h-16 bg-white border-b flex flex-row justify-between items-center px-5'>
      <div className='flex flex-row gap-x-3 items-center'>
        <Avatar
          size='sm'
          active={true}
          url={image}
        />
        <div className='flex flex-col justify-center'>
          <p className='text-sm font-semibold'>{name}</p>
          <p className='text-xs text-gray-500'>{chatStatus}</p>
        </div>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <button
            title='More infomation'
            className='p-2 rounded-full text-gray-500 hover:text-blue-500 hover:bg-gray-200'>
            <HiDotsHorizontal className='w-5 h-5' />
          </button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader className='flex flex-col items-center py-3'>
            <Avatar
              size='lg'
              active={true}
              url={image}
            />
            <SheetTitle>
              <p>{name}</p>
              {isGroup && <p className='text-center text-base'>(Group)</p>}
            </SheetTitle>
            <div className='flex flex-col items-center'>
              <SheetDescription>Created At: {format(new Date(createdAt!), 'PP')}</SheetDescription>
              <SheetDescription>{`${members?.length} members`}</SheetDescription>
            </div>
            <div className='p-2 md:p-5 w-full flex flex-col gap-y-2'>
              {members?.map(mem => (
                <div
                  key={mem._id}
                  className='flex flex-row items-center gap-x-2'>
                  <Avatar
                    size='sm'
                    active={true}
                    url={mem.image}
                  />
                  <div className='flex flex-col items-start truncate'>
                    <p className='font-semibold'>{mem.name}</p>
                    <p className='text-sm font-normal'>({mem.email})</p>
                  </div>
                </div>
              ))}
            </div>
          </SheetHeader>
          <SheetFooter></SheetFooter>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export { ChatboxHeader };
