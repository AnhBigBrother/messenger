import { connectdb } from '@/lib/connectdb';
import Chat from '@/models/chat-model';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';

const getChatById = async (chatId: string) => {
  const session = await getServerSession();
  const curentUserEmail = session?.user?.email;
  if (!curentUserEmail) {
    return { error: 'Unauthorized!' };
  }
  const _id = new mongoose.Types.ObjectId(chatId);
  await connectdb();
  try {
    const chat = await Chat.aggregate([
      { $match: { _id: _id } },
      {
        $lookup: {
          from: 'messages',
          foreignField: '_id',
          localField: 'messages',
          as: 'messages',
        },
      },
      {
        $lookup: {
          from: 'users',
          foreignField: '_id',
          localField: 'members',
          as: 'members',
        },
      },
      {
        $unset: ['members.chats', 'members.accounts', 'members.password', 'members.createdAt', 'members.updatedAt', 'members.__v'],
      },
    ]);
    const currentChat = chat[0];
    for (let member of currentChat.members) {
      if (member.email === curentUserEmail) {
        return currentChat;
      }
    }
    return null;
  } catch (error) {
    console.log(error);
    return { error: 'Something went wrong, try later!' };
  }
};

export default getChatById;
