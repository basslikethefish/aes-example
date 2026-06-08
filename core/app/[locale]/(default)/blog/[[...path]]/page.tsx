import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { getPageSnapshot } from '~/lib/makeswift/client';
import { MakeswiftPageShim } from '~/lib/makeswift/makeswift-page-shim';
import { BlogPostContent } from '~/lib/makeswift/components/blog-post-content';

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

  const isBlogIndex = !pathSegments || pathSegments.length === 0;
  const path =
    '/blog' + (pathSegments && pathSegments.length > 0 ? '/' + pathSegments.join('/') : '');

  const snapshot = await getPageSnapshot({ path, locale });

  if (snapshot == null) {
    return notFound();
  }

  if (isBlogIndex) {
    // Blog index page (/blog) - render normal Makeswift page
    return <MakeswiftPageShim snapshot={snapshot} />;
  }

  // Blog post pages (/blog/*) - render with BlogPostContent component
  // Use the page's unique ID for the snapshot so content stays connected even if path changes
  // The page ID is a UUID that never changes, unlike the path which can be renamed
  const pageId = (snapshot as { id?: string }).id;
  const blogPath = pathSegments?.join('/') || 'post';
  const snapshotId = pageId ? `blog-post-${pageId}` : `blog-post-${blogPath}`;
  const blogLabel = `Blog: ${blogPath}`;

  return (
    <BlogPostContent
      snapshotId={snapshotId}
      label={blogLabel}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Blog', href: '/blog' },
      ]}
    />
  );
}
