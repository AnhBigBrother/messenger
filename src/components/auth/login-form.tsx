'use client';

import { CardWrapper } from '@/components/auth/card-wrapper';
import { SubmitButton } from '@/components/auth/submit-button';
import { FormError, FormSuccess } from '@/components/auth/form-notification';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { LoginSchema } from '@/lib/auth-form-schema';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    setIsPending(true);
    setSuccess('');
    setError('');
    signIn('credentials', {
      ...data,
      redirect: false,
    })
      .then(res => {
        if (!res || !res.ok) {
          setSuccess('');
          setError(res?.error || 'Something went wrong, try later!');
          return;
        }
        setError('');
        setSuccess('Success!');
        router.replace('/');
      })
      .finally(() => setIsPending(false));
  };

  return (
    <CardWrapper
      headerLabel='Sign in'
      backButtonLabel="Don't have an account? Register here!"
      backButtonHref='/register'
      showSocial={true}>
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
          <SubmitButton isPending={isPending}>Sign in</SubmitButton>
        </form>
      </Form>
    </CardWrapper>
  );
}
