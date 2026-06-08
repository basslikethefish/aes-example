import { Group, Image, Link, List, Slot, Style, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { MakeswiftBlogPostContent } from './client';

export const COMPONENT_TYPE = 'catalyst-blog-post-content';

/**
 * Blog Page Component
 *
 * This component renders the complete blog post including header (title, author, date,
 * featured image, tags, breadcrumbs) and a slot for body content.
 *
 * Each blog page gets its own instance of this component, so edits are unique per page.
 * The metadata (Title, Description, Social Image) is edited via the right sidebar,
 * NOT via this component.
 */
runtime.registerComponent(MakeswiftBlogPostContent, {
  type: COMPONENT_TYPE,
  label: 'Blog Page',
  hidden: true,
  icon: 'text',
  props: {
    className: Style({ properties: Style.Default }),
    title: TextInput({
      label: 'Title',
      defaultValue: 'My Blog Post Title',
    }),
    author: TextInput({
      label: 'Author',
      defaultValue: 'Author Name',
    }),
    date: TextInput({
      label: 'Date',
      defaultValue: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    }),
    image: Image({
      label: 'Featured Image',
    }),
    tags: List({
      label: 'Tags',
      type: Group({
        label: 'Tag',
        props: {
          label: TextInput({
            label: 'Label',
            defaultValue: 'Tag',
          }),
          href: Link({
            label: 'Link',
          }),
        },
      }),
      getItemLabel: (item) => item?.label ?? 'Tag',
    }),
    breadcrumbs: List({
      label: 'Breadcrumbs',
      type: Group({
        label: 'Breadcrumb',
        props: {
          label: TextInput({
            label: 'Label',
            defaultValue: 'Home',
          }),
          href: Link({
            label: 'Link',
          }),
        },
      }),
      getItemLabel: (item) => item?.label ?? 'Breadcrumb',
    }),
    children: Slot(),
  },
});
