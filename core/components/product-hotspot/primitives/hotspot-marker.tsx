import * as PopoverPrimitive from '@radix-ui/react-popover';
import { clsx } from 'clsx';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '~/lib/cn';

interface MarkerStyle extends React.CSSProperties {
  '--hotspot-marker-background'?: string;
}

type MarkerSize = 'sm' | 'md' | 'lg';

const sizeClasses: Record<MarkerSize, string> = {
  sm: 'h-6 w-6 text-xs',
  md: 'h-8 w-8 text-sm',
  lg: 'h-10 w-10 text-base',
};

export type HotspotMarkerProps = Omit<ComponentProps<typeof PopoverPrimitive.Root>, 'children'> & {
  /** Horizontal position as percentage (0-100) */
  x: number;
  /** Vertical position as percentage (0-100) */
  y: number;
  /** Title displayed in the popover */
  title: string;
  /** Description displayed in the popover */
  description?: string;
  /** Custom icon or content to display in the marker */
  icon?: ReactNode;
  /** Background color for the marker (any valid CSS color) */
  color?: string;
  /** Size of the marker */
  size?: MarkerSize;
};

export function HotspotMarker({
  x,
  y,
  title,
  description,
  icon,
  color,
  size = 'md',
  ...props
}: HotspotMarkerProps) {
  const markerStyle: MarkerStyle = {
    left: `${x}%`,
    top: `${y}%`,
    '--hotspot-marker-background': color,
  };

  const markerClasses = clsx(
    'absolute z-10 flex items-center justify-center',
    'rounded-full border-2',
    'cursor-pointer transition-all duration-200 ease-out',
    '-translate-x-1/2 -translate-y-1/2',
    // Focus styles
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    // Hover/Active states
    'hover:scale-110 data-[state=open]:scale-110',
    // Colors
    'border-background',
    'bg-brand',
    'text-background',
    'shadow-md',
    sizeClasses[size],
  );

  return (
    <PopoverPrimitive.Root {...props}>
      <PopoverPrimitive.Trigger
        aria-label={title}
        className={markerClasses}
        data-slot="hotspot-marker"
        style={markerStyle}
      >
        {icon ?? (
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
          </span>
        )}
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="center"
          className={cn(
            'z-50 w-64 rounded-lg border p-4 shadow-xl',
            'bg-background',
            // Animation
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
            // Side-based slide animations
            'data-[side=bottom]:slide-in-from-top-2',
            'data-[side=left]:slide-in-from-right-2',
            'data-[side=right]:slide-in-from-left-2',
            'data-[side=top]:slide-in-from-bottom-2',
          )}
          data-slot="hotspot-popover"
          side="top"
          sideOffset={12}
        >
          <h3 className="text-sm font-semibold text-foreground" data-slot="hotspot-popover-title">
            {title}
          </h3>
          {description != null && (
            <p
              className="mt-1.5 text-sm leading-relaxed text-contrast-500"
              data-slot="hotspot-popover-description"
            >
              {description}
            </p>
          )}
          <PopoverPrimitive.Arrow className="fill-background" height={6} width={12} />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

// Export for backwards compatibility with the original component
export const hotspotMarkerVariants = {
  size: {
    sm: 'sm',
    md: 'md',
    lg: 'lg',
  },
} as const;
