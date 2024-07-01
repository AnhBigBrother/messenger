'use client';

import { Avatar } from '@/components/avatar';
import { TChat, TMessage, TSessionUser } from '@/types';
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { pusherClient } from '@/lib/pusher';

const MessageCard = ({ message, isLast }: { message: TMessage; isLast: boolean }) => {
  const user: TSessionUser | undefined = useSession().data?.user;
  const isOwn = user?._id === message.sender?._id;
  const [seenList, setSeenList] = useState((message.seen || []).map(u => u.name).join(', '));

  useEffect(() => {
    const seenMessageHandler = ({ _id, name }: { _id: string; name: string }) => {
      setSeenList(pre => pre + ', ' + name);
    };
    pusherClient.subscribe(message._id!);
    pusherClient.bind('message:seen', seenMessageHandler);
    return () => {
      pusherClient.unsubscribe(message._id!);
      pusherClient.unbind('message:seen', seenMessageHandler);
    };
  }, []);

  return (
    <div className={`flex flex-row w-full gap-3 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      {!isOwn && (
        <Avatar
          size='sm'
          url={message.sender?.image}
          active={false}
        />
      )}
      <div
        className={`flex flex-col max-w-[75%] ${isOwn ? 'items-end' : 'items-start'}`}
        title={`seen by ${seenList}.`}>
        <div className='px-1 flex flex-row gap-1'>
          {!isOwn && <p className='text-[0.7rem] font-medium text-gray-700'>{message.sender?.name}</p>}
          <p className='text-[0.7rem] text-gray-500'>{format(new Date(message.createdAt!), 'p')}</p>
        </div>
        {message.body && <p className={`px-3 py-2 rounded-xl w-fit ${isOwn ? 'bg-sky-500 text-white' : 'bg-gray-300 text-black'}`}>{message.body}</p>}
        {message.image && (
          <a
            className='rounded-lg mt-1 max-w-96'
            href={message.image}
            target='_blank'>
            <img
              src={message.image}
              alt='image'
              className='rounded-lg'
            />
          </a>
        )}
        {isLast && seenList.length > 0 && <p className='px-1 text-[0.7rem] font-light text-gray-500'>{`Seen by ${seenList}`}</p>}
      </div>
    </div>
  );
};

export const ChatboxBody = ({ currentChat }: { currentChat: TChat }) => {
  const [messages, setMessages] = useState<TMessage[]>(currentChat.messages!);
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const newMessageHandler = (mess: TMessage) => {
      fetch(`/api/chat/${currentChat._id}/seen`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setMessages(prev => {
        for (let mes of prev) {
          if (mes._id === mess._id) {
            return messages;
          }
        }
        return [...prev, mess];
      });
      bottomRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    };

    pusherClient.subscribe(currentChat._id!);
    pusherClient.bind('message:new', newMessageHandler);
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });

    return () => {
      pusherClient.unsubscribe(currentChat._id!);
      pusherClient.unbind('message:new', newMessageHandler);
    };
  }, [currentChat]);
  useEffect(() => {
    const timmer = setTimeout(() => {
      fetch(`/api/chat/${currentChat._id}/seen`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }, 500);

    return () => clearTimeout(timmer);
  }, [currentChat._id]);

  return (
    <div className='flex-grow overflow-auto p-5 flex flex-col gap-3'>
      {messages.map((mess, i) => (
        <MessageCard
          key={mess._id}
          message={mess}
          isLast={i === messages.length! - 1}
        />
      ))}
      <div ref={bottomRef}></div>
    </div>
  );
};
