'use server';
import { connectdb } from '@/lib/connectdb';
import User from '@/models/user-model';
import { getServerSession } from 'next-auth';

export default async function getChats() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return { error: 'Something went wrong, try later!' };
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
          as: 'chats_mapping',
        },
      },
      {
        $set: {
          chats: '$chats_mapping',
        },
      },
      { $unset: ['chats_mapping'] },
      {
        $project: {
          chats: 1,
        },
      },
    ]);

    return JSON.parse(JSON.stringify(data[0].chats));
  } catch (error) {
    return { error: 'Something went wrong, try later!' };
  }
}
