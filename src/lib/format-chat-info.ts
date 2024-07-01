import { TChat, TSessionUser } from '@/types';

export function formatChatInfo(chat: TChat, user?: TSessionUser) {
  if (chat.members && chat.members.length === 2 && user) {
    const name = chat.members[0].email === user.email ? chat.members[1].name : chat.members[0].name;
    const image = chat.members[0].email === user.email ? chat.members[1].image : chat.members[0].image;
    chat.name = name;
    chat.image = image;
  }
  return chat;
}
