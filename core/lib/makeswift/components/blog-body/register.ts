import { Slot, Style } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { BlogBody } from './blog-body';

export const BLOG_BODY_COMPONENT_TYPE = 'catalyst-blog-body';

runtime.registerComponent(BlogBody, {
  type: BLOG_BODY_COMPONENT_TYPE,
  label: 'Blog Body',
  icon: 'text',
  props: {
    className: Style({ properties: Style.Default }),
    children: Slot(),
  },
});
