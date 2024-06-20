'use client';

import getPeople from '@/actions/get-people';
import { Avatar } from '@/components/avatar';
import { Spinner } from '@/components/ui/loader';
import { useNavbarContext } from '@/context/navbar-context';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { GoXCircleFill } from 'react-icons/go';
import { LuPlus } from 'react-icons/lu';

type PeopleType = {
  email: string;
  name: string;
  password: string;
  _id: string;
};

const PeopleListItem = ({ user, selectedMap, isGroup }: { user: PeopleType; selectedMap: Map<string, boolean>; isGroup: boolean }) => {
  const { setActiveSearchBox } = useNavbarContext();
  const router = useRouter();
  const [isSelected, setIsSelected] = useState<boolean>(false);

  useEffect(() => {
    setIsSelected(!!selectedMap.get(user._id));
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
        setActiveSearchBox(false);
        router.push(`/${data._id}`);
      })
      .catch(err => {
        toast.error('Something went wrong, try later!');
        console.log(err);
      });
  };
  const handleSelect = () => {
    setIsSelected(pre => {
      selectedMap.set(user._id, !pre);
      console.log(selectedMap);
      return !pre;
    });
  };
  return (
    <li
      className='flex flex-row gap-x-2 items-center cursor-pointer rounded-lg hover:bg-gray-100 w-full py-[0.375rem] px-3 flex-nowrap overflow-hidden'
      onClick={isGroup ? () => handleSelect() : () => handleStartSingleChat()}>
      {isGroup && <div className={`border-2 rounded-full w-5 h-5 flex justify-center items-center ${isSelected ? 'border-sky-500' : 'border-gray-300'}`}>{isSelected && <div className='w-3 h-3 bg-sky-500 rounded-full'></div>}</div>}
      <div className='flex flex-row items-center gap-x-3  flex-nowrap text-nowrap'>
        <Avatar
          user={user}
          size='sm'
          active={true}
        />
        <p className='font-medium text-sm'>{user.name}</p>
      </div>
    </li>
  );
};

export const PeopleSearchBox = () => {
  const { setActiveSearchBox } = useNavbarContext();
  const router = useRouter();
  const [search, setSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allPeople, setAllPeople] = useState<PeopleType[]>([]);
  const [showPeople, setShowPeople] = useState<PeopleType[]>([]);
  const [isGroup, setIsGroup] = useState<boolean>(false);
  const [groupName, setGroupName] = useState<string>('');
  const selectedMap = useMemo(() => new Map<string, boolean>(), []);

  useEffect(() => {
    setIsLoading(true);
    getPeople()
      .then(people => {
        console.log(people);
        setAllPeople(people);
        setShowPeople(people);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const timmer = setTimeout(() => {
      if (allPeople.length !== 0) {
        const patten = new RegExp(`${search}`, 'i');
        const showPeople = allPeople.filter(p => {
          return patten.test(p.name);
        });
        setShowPeople(showPeople);
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timmer);
  }, [search]);

  const handleCancleGroup = () => {
    for (let x of Array.from(selectedMap.keys())) {
      selectedMap.set(x, false);
    }
    setGroupName('');
    setIsGroup(false);
  };
  const handleStartGroup = () => {
    if (isGroup && groupName === '') {
      toast.error('Please enter group name.');
      return;
    }

    const arr = Array.from(selectedMap.keys());
    let members = Array.from(new Set(arr));
    members = members.filter(mem => selectedMap.get(mem));

    if (members.length < 2) {
      toast.error('Select 2 or more people for a group.');
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
        setActiveSearchBox(false);
        router.push(`/${data._id}`);
      })
      .catch(err => {
        toast.error('Something went wrong, try later!');
        console.log(err);
      });

    handleCancleGroup();
  };

  return (
    <div className='flex flex-col w-full'>
      <h3 className='text-xl pl-1 font-semibold mb-2 text-gray-500'>People</h3>
      <div className='w-full rounded-lg border flex flex-row justify-start items-center'>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          className='w-40 grow shrink pl-3 h-10 rounded-lg outline-sky-500 focus:outline'
          placeholder='Search people ...'></input>
        {search && (
          <button
            className='p-[0.625rem] w-10 h-10 text-gray-500 hover:text-sky-500'
            onClick={() => setSearch('')}>
            <GoXCircleFill className='w-full h-full' />
          </button>
        )}
      </div>
      {isGroup ? (
        <div className='flex flex-col gap-3'>
          <div className='mt-3 w-full flex flex-row gap-x-2'>
            <button
              className='h-11 rounded-lg bg-gray-200 hover:bg-gray-300 flex flex-row gap-x-1 items-center font-medium justify-center text-nowrap overflow-hidden px-5'
              onClick={() => handleCancleGroup()}>
              <span>Cancel</span>
            </button>
            <button
              className='h-11 rounded-lg bg-sky-500 hover:bg-sky-600 text-white flex flex-row gap-x-1 items-center font-medium justify-center text-nowrap overflow-hidden px-5'
              onClick={() => handleStartGroup()}>
              <span>Start</span>
            </button>
          </div>
          <input
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
            className='w-full pl-3 h-10 rounded-lg border outline-sky-500 focus:outline'
            placeholder='Group name ...'></input>
          <p className='font-medium ml-2 text-gray-700 text-nowrap overflow-hidden'>Choose someone</p>
        </div>
      ) : (
        <button
          className='mt-3 h-11 rounded-lg bg-sky-500 text-white flex flex-row gap-x-1 items-center font-medium justify-center text-nowrap overflow-hidden'
          onClick={() => setIsGroup(true)}>
          <LuPlus className='w-5 h-5' />
          <span>Create Group Chat</span>
        </button>
      )}
      {isLoading ? (
        <div className='w-full py-5 flex justify-center'>
          <Spinner
            color='black'
            size='md'
          />
        </div>
      ) : (
        <ul className='mt-2 flex flex-col items-start justify-start overflow-hidden'>
          {showPeople.map(user => (
            <PeopleListItem
              key={user.email}
              user={user}
              selectedMap={selectedMap}
              isGroup={isGroup}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
