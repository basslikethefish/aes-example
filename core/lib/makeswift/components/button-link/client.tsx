'use client';

import { useCallback } from 'react';

import { Button } from '@/vibes/soul/primitives/button';
import { ButtonLink, type ButtonLinkProps } from '@/vibes/soul/primitives/button-link';

type MSButtonLinkProps = Omit<ButtonLinkProps, 'href'> & {
  link: { href?: string; target?: string };
  text: string;
  downloadFile?: string;
};

export function MSButtonLink({
  link,
  text,
  downloadFile,
  variant,
  size,
  shape,
  className,
}: MSButtonLinkProps) {
  const handleDownload = useCallback(async () => {
    if (!downloadFile) return;

    try {
      const response = await fetch(downloadFile);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');

      anchor.href = blobUrl;
      anchor.download =
        decodeURIComponent(downloadFile.split('/').pop()?.split('?')[0] ?? '') || 'download';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(downloadFile, '_blank');
    }
  }, [downloadFile]);

  if (downloadFile) {
    return (
      <Button
        className={className}
        onClick={handleDownload}
        shape={shape}
        size={size}
        variant={variant}
      >
        {text}
      </Button>
    );
  }

  return (
    <ButtonLink
      className={className}
      href={link.href ?? '#'}
      shape={shape}
      size={size}
      target={link.target}
      variant={variant}
    >
      {text}
    </ButtonLink>
  );
}
