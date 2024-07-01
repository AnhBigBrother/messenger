import getChatById from '@/actions/get-chat-by-id';
import { ChatboxBody } from '@/components/chat-box/body';
import { ChatboxHeader } from '@/components/chat-box/header';
import { ChatboxInput } from '@/components/chat-box/input';
import { authOption } from '@/configs/authOption';
import { formatChatInfo } from '@/lib/format-chat-info';
import { TChat } from '@/types';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import React from 'react';

export const dynamic = 'force-dynamic';

async function ChatPage({ params }: { params: { chatId: string } }) {
  const session = await getServerSession(authOption);
  const user = session?.user;
  const data: TChat | null = await getChatById(params.chatId);

  if (data === null) {
    return notFound();
  }

  const chat = formatChatInfo(data, user);

  return (
    <div className='h-full w-full flex flex-col justify-between'>
      <ChatboxHeader
        name={chat.name}
        image={chat.image}
        isGroup={chat.isGroup}
        createdAt={chat.createdAt}
        updatedAt={chat.updatedAt}
        members={JSON.parse(JSON.stringify(chat.members))}
      />
      <ChatboxBody currentChat={JSON.parse(JSON.stringify(chat))} />
      <ChatboxInput chatId={params.chatId} />
    </div>
  );
}

export default ChatPage;
