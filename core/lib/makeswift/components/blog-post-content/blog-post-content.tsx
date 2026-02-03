'use client';

import { clsx } from 'clsx';
import { ReactNode } from 'react';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { Breadcrumb, Breadcrumbs } from '@/vibes/soul/sections/breadcrumbs';
import { Image } from '~/components/image';

interface Tag {
  label: string;
  href: string;
}

interface BlogPostContentProps {
  className?: string;
  title: string;
  author?: string;
  date: string;
  children?: ReactNode;
  image?: {
    url: string;
    dimensions: { width: number; height: number };
  };
  tags?: Tag[];
  breadcrumbs?: Array<{
    label: string;
    href: string;
  }>;
}

export function MakeswiftBlogPostContent({
  className,
  title,
  author,
  date,
  children,
  image,
  tags,
  breadcrumbs,
}: BlogPostContentProps) {
  const breadcrumbsData: Breadcrumb[] | undefined = breadcrumbs?.map((crumb) => ({
    label: crumb.label,
    href: crumb.href,
  }));

  return (
    <section className={clsx('@container', className)}>
      <div className="mx-auto max-w-screen-2xl px-4 py-10 @xl:px-6 @xl:py-14 @4xl:px-8 @4xl:py-20">
        <header className="mx-auto w-full max-w-4xl pb-8 @2xl:pb-12 @4xl:pb-16">
          {breadcrumbsData && breadcrumbsData.length > 0 && (
            <Breadcrumbs breadcrumbs={breadcrumbsData} />
          )}

          <h1 className="mb-4 mt-8 font-heading text-4xl font-medium leading-none @xl:text-5xl @4xl:text-6xl">
            {title || 'Untitled Post'}
          </h1>
          <p>
            {date || new Date().toLocaleDateString()}{' '}
            {Boolean(author) && (
              <>
                <span className="px-1">•</span> {author}
              </>
            )}
          </p>

          {tags && tags.length > 0 && (
            <div className="-ml-1 mt-4 flex flex-wrap gap-1.5 @xl:mt-6">
              {tags.map((tag, index) => (
                <ButtonLink href={tag.href || '#'} key={index} size="small" variant="tertiary">
                  {tag.label}
                </ButtonLink>
              ))}
            </div>
          )}
        </header>

        {image?.url && (
          <Image
            alt={title || 'Blog post image'}
            className="mb-8 aspect-video w-full rounded-2xl bg-contrast-100 object-cover @2xl:mb-12 @4xl:mb-16"
            height={780}
            src={image.url}
            width={1280}
          />
        )}

        <article className="@-xl:[&_h2]:text-4xl prose mx-auto w-full max-w-4xl space-y-4 [&_h2]:font-heading [&_h2]:text-3xl [&_h2]:font-normal [&_h2]:leading-none [&_img]:mx-auto [&_img]:max-h-[600px] [&_img]:w-fit [&_img]:rounded-2xl [&_img]:object-cover">
          {children}
        </article>
      </div>
    </section>
  );
}
