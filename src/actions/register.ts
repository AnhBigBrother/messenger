'use server';
import { RegisterSchema } from '@/lib/auth-form-schema';
import { getRandomAvatar } from '@/lib/avatar';
import { connectdb } from '@/lib/connectdb';
import User from '@/models/user-model';
import bcrypt from 'bcrypt';
import { z } from 'zod';

export default async function register(data: z.infer<typeof RegisterSchema>) {
  const { email, name, password } = data;
  if (!email || !name || !password) {
    return { error: 'Missing credential' };
  }
  await connectdb();
  const existingUser = await User.findOne({ email });
  if (existingUser && existingUser.password) {
    return { error: 'Email is registered!' };
  }
  const hashedPwd = await bcrypt.hash(password, 12);
  if (existingUser) {
    existingUser.password = hashedPwd;
    existingUser.name = name;
    await existingUser.save();
    return existingUser._doc;
  }

  const image = getRandomAvatar();
  const newUser = new User({ email, name, password: hashedPwd, image });
  await newUser.save();
  return newUser._doc;
}
