import { connectdb } from '@/lib/connectdb';
import { pusherServer } from '@/lib/pusher';
import Chat from '@/models/chat-model';
import Message from '@/models/message-model';
import User from '@/models/user-model';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    const currentUserEmail = session?.user?.email;
    if (!currentUserEmail) {
      return Response.json({ error: 'Unauthorized!' }, { status: 401 });
    }
    const { body, image, chatId } = await req.json();
    if (!chatId || (!body && !image)) {
      return Response.json({ error: 'Missing data' }, { status: 400 });
    }

    await connectdb();

    const currentUser = await User.findOne({ email: currentUserEmail });
    const currentChat = await Chat.findById(chatId);
    if (!currentChat || !currentUser) {
      return Response.json({ error: 'Not found!' }, { status: 404 });
    }
    let flag = false;
    for (let mem of currentChat.members) {
      if (mem._id.toString() === currentUser._id.toString()) {
        flag = true;
        break;
      }
    }
    if (!flag) {
      return Response.json({ error: 'The sender is not in the chat!' }, { status: 400 });
    }

    const newMessage = new Message({
      body,
      image,
      chat: currentChat._id,
      sender: {
        name: currentUser.name,
        _id: currentUser._id,
        image: currentUser.image,
      },
      seen: [
        {
          name: currentUser.name,
          _id: currentUser._id,
        },
      ],
    });
    currentChat.messages.push(newMessage._id);
    currentChat.lastMessage = newMessage._id;

    await newMessage.save();
    await currentChat.save();

    await pusherServer.trigger(chatId, 'message:new', newMessage._doc);

    return Response.json({ message: newMessage._doc }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: 'Something went wrong!' }, { status: 500 });
  }
}
