'use client';

import { clsx } from 'clsx';
import { ReactNode } from 'react';

interface BlogBodyProps {
  className?: string;
  children?: ReactNode;
}

export function BlogBody({ className, children }: BlogBodyProps) {
  return (
    <article
      className={clsx('mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8', className)}
    >
      {children}
    </article>
  );
}
