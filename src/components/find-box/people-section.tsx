'use client';

import getPeople from '@/actions/get-people';
import { Avatar } from '@/components/avatar';
import { Spinner } from '@/components/ui/loader';
import { useNavbarContext } from '@/context/navbar-context';
import { TPeople } from '@/types/index';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { GoXCircleFill } from 'react-icons/go';
import { LuPlus } from 'react-icons/lu';
import useSearchResult from '../../hooks/useSearchResult';

const PeopleListItem = ({ user, selectedMap, isGroup }: { user: TPeople; selectedMap: Map<string, boolean>; isGroup: boolean }) => {
  const { setActiveSideBox, setActiveSection } = useNavbarContext();
  const router = useRouter();
  const [isSelected, setIsSelected] = useState<boolean>(false);

  useEffect(() => {
    setIsSelected(!!selectedMap.get(user!._id!));
  }, [isGroup]);

  const handleStartSingleChat = () => {
    fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: '', isGroup: false, members: [user._id] }),
    })
      .then(res => res.json())
      .then(data => {
        router.push(`/${data._id}`);
        setActiveSection('chat');
        setActiveSideBox(false);
      })
      .catch(err => {
        toast.error('Something went wrong, try later!');
        console.log(err);
      });
  };
  const handleSelect = () => {
    setIsSelected(pre => {
      selectedMap.set(user!._id!, !pre);
      return !pre;
    });
  };
  return (
    <li
      className='flex flex-row flex-shrink-0 gap-x-2 items-center cursor-pointer rounded-lg hover:bg-gray-200 w-full py-2 px-3 flex-nowrap overflow-hidden'
      onClick={isGroup ? () => handleSelect() : () => handleStartSingleChat()}>
      {isGroup && (
        <div className={`flex-shrink-0 border-2 rounded-full w-5 h-5 flex justify-center items-center ${isSelected ? 'border-sky-500' : 'border-gray-300'}`}>{isSelected && <div className='w-3 h-3 bg-sky-500 rounded-full'></div>}</div>
      )}
      <div className='flex flex-row items-center gap-x-3  flex-nowrap text-nowrap'>
        <Avatar
          url={user.image!}
          size='sm'
          active={false}
        />
        <div className='flex flex-col justify-between'>
          <p className='font-medium truncate text-sm'>{user.name}</p>
          {user.email && <p className='text-xs text-gray-500 truncate'>{user.email}</p>}
        </div>
      </div>
    </li>
  );
};

export const PeopleSection = () => {
  const { setActiveSideBox, activeSideBox } = useNavbarContext();
  const router = useRouter();
  const [isPending, setIsPending] = useState<boolean>(true);
  const [allPeople, setAllPeople] = useState<TPeople[]>([]);
  const [isGroup, setIsGroup] = useState<boolean>(false);
  const [groupName, setGroupName] = useState<string>('');
  const selectedMap = useMemo(() => new Map<string, boolean>(), []);
  const [isStartingChat, setIsStartingChat] = useState<boolean>(false);

  useEffect(() => {
    if (activeSideBox) {
      setIsPending(true);
      getPeople().then(people => {
        setAllPeople(people);
      });
    }
  }, [activeSideBox]);

  const { showData: showPeople, search, setSearch } = useSearchResult<TPeople>({ allData: allPeople, setIsPending });

  const handleCancleGroup = () => {
    for (let x of Array.from(selectedMap.keys())) {
      selectedMap.set(x, false);
    }
    setGroupName('');
    setIsGroup(false);
  };
  const handleStartGroup = () => {
    setIsStartingChat(true);
    if (isGroup && groupName === '') {
      toast.error('Enter your group name.');
      setIsStartingChat(false);
      return;
    }

    const arr = Array.from(selectedMap.keys());
    let members = Array.from(new Set(arr));
    members = members.filter(mem => selectedMap.get(mem));

    if (members.length < 2) {
      toast.error('Select 2 or more people for a group.');
      setIsStartingChat(false);
      return;
    }

    fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: groupName, isGroup: true, members: members }),
    })
      .then(res => res.json())
      .then(data => {
        setActiveSideBox(false);
        router.push(`/${data._id}`);
      })
      .catch(err => {
        toast.error('Something went wrong, try later!');
        console.log(err);
      });

    handleCancleGroup();
  };

  return (
    <div className='flex flex-col w-full h-full overflow-hidden'>
      <h3 className='flex-shrink-0 text-xl pl-1 font-semibold mb-2 text-gray-500'>People</h3>
      <div className='relative flex-shrink-0 w-full rounded-lg border'>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={'pl-3 pr-10 h-10 w-full rounded-lg outline-sky-500 focus:outline'}
          placeholder='Find people ...'></input>
        {search && (
          <button
            className='absolute right-0 top-0 p-[0.625rem] w-10 h-10 text-gray-500 hover:text-sky-500'
            onClick={() => setSearch('')}>
            <GoXCircleFill className='w-full h-full' />
          </button>
        )}
      </div>
      {isGroup ? (
        <div className='flex flex-col gap-3'>
          <div className='mt-3 w-full flex flex-row gap-x-2'>
            <button
              className='h-11 rounded-lg bg-gray-200 hover:brightness-95 disabled:brightness-95 flex flex-row gap-x-1 items-center font-medium justify-center text-nowrap overflow-hidden px-5'
              onClick={() => handleCancleGroup()}
              disabled={isStartingChat}>
              <span>Cancel</span>
            </button>
            <button
              className='h-11 w-20 rounded-lg bg-sky-500 hover:brightness-95 disabled:brightness-95 text-white flex flex-row gap-x-1 items-center font-medium justify-center text-nowrap overflow-hidden px-5'
              onClick={() => handleStartGroup()}
              disabled={isStartingChat}>
              {isStartingChat ? (
                <Spinner
                  size='sm'
                  color='white'
                />
              ) : (
                <span>Start</span>
              )}
            </button>
          </div>
          <input
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
            className='w-full pl-3 h-10 rounded-lg border outline-none focus:border-sky-500'
            placeholder='Group name ...'></input>
          <p className='font-medium ml-2 text-gray-700 text-nowrap overflow-hidden'>Choose someone</p>
        </div>
      ) : (
        <button
          className='flex-shrink-0 mt-3 h-11 rounded-lg bg-sky-500 hover:brightness-95 text-white flex flex-row gap-x-1 items-center font-medium justify-center text-nowrap overflow-hidden'
          onClick={() => setIsGroup(true)}>
          <LuPlus className='w-5 h-5' />
          <span>Create Group Chat</span>
        </button>
      )}
      {isPending ? (
        <div className='w-full py-7 flex justify-center'>
          <Spinner
            color='black'
            size='md'
          />
        </div>
      ) : showPeople.length > 0 ? (
        <ul className='flex flex-col items-start justify-start my-4 w-full h-full overflow-auto'>
          {showPeople.map(user => (
            <PeopleListItem
              key={user.email}
              user={user}
              selectedMap={selectedMap}
              isGroup={isGroup}
            />
          ))}
        </ul>
      ) : (
        <p className='text-sm text-center italic mt-5'>No one found!</p>
      )}
    </div>
  );
};
