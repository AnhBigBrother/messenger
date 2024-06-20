'use client';

import { BackButton } from '@/components/auth/back-button';
import { FormHeader } from '@/components/auth/form-header';
import Social from '@/components/auth/social';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import React from 'react';

type CardWrapperProps = {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
};

function CardWrapper({ children, headerLabel, backButtonLabel, backButtonHref, showSocial }: CardWrapperProps) {
  return (
    <div className='h-screen flex items-center justify-center'>
      <Card className='w-fit sm:min-w-[360px] shadow-lg'>
        <CardHeader>
          <FormHeader label={headerLabel}></FormHeader>
        </CardHeader>
        <CardContent> {children}</CardContent>
        {showSocial && (
          <CardFooter>
            <Social />
          </CardFooter>
        )}
        <CardFooter>
          <BackButton
            href={backButtonHref}
            label={backButtonLabel}></BackButton>
        </CardFooter>
      </Card>
    </div>
  );
}

export { CardWrapper };
