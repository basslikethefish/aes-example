import { Group, Image, Link, List, Slot, Style, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { MakeswiftBlogPostContent } from './blog-post-content';

export const BLOG_POST_CONTENT_COMPONENT_TYPE = 'catalyst-blog-post-content';

runtime.registerComponent(MakeswiftBlogPostContent, {
  type: BLOG_POST_CONTENT_COMPONENT_TYPE,
  label: 'Blog Post Content',
  icon: 'document',
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
    children: Slot(),
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
  },
});
