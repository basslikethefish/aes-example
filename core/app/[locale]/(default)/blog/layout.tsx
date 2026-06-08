import { setRequestLocale } from 'next-intl/server';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function BlogLayout({ children, params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  return <>{children}</>;
}
