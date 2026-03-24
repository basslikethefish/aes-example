import { Image, Link, Select, Style, TextInput } from '@makeswift/runtime/controls';
import { MakeswiftComponentType } from '@makeswift/runtime/react/builtins';

import { runtime } from '~/lib/makeswift/runtime';

import { MSButtonLink } from './client';

runtime.registerComponent(MSButtonLink, {
  type: MakeswiftComponentType.Button,
  label: 'Button',
  icon: 'button',
  props: {
    className: Style({ properties: [Style.Margin] }),
    text: TextInput({ label: 'Button text', defaultValue: 'Button text' }),
    link: Link({ label: 'Link' }),
    downloadFile: Image({ label: 'Download file' }),
    variant: Select({
      label: 'Color',
      options: [
        { value: 'primary', label: 'Primary' },
        { value: 'secondary', label: 'Secondary' },
        { value: 'tertiary', label: 'Tertiary' },
        { value: 'ghost', label: 'Ghost' },
      ],
      defaultValue: 'primary',
    }),
    size: Select({
      label: 'Size',
      options: [
        { value: 'x-small', label: 'X-small' },
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
      ],
      defaultValue: 'medium',
    }),
    shape: Select({
      label: 'Shape',
      options: [
        { value: 'pill', label: 'Pill' },
        { value: 'rounded', label: 'Rounded' },
        { value: 'square', label: 'Rectangle' },
        { value: 'circle', label: 'Circle' },
      ],
      defaultValue: 'pill',
    }),
  },
});
