import createWithMakeswift from '@makeswift/runtime/next/plugin';
import bundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { readFile } from 'node:fs/promises';

import { buildConfigSchema } from './build-config/schema';
import { CONFIG_FILE, writeBuildConfig } from './build-config/writer';
import { client } from './client';
import { graphql } from './client/graphql';
import { cspHeader } from './lib/content-security-policy';

const withMakeswift = createWithMakeswift();
const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: './messages/en.json',
  },
});

const SettingsQuery = graphql(`
  query SettingsQuery {
    site {
      settings {
        url {
          vanityUrl
          cdnUrl
          checkoutUrl
        }
        locales {
          code
          isDefault
        }
      }
    }
  }
`);

async function writeSettingsToBuildConfig() {
  try {
    const { data } = await client.fetch({ document: SettingsQuery });

    const cdnEnvHostnames = process.env.NEXT_PUBLIC_BIGCOMMERCE_CDN_HOSTNAME;

    const cdnUrls = (
      cdnEnvHostnames
        ? cdnEnvHostnames.split(',').map((s) => s.trim())
        : [data.site.settings?.url.cdnUrl]
    ).filter((url): url is string => !!url);

    if (!cdnUrls.length) {
      throw new Error(
        'No CDN URLs found. Please ensure that NEXT_PUBLIC_BIGCOMMERCE_CDN_HOSTNAME is set correctly.',
      );
    }

    return await writeBuildConfig({
      locales: data.site.settings?.locales,
      urls: {
        ...data.site.settings?.url,
        cdnUrls,
      },
    });
  } catch (error) {
    // If the GraphQL query fails, try to read the existing build-config.json
    // This prevents the file from being reset when there are network issues
    console.warn(
      'Failed to fetch settings from GraphQL, attempting to use existing build-config.json:',
      error instanceof Error ? error.message : String(error),
    );

    try {
      // Use the same path as the writer
      const existingConfig = JSON.parse(await readFile(CONFIG_FILE, 'utf8'));
      const parsedConfig = buildConfigSchema.parse(existingConfig);

      console.log('Successfully loaded existing build-config.json');
      return parsedConfig;
    } catch (readError) {
      // If we can't read the existing file either, throw the original error
      console.error(
        'Failed to read existing build-config.json:',
        readError instanceof Error ? readError.message : String(readError),
      );
      throw error;
    }
  }
}

export default async (): Promise<NextConfig> => {
  const settings = await writeSettingsToBuildConfig();

  let nextConfig: NextConfig = {
    reactStrictMode: true,
    experimental: {
      optimizePackageImports: ['@icons-pack/react-simple-icons'],
      ppr: 'incremental',
    },
    typescript: {
      ignoreBuildErrors: !!process.env.CI,
    },
    eslint: {
      ignoreDuringBuilds: !!process.env.CI,
      dirs: [
        'app',
        'auth',
        'build-config',
        'client',
        'components',
        'data-transformers',
        'i18n',
        'lib',
        'middlewares',
        'scripts',
        'tests',
        'vibes',
      ],
    },
    // default URL generation in BigCommerce uses trailing slash
    trailingSlash: process.env.TRAILING_SLASH !== 'false',
    // eslint-disable-next-line @typescript-eslint/require-await
    async headers() {
      const cdnLinks = settings.urls.cdnUrls.map((url) => ({
        key: 'Link',
        value: `<https://${url}>; rel=preconnect`,
      }));

      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: cspHeader.replace(/\n/g, ''),
            },
            ...cdnLinks,
          ],
        },
      ];
    },
  };

  // Apply withNextIntl to the config
  nextConfig = withNextIntl(nextConfig);

  // Apply withMakeswift to the config
  nextConfig = withMakeswift(nextConfig);

  if (process.env.ANALYZE === 'true') {
    const withBundleAnalyzer = bundleAnalyzer();

    nextConfig = withBundleAnalyzer(nextConfig);
  }

  return nextConfig;
};
