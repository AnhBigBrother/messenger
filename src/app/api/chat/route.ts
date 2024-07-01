import { connectdb } from '@/lib/connectdb';
import { pusherServer } from '@/lib/pusher';
import Chat from '@/models/chat-model';
import User from '@/models/user-model';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    const currentUserEmail = session?.user?.email;
    if (!session || !currentUserEmail) {
      return new NextResponse('Unauthorized!', { status: 401 });
    }
    const currentUser = await User.findOne({ email: currentUserEmail });

    const body = await req.json();
    const { isGroup, members, name } = body;

    if (!members || (isGroup && (members.length < 1 || !name))) {
      return new NextResponse('Invalid data!', { status: 400 });
    }
    members.push(currentUser._id.toString());

    await connectdb();

    if (members.length === 2) {
      const currentChat = await Chat.findOne({
        members: {
          $size: 2,
          $all: members,
        },
      });
      if (currentChat) {
        return NextResponse.json(currentChat._doc);
      }
    }

    const newChat = new Chat({
      name,
      isGroup,
      members,
    });
    if (isGroup) {
      newChat.image = '/images/group.png';
    }

    const updateMembers = members.map(async (chatUserId: string) => {
      const user = await User.findById(chatUserId);
      if (!user) return new NextResponse('Invalid members id', { status: 400 });
      user.chats.push(newChat._id);
      await user.save();
    });
    await Promise.all(updateMembers);
    await newChat.save();

    const triggerMember = members.map(async (_id: any) => {
      pusherServer.trigger(_id.toString(), 'chat:new', newChat._doc);
    });
    await Promise.all(triggerMember);

    return NextResponse.json(newChat._doc);
  } catch (error) {
    console.log(error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
