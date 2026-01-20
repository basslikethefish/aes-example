import type { ComponentProps } from 'react';

import { cn } from '~/lib/cn';

export type HotspotImageProps = ComponentProps<'img'> & {
  src: string;
  alt: string;
};

export function HotspotImage({ className, src, alt, ...props }: HotspotImageProps) {
  return (
    <img
      alt={alt}
      className={cn('block h-auto w-full select-none', className)}
      data-slot="hotspot-image"
      draggable={false}
      src={src}
      {...props}
    />
  );
}
