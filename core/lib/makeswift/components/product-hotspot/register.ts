import {
  Group,
  Image,
  List,
  Number,
  Select,
  Style,
  TextInput,
} from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { MSProductHotspot } from './client';

runtime.registerComponent(MSProductHotspot, {
  type: 'primitive-product-hotspot',
  label: 'Basic / Product Hotspot',
  icon: 'image',
  props: {
    className: Style(),
    imageSrc: Image({ label: 'Product Image' }),
    imageAlt: TextInput({ label: 'Image Alt Text', defaultValue: 'Product image' }),
    markers: List({
      label: 'Hotspot Markers',
      type: Group({
        label: 'Marker',
        props: {
          x: Number({
            label: 'Horizontal Position (%)',
            defaultValue: 50,
            min: 0,
            max: 100,
          }),
          y: Number({
            label: 'Vertical Position (%)',
            defaultValue: 50,
            min: 0,
            max: 100,
          }),
          title: TextInput({ label: 'Title', defaultValue: 'Hotspot Title' }),
          description: TextInput({ label: 'Description', defaultValue: '' }),
        },
      }),
      getItemLabel(marker) {
        return marker?.title || 'Hotspot Marker';
      },
    }),
    markerSize: Select({
      label: 'Marker Size',
      options: [
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
      ],
      defaultValue: 'md',
    }),
    markerColor: TextInput({
      label: 'Marker Color',
      defaultValue: '',
    }),
  },
});
