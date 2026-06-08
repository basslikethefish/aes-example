import { MakeswiftComponent } from '@makeswift/runtime/next';

import { getComponentSnapshot } from '~/lib/makeswift/client';

import { BlogPostContentContextProps, PropsContextProvider } from './client';
import { COMPONENT_TYPE } from './register';

interface Props extends BlogPostContentContextProps {
  /**
   * Unique snapshot ID for this blog page.
   * Each blog page should have its own snapshot ID to make content unique per page.
   * Example: 'blog-post-/blog/1' or 'blog-post-my-first-post'
   */
  snapshotId: string;
  label?: string;
}

/**
 * BlogPostContent renders the blog post with header fields and a body slot.
 *
 * Each blog page gets its own snapshot based on the snapshotId prop,
 * making the content unique and independently editable per page.
 *
 * The page's metadata (Title, Description, Social Image, SEO settings) is
 * edited via the right sidebar in Makeswift, not via this component.
 */
export const BlogPostContent = async ({ snapshotId, label = 'Blog Page', ...props }: Props) => {
  const snapshot = await getComponentSnapshot(snapshotId);

  return (
    <PropsContextProvider value={props}>
      <MakeswiftComponent label={label} snapshot={snapshot} type={COMPONENT_TYPE} />
    </PropsContextProvider>
  );
};
