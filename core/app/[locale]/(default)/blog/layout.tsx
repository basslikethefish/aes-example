import { setRequestLocale } from 'next-intl/server';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function BlogLayout({ children, params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <div className="blog-layout">
      <header className="border-b py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Blog</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
