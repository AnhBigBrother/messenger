import { connectdb } from '@/lib/connectdb';
import { pusherServer } from '@/lib/pusher';
import Chat from '@/models/chat-model';
import Message from '@/models/message-model';
import User from '@/models/user-model';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { chatId: string } }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return new NextResponse('Unauthorized!', { status: 401 });
    }

    const { chatId } = params;

    await connectdb();

    const currentUser = await User.findOne({ email: session.user?.email });
    const currentChat = await Chat.findById(chatId);
    if (!currentChat) {
      return new NextResponse('Chat not found', { status: 404 });
    }

    const lastMessage = await Message.findById(currentChat.lastMessage);
    if (!lastMessage) {
      return NextResponse.json({ message: 'Chat is empty' });
    }
    for (let u of lastMessage.seen) {
      if (u._id.toString() === currentUser._id.toString()) {
        return NextResponse.json(lastMessage._doc);
      }
    }
    lastMessage.seen.push({
      _id: currentUser._id,
      name: currentUser.name,
    });
    await lastMessage.save();

    await pusherServer.trigger(lastMessage._id.toString(), 'message:seen', { _id: currentUser._id.toString(), name: currentUser.name });

    return NextResponse.json(lastMessage._doc);
  } catch (error) {
    console.log('MESSAGE SEEN ERROR', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
