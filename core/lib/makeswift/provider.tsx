'use client';

import { ReactRuntimeProvider, RootStyleRegistry, type SiteVersion } from '@makeswift/runtime/next';

import { runtime } from '~/lib/makeswift/runtime';
import '~/lib/makeswift/components';

export function MakeswiftProvider({
  children,
  siteVersion,
  appOrigin,
}: {
  children: React.ReactNode;
  siteVersion: SiteVersion | null;
  appOrigin?: string;
}) {
  return (
    <ReactRuntimeProvider runtime={runtime} siteVersion={siteVersion} appOrigin={appOrigin}>
      <RootStyleRegistry enableCssReset={false}>{children}</RootStyleRegistry>
    </ReactRuntimeProvider>
  );
}
