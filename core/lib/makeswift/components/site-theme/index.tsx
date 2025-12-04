import { Component } from '~/lib/makeswift/component';

import { BaseColors } from './base-colors';
import { COMPONENT_TYPE } from './register';

interface Props {
  snapshotId?: string;
  label?: string;
}

export const SiteTheme = ({ snapshotId = 'site-theme', label = 'Site Theme' }: Props) => (
  <>
    <BaseColors />
    <Component label={label} snapshotId={snapshotId} type={COMPONENT_TYPE} />
  </>
);

// Component-only version for use inside MakeswiftProvider
export const SiteThemeComponent = ({ snapshotId = 'site-theme', label = 'Site Theme' }: Props) => (
  <Component label={label} snapshotId={snapshotId} type={COMPONENT_TYPE} />
);
