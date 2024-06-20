'use client';
import register from '@/actions/register';
import { CardWrapper } from '@/components/auth/card-wrapper';
import { FormError, FormSuccess } from '@/components/auth/form-notification';
import { SubmitButton } from '@/components/auth/submit-button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RegisterSchema } from '@/lib/auth-form-schema';

import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  });
  const [isPending, setIsPending] = useState<boolean>(false);
  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    setIsPending(true);
    setSuccess('');
    setError('');
    const res = await register(data);
    if (res.error) {
      setError(res.error);
      setIsPending(false);
      return;
    }
    const res2 = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (!res2 || !res2.ok) {
      setSuccess('');
      setError(res2?.error || 'Something went wrong, try later!');
      setIsPending(false);
      return;
    }
    setError('');
    setSuccess('Success!');
    router.replace('/');
    setIsPending(false);
  };
  return (
    <CardWrapper
      headerLabel='Register'
      backButtonLabel='Already have an account? Login here!'
      backButtonHref='/login'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-5'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='Email'
                    type='email'></Input>
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}></FormField>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='Name'
                    type='text'></Input>
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}></FormField>
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='Password'
                    type='password'></Input>
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}></FormField>
          <FormSuccess message={success} />
          <FormError message={error} />
          <SubmitButton isPending={isPending}>Register</SubmitButton>
        </form>
      </Form>
    </CardWrapper>
  );
}
