'use server';
import { connectdb } from '@/lib/connectdb';
import User from '@/models/user-model';
import { getServerSession } from 'next-auth';

const getPeople = async () => {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return [];
  }

  const currentUserEmail = session.user.email;
  await connectdb();
  try {
    const users = await User.aggregate([
      {
        $match: {
          email: { $ne: currentUserEmail },
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          image: 1,
        },
      },
    ]);
    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    return [];
  }
};

export default getPeople;
