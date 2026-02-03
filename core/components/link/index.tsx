'use client';

import { ComponentPropsWithRef, ComponentRef, forwardRef, useReducer } from 'react';

import { locales } from '../../i18n/locales';
import { Link as NavLink, useRouter } from '../../i18n/routing';

type NextLinkProps = Omit<ComponentPropsWithRef<typeof NavLink>, 'prefetch'>;

/**
 * Strips locale prefix from href if present.
 * This is needed because Makeswift's "Open Page" links already include the locale prefix,
 * and next-intl's Link will add another one, resulting in double prefixes like /es-MX/es-MX/page.
 */
function stripLocalePrefix(href: string): string {
  for (const locale of locales) {
    // Match /locale or /locale/ at the start of the href
    const prefix = `/${locale}`;

    if (href === prefix) {
      return '/';
    }

    if (href.startsWith(`${prefix}/`)) {
      return href.slice(prefix.length);
    }
  }

  return href;
}

interface PrefetchOptions {
  prefetch?: 'hover' | 'viewport' | 'none';
  prefetchKind?: 'auto' | 'full';
}

type Props = NextLinkProps & PrefetchOptions;

/**
 * This custom `Link` is based on  Next-Intl's `Link` component
 * https://next-intl-docs.vercel.app/docs/routing/navigation#link
 * which adds automatically prefixes for the href with the current locale as necessary
 * and extends with additional prefetching controls, making navigation
 * prefetching more adaptable to different use cases. By offering `prefetch` and `prefetchKind`
 * props, it grants explicit management over when and how prefetching occurs, defaulting to 'hover' for
 * prefetch behavior and 'auto' for prefetch kind. This approach provides a balance between optimizing
 * page load performance and resource usage. https://nextjs.org/docs/app/api-reference/components/link#prefetch
 */
export const Link = forwardRef<ComponentRef<'a'>, Props>(
  ({ href, prefetch = 'hover', prefetchKind = 'auto', children, className, ...rest }, ref) => {
    const router = useRouter();
    const [prefetched, setPrefetched] = useReducer(() => true, false);
    const computedPrefetch = computePrefetchProp({ prefetch, prefetchKind });

    // Strip locale prefix if present to avoid double-prefixing
    // (e.g., Makeswift "Open Page" links already include locale prefix)
    const normalizedHref =
      typeof href === 'string'
        ? stripLocalePrefix(href)
        : {
            ...href,
            pathname: stripLocalePrefix(href.pathname ?? ''),
          };

    const triggerPrefetch = () => {
      if (prefetched) {
        return;
      }

      if (typeof normalizedHref === 'string') {
        // PrefetchKind enum is not exported
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        router.prefetch(normalizedHref, { kind: prefetchKind });
      } else {
        // PrefetchKind enum is not exported
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        router.prefetch(normalizedHref.pathname, { kind: prefetchKind });
      }

      setPrefetched();
    };

    return (
      <NavLink
        className={className}
        href={normalizedHref}
        onMouseEnter={prefetch === 'hover' ? triggerPrefetch : undefined}
        onTouchStart={prefetch === 'hover' ? triggerPrefetch : undefined}
        prefetch={computedPrefetch}
        ref={ref}
        {...rest}
      >
        {children}
      </NavLink>
    );
  },
);

function computePrefetchProp({
  prefetch,
  prefetchKind,
}: Required<PrefetchOptions>): boolean | undefined {
  if (prefetch !== 'viewport') {
    return false;
  }

  if (prefetchKind === 'auto') {
    return undefined;
  }

  return true;
}
