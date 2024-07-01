'use client';

import { Avatar } from '@/components/avatar';
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react';
import { TSessionUser } from '@/types';
import { AvatarUrlArray } from '@/lib/avatar';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';
import { Spinner } from '@/components/ui/loader';

export const UserAvatar = () => {
  const session = useSession();
  const update = session.update;
  const user: TSessionUser | undefined = session.data?.user;
  const [isPending, setIsPending] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const dialogClose = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setName(user?.name || '');
    setAvatarUrl(user?.image || '');
  }, [user]);

  const handleSaveChange = () => {
    if (name === '') {
      toast.error('Name cannot be empty!');
      return;
    }
    if (user && user.name === name && user.image === avatarUrl) {
      toast.error("You haven't changed anything!");
      return;
    }
    setIsPending(true);
    fetch('/api/profile/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, avatarUrl }),
    })
      .then(res => {
        if (!res.ok) return;
        return res.json();
      })
      .then(updatedUser => {
        if (updatedUser) update();
      })
      .then(() => toast.success('Your profile has up to date!'))
      .catch(err => toast.error('Something went wrong, try later!'))
      .finally(() => {
        setIsPending(false);
        dialogClose.current!.click();
      });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className='w-fit h-fit'>
          <Avatar
            url={user?.image!}
            size='md'
            active={true}
          />
        </button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader className='items-center'>
          <Avatar
            url={avatarUrl}
            size='lg'
            active={true}
          />

          <DialogTitle>
            <p className='mt-3'>{user?.name}</p>
          </DialogTitle>
          <DialogDescription>ID: {user?._id}</DialogDescription>
        </DialogHeader>
        <div className='p-5 flex flex-col gap-3'>
          <div className='grid grid-cols-6 gap-x-4 items-center'>
            <Label
              htmlFor='email'
              className='text-end col-span-1'>
              Email
            </Label>
            <Input
              id='email'
              disabled={true}
              value={user?.email || 'your email...'}
              className='col-span-5'
            />
          </div>
          <div className='grid grid-cols-6 gap-x-4 items-center'>
            <Label
              htmlFor='name'
              className='text-end col-span-1'>
              Name
            </Label>
            <Input
              id='name'
              onChange={e => setName(e.target.value)}
              value={name}
              className='col-span-5'
            />
          </div>
          <div className='flex flex-row gap-x-2 items-center gap-4'>
            <div className='flex flex-col gap-1 cursor-default'>
              <p className='text-sm font-medium'>Avatar</p>
              <p className='text-xs text-gray-500'>Change your avatar!</p>
            </div>
            <div className='flex flex-wrap gap-3 items-center justify-center p-1'>
              {AvatarUrlArray.map((url: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setAvatarUrl(url)}>
                  <Avatar
                    url={url}
                    active={false}
                    size='sm'
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <div className='w-full text-center'>
            <Button
              onClick={handleSaveChange}
              type='submit'
              disabled={isPending}
              className='bg-sky-500 hover:bg-sky-600 disabled:bg-sky-600 w-32'>
              {isPending ? (
                <Spinner
                  color='white'
                  size='sm'
                />
              ) : (
                <span>Save changes</span>
              )}
            </Button>
          </div>
          <DialogClose ref={dialogClose}></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
