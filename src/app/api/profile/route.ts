import { connectdb } from '@/lib/connectdb';
import User from '@/models/user-model';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized!', { status: 401 });
    }
    const body = await req.json();
    const { name, avatarUrl } = body;
    if (!name && !avatarUrl) {
      return new NextResponse('Missing infomation!', { status: 400 });
    }

    await connectdb();

    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return new NextResponse('User not found!', { status: 404 });
    }
    if (name) currentUser.name = name;
    if (avatarUrl) currentUser.image = avatarUrl;
    await currentUser.save();

    return NextResponse.json({
      updatedUser: {
        _id: currentUser._id.toString(),
        name: currentUser.name,
        image: currentUser.image,
        email: currentUser.email,
      },
    });
  } catch (error) {
    console.log(error);
    return Response.json({ error: 'Something went wrong!' }, { status: 500 });
  }
}
