'use server';
import { connectdb } from '@/lib/connectdb';
import User from '@/models/user-model';
import { getServerSession } from 'next-auth';

export default async function getChats() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return { error: 'Unauthorized!' };
  }

  const currentUserEmail = session.user.email;
  await connectdb();

  try {
    const data = await User.aggregate([
      { $match: { email: currentUserEmail } },
      {
        $lookup: {
          from: 'chats',
          localField: 'chats',
          foreignField: '_id',
          as: 'chats',
        },
      },
      {
        $unwind: '$chats',
      },
      {
        $lookup: {
          from: 'users',
          foreignField: '_id',
          localField: 'chats.members',
          as: 'chats.members',
        },
      },
      {
        $sort: {
          'chats.updatedAt': -1,
        },
      },
      // {
      //   $group: {
      //     _id: '$_id',
      //     chats: {
      //       $addToSet: '$chats',
      //     },
      //   },
      // },
      // {
      //   $unwind: '$chats',
      // },
      {
        $replaceRoot: {
          newRoot: '$chats',
        },
      },
      {
        $unset: ['members.chats', 'members.accounts', 'members.password', 'members.createdAt', 'members.updatedAt', 'members.__v'],
      },
      {
        $lookup: {
          from: 'messages',
          localField: 'lastMessage',
          foreignField: '_id',
          as: 'lastMessage',
        },
      },
    ]);

    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.log(error);
    return { error: 'Something went wrong, try later!' };
  }
}
