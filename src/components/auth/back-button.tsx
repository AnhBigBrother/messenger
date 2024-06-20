import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

const BackButton = ({ href, label }: { href: string; label: string }) => {
  return (
    <Button
      variant={'link'}
      className='font-normal w-full'
      size={'sm'}
      asChild>
      <Link href={href}>{label}</Link>
    </Button>
  );
};

export { BackButton };
