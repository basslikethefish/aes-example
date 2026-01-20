import type { ComponentProps, ElementType } from 'react';

import { cn } from '~/lib/cn';

export type HotspotRootProps<E extends ElementType = 'div'> = Omit<ComponentProps<E>, 'as'> & {
  as?: E;
};

export function HotspotRoot<T extends ElementType = 'div'>({
  as,
  className,
  children,
  ...props
}: HotspotRootProps<T>) {
  const Component = as ?? 'div';

  return (
    <Component
      className={cn('relative inline-block w-full', className)}
      data-slot="hotspot-root"
      {...props}
    >
      {children}
    </Component>
  );
}
