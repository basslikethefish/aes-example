'use client';

import { ProductHotspot, type ProductHotspotMarker, type ProductHotspotProps } from '~/components/product-hotspot';

type MSProductHotspotProps = Omit<ProductHotspotProps, 'markers' | 'imageSrc'> & {
  imageSrc?: string;
  markers?: ProductHotspotMarker[];
};

// Default image: Three potted Caladium plants on a warm orange background
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=800&fit=crop';

export function MSProductHotspot({ markers = [], imageSrc, ...props }: MSProductHotspotProps) {
  const finalImageSrc = imageSrc || DEFAULT_IMAGE;

  return <ProductHotspot {...props} imageSrc={finalImageSrc} markers={markers} />;
}
