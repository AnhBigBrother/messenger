'use client';

import { Avatar } from '@/components/avatar';
import { Spinner } from '@/components/ui/loader';
import React, { useEffect, useMemo, useState } from 'react';
import { GoXCircleFill } from 'react-icons/go';
import { TChat, TMessage, TSessionUser } from '@/types/index';
import { useRouter } from 'next/navigation';
import getChats from '@/actions/get-chats';
import { useSession } from 'next-auth/react';
import useSearchResult from '../../hooks/useSearchResult';
import { useNavbarContext } from '@/context/navbar-context';
import { MdOutlineGroupAdd } from 'react-icons/md';
import { formatChatInfo } from '@/lib/format-chat-info';
import { format } from 'date-fns';
import { pusherClient } from '@/lib/pusher';

const ChatListItem = ({ chat, user }: { chat: TChat; user: TSessionUser | undefined }) => {
  const { setActiveSideBox } = useNavbarContext();
  const router = useRouter();
  const [lastMessage, setLastMessage] = useState<TMessage | undefined>(chat.lastMessage ? chat.lastMessage[0] : undefined);

  const hasSeen = useMemo(() => {
    if (!lastMessage || !user) {
      return false;
    }
    const seenArray = lastMessage.seen || [];
    for (let u of seenArray) {
      if (u._id === user._id) return true;
    }
    return false;
  }, [lastMessage, user]);
  const lastMessageText = useMemo(() => {
    if (!lastMessage) return 'Start conversation.';
    const sender = lastMessage.sender!.name;
    if (lastMessage.image) return `${sender} sent an image.`;
    if (lastMessage?.body) return `${sender}: ${lastMessage.body}`;
  }, [lastMessage]);

  const handleClick = () => {
    router.push(chat._id!);
    setActiveSideBox(false);
  };

  useEffect(() => {
    if (chat && chat._id) {
      const newMessageHandler = (mess: TMessage) => {
        if (mess.chat === chat._id) {
          setLastMessage(mess);
        }
      };
      pusherClient.subscribe(chat._id!);
      pusherClient.bind('message:new', newMessageHandler);

      return () => {
        pusherClient.unsubscribe(chat._id!);
        pusherClient.unbind('message:new', newMessageHandler);
      };
    }
  }, [chat]);

  return (
    <li
      className='p-2 w-full flex-shrink-0 flex flex-row items-center gap-x-3 rounded-lg hover:bg-gray-200 overflow-hidden cursor-pointer'
      onClick={handleClick}>
      <Avatar
        url={chat?.image}
        size='sm'
        active={false}
      />
      <div className='flex-grow flex flex-col justify-between'>
        <div className='flex flex-row justify-between items-center'>
          <p className='font-semibold w-28 truncate text-sm'>{chat?.name}</p>
          {lastMessage && <p className={`w-fit text-[0.7rem] text-nowrap ${hasSeen ? 'text-gray-500' : 'text-black font-medium'}`}>{format(new Date(lastMessage.updatedAt!), 'p')}</p>}
        </div>
        <p className={`text-xs md:w-40 truncate ${hasSeen ? 'text-gray-500' : 'text-black font-medium'}`}>{lastMessageText}</p>
      </div>
    </li>
  );
};

export const ChatSection = () => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [allChats, setAllChats] = useState<TChat[]>([]);
  const user: TSessionUser | undefined = useSession().data?.user;
  const { setActiveSection, activeSideBox } = useNavbarContext();
  useEffect(() => {
    if (user && user._id) {
      const newChatHandler = (newChat: TChat) => {
        const formatedChat = formatChatInfo(newChat, user);
        setAllChats(pre => [formatedChat, ...pre]);
      };
      pusherClient.subscribe(user._id);
      pusherClient.bind('chat:new', newChatHandler);
      return () => {
        pusherClient.unsubscribe(user._id!);
        pusherClient.unbind('chat:new', newChatHandler);
      };
    }
  }, [user]);
  useEffect(() => {
    if (activeSideBox && user && user._id) {
      setIsPending(true);
      getChats()
        .then((chats: TChat[]) => {
          for (let chat of chats) {
            chat = formatChatInfo(chat, user);
          }
          setAllChats(chats);
        })
        .finally(() => setIsPending(false));
    }
  }, [user, activeSideBox]);
  const { showData: showChats, search, setSearch } = useSearchResult({ allData: allChats, setIsPending });

  return (
    <div className='flex flex-col w-full h-full overflow-hidden'>
      <div className='px-1 text-xl text-gray-500 font-semibold mb-2 flex flex-row justify-between items-center'>
        <h3 className=''>Messages</h3>
        <button
          className='hover:text-sky-500'
          onClick={() => setActiveSection('people')}>
          <MdOutlineGroupAdd className='w-6 h-6' />
        </button>
      </div>
      <div className='relative w-full rounded-lg border'>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          className='pl-3 pr-10 w-full h-10 rounded-lg outline-sky-500 focus:outline'
          placeholder='Find your chat ...'></input>
        {search && (
          <button
            className='absolute top-0 right-0 p-[0.625rem] w-10 h-10 text-gray-500 hover:text-sky-500'
            onClick={() => setSearch('')}>
            <GoXCircleFill className='w-full h-full' />
          </button>
        )}
      </div>
      {isPending ? (
        <div className='w-full py-7 flex justify-center'>
          <Spinner
            color='black'
            size='md'
          />
        </div>
      ) : showChats.length !== 0 ? (
        <ul className='flex flex-col my-4 w-full h-full overflow-auto'>
          {showChats.map((chat: TChat) => (
            <ChatListItem
              chat={chat}
              user={user}
              key={chat._id}
            />
          ))}
        </ul>
      ) : (
        <p className='text-sm text-center italic mt-5'>Connect with people to start conversations!</p>
      )}
    </div>
  );
};
