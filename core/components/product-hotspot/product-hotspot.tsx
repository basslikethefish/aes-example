import * as HotspotPrimitive from '~/components/product-hotspot/primitives';
import type { HotspotMarkerProps } from '~/components/product-hotspot/primitives/hotspot-marker';

export interface ProductHotspotMarker {
  /** Horizontal position as percentage (0-100) */
  x: number;
  /** Vertical position as percentage (0-100) */
  y: number;
  /** Title displayed in the popover */
  title: string;
  /** Description displayed in the popover */
  description?: string;
}

export interface ProductHotspotProps {
  /** Additional class name for the root container */
  className?: string;
  /** Product image source URL */
  imageSrc: string;
  /** Alt text for the product image */
  imageAlt: string;
  /** Array of markers to display on the image */
  markers: ProductHotspotMarker[];
  /** Size for all markers */
  markerSize?: HotspotMarkerProps['size'];
  /** Background color for all markers (any valid CSS color) */
  markerColor?: string;
}

export function ProductHotspot({
  className,
  imageSrc,
  imageAlt,
  markers,
  markerSize,
  markerColor,
}: ProductHotspotProps) {
  return (
    <HotspotPrimitive.Root className={className}>
      <HotspotPrimitive.Image alt={imageAlt} src={imageSrc} />
      {markers.map((marker, index) => (
        <HotspotPrimitive.Marker
          color={markerColor}
          description={marker.description}
          key={index}
          size={markerSize}
          title={marker.title}
          x={marker.x}
          y={marker.y}
        />
      ))}
    </HotspotPrimitive.Root>
  );
}
