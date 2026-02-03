import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { getPageSnapshot } from '~/lib/makeswift/client';
import { MakeswiftPageShim } from '~/lib/makeswift/makeswift-page-shim';

interface Props {
  params: Promise<{
    locale: string;
    path?: string[];
  }>;
}

export async function generateStaticParams() {
  // Optionally pre-generate blog pages at build time
  return [];
}

export default async function BlogPage({ params }: Props) {
  const { locale, path: pathSegments } = await params;

  setRequestLocale(locale);

  // Construct the full path: /blog or /blog/something
  const path =
    '/blog' + (pathSegments && pathSegments.length > 0 ? '/' + pathSegments.join('/') : '');

  const snapshot = await getPageSnapshot({ path, locale });

  if (snapshot == null) {
    return notFound();
  }

  return <MakeswiftPageShim snapshot={snapshot} />;
}
