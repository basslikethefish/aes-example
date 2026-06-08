'use client';

import { clsx } from 'clsx';
import {
  createContext,
  forwardRef,
  type PropsWithChildren,
  type ReactNode,
  type Ref,
  useContext,
} from 'react';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { Breadcrumb, Breadcrumbs } from '@/vibes/soul/sections/breadcrumbs';
import { Image } from '~/components/image';

interface Tag {
  label: string;
  href: string;
}

export interface BlogPostContentContextProps {
  title?: string;
  author?: string;
  date?: string;
  image?: {
    url: string;
    dimensions?: { width: number; height: number };
  };
  tags?: Tag[];
  breadcrumbs?: Array<{
    label: string;
    href: string;
  }>;
}

const PropsContext = createContext<BlogPostContentContextProps>({});

export const PropsContextProvider = ({
  value,
  children,
}: PropsWithChildren<{ value: BlogPostContentContextProps }>) => (
  <PropsContext.Provider value={value}>{children}</PropsContext.Provider>
);

interface MakeswiftProps {
  className?: string;
  title?: string;
  author?: string;
  date?: string;
  // Makeswift Image control returns just a URL string
  image?: string;
  tags?: Array<{
    label: string;
    href: { href: string };
  }>;
  breadcrumbs?: Array<{
    label: string;
    href: { href: string };
  }>;
  children?: ReactNode;
}

/**
 * MakeswiftBlogPostContent renders the complete blog post:
 * - Breadcrumbs
 * - Title, author, date
 * - Tags
 * - Featured image
 * - Body content (via children slot)
 *
 * Each blog page gets its own snapshot, so edits are unique per page.
 * SEO metadata is edited via the right sidebar (Title, Description, Social Image).
 */
export const MakeswiftBlogPostContent = forwardRef(
  (
    {
      className,
      title: makeswiftTitle,
      author: makeswiftAuthor,
      date: makeswiftDate,
      image: makeswiftImage,
      tags: makeswiftTags,
      breadcrumbs: makeswiftBreadcrumbs,
      children,
    }: MakeswiftProps,
    ref: Ref<HTMLElement>,
  ) => {
    const passedProps = useContext(PropsContext);

    // Merge passed props with Makeswift props (Makeswift props take precedence if set)
    const title = makeswiftTitle || passedProps.title || 'Untitled Post';
    const author = makeswiftAuthor || passedProps.author;
    const date = makeswiftDate || passedProps.date || new Date().toLocaleDateString();
    // Handle both Makeswift image (string URL) and passed props image (object with url)
    const imageUrl = makeswiftImage || passedProps.image?.url;

    // Convert Makeswift link format to simple href format
    const tags: Tag[] =
      makeswiftTags?.map((tag) => ({
        label: tag.label,
        href: tag.href?.href || '#',
      })) ||
      passedProps.tags ||
      [];

    const breadcrumbs: Breadcrumb[] =
      makeswiftBreadcrumbs?.map((crumb) => ({
        label: crumb.label,
        href: crumb.href?.href || '#',
      })) ||
      passedProps.breadcrumbs?.map((crumb) => ({
        label: crumb.label,
        href: crumb.href,
      })) ||
      [];

    return (
      <section className={clsx('@container', className)} ref={ref}>
        <div className="mx-auto max-w-screen-2xl px-4 pt-10 @xl:px-6 @xl:pt-14 @4xl:px-8 @4xl:pt-20">
          <header className="mx-auto w-full max-w-4xl pb-8 @2xl:pb-12 @4xl:pb-16">
            {breadcrumbs.length > 0 && <Breadcrumbs breadcrumbs={breadcrumbs} />}

            <h1 className="mb-4 mt-8 font-heading text-4xl font-medium leading-none @xl:text-5xl @4xl:text-6xl">
              {title}
            </h1>
            <p className="text-contrast-500">
              {date}{' '}
              {Boolean(author) && (
                <>
                  <span className="px-1">•</span> {author}
                </>
              )}
            </p>

            {tags.length > 0 && (
              <div className="-ml-1 mt-4 flex flex-wrap gap-1.5 @xl:mt-6">
                {tags.map((tag, index) => (
                  <ButtonLink href={tag.href} key={index} size="small" variant="tertiary">
                    {tag.label}
                  </ButtonLink>
                ))}
              </div>
            )}
          </header>

          {imageUrl && (
            <Image
              alt={title}
              className="mx-auto aspect-video w-full max-w-4xl rounded-2xl bg-contrast-100 object-cover"
              height={780}
              src={imageUrl}
              width={1280}
            />
          )}

          {/* Body content slot - unique per blog page */}
          {children && (
            <article className="mx-auto w-full max-w-4xl py-8 @2xl:py-12 @4xl:py-16">
              {children}
            </article>
          )}
        </div>
      </section>
    );
  },
);

MakeswiftBlogPostContent.displayName = 'MakeswiftBlogPostContent';
