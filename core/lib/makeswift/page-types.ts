const MAKESWIFT_API_ORIGIN = process.env.MAKESWIFT_API_ORIGIN || 'https://api.makeswift.com';

interface PageType {
  object: 'page_type';
  id: string;
  slug: string;
  name: string;
  managedBy: 'makeswift' | 'external';
  externalSource?: string;
  sortOrder: number;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

interface PageTypeConfig {
  slug: string;
  name: string;
  managedBy: 'makeswift' | 'external';
  externalSource?: string;
  externalSourceViewUrlTemplate?: string;
  sortOrder?: number;
  icon?: string;
}

interface SyncPage {
  externalId: string;
  pathname: string;
  name: string;
  metadata?: Record<string, unknown>;
}

interface SyncResult {
  object: 'sync_result';
  pageTypeId: string;
  totalPages: number;
  created: number;
  updated: number;
  unchanged: number;
  removed: number;
  pages: Array<{
    externalId: string;
    pageId: string;
    pathname: string;
    action: 'created' | 'updated' | 'unchanged' | 'removed';
  }>;
}

function getApiKey(): string {
  const apiKey = process.env.MAKESWIFT_SITE_API_KEY;

  if (!apiKey) {
    throw new Error('MAKESWIFT_SITE_API_KEY environment variable is required');
  }

  return apiKey;
}

function getHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'x-api-key': getApiKey(),
  };
}

/**
 * Ensures a page type exists in Makeswift.
 * Creates it if it doesn't exist, or returns the existing one.
 */
export async function ensurePageType(config: PageTypeConfig): Promise<PageType> {
  const headers = getHeaders();

  // Check if page type already exists
  const getResponse = await fetch(`${MAKESWIFT_API_ORIGIN}/v1/page-types/${config.slug}`, {
    headers,
  });

  if (getResponse.ok) {
    const existing = (await getResponse.json()) as PageType & { externalSourceViewUrlTemplate?: string };
    console.log(`Page type "${config.slug}" already exists`);

    // Optionally update the template so "View source" works (e.g. after adding env var)
    if (config.externalSourceViewUrlTemplate != null) {
      const patchResponse = await fetch(`${MAKESWIFT_API_ORIGIN}/v1/page-types/${existing.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ externalSourceViewUrlTemplate: config.externalSourceViewUrlTemplate }),
      });
      if (patchResponse.ok) {
        return (await patchResponse.json()) as PageType;
      }
    }
    return existing;
  }

  if (getResponse.status !== 404) {
    const errorText = await getResponse.text();

    throw new Error(
      `Failed to check page type: ${getResponse.status} ${getResponse.statusText} - ${errorText}`,
    );
  }

  // Create the page type
  const createResponse = await fetch(`${MAKESWIFT_API_ORIGIN}/v1/page-types`, {
    method: 'POST',
    headers,
    body: JSON.stringify(config),
  });

  if (!createResponse.ok) {
    const errorText = await createResponse.text();

    throw new Error(
      `Failed to create page type: ${createResponse.status} ${createResponse.statusText} - ${errorText}`,
    );
  }

  console.log(`Created page type "${config.slug}"`);

  return (await createResponse.json()) as PageType;
}

/**
 * Ensures the "products" page type exists in Makeswift.
 * Creates it if it doesn't exist, or returns the existing one.
 */
/**
 * BigCommerce product edit URL template. {{externalId}} is replaced with the product's entity ID.
 * Set BIGCOMMERCE_VIEW_PRODUCT_URL_TEMPLATE in env to override (e.g. with your store hash).
 */
const BIGCOMMERCE_VIEW_PRODUCT_URL_TEMPLATE =
  process.env.BIGCOMMERCE_VIEW_PRODUCT_URL_TEMPLATE ||
  'https://login.bigcommerce.com/app/default/manage/catalog/products/{{externalId}}';

export async function ensureProductPageType(): Promise<PageType> {
  return ensurePageType({
    slug: 'products',
    name: 'Products',
    managedBy: 'external',
    externalSource: 'BigCommerce',
    externalSourceViewUrlTemplate: BIGCOMMERCE_VIEW_PRODUCT_URL_TEMPLATE,
    sortOrder: 1,
    icon: 'shopping-cart',
  });
}

/**
 * Ensures the "blog" page type exists in Makeswift.
 * This page type is managed by Makeswift (users can create/delete blog posts in the builder).
 * All blog pages have a path prefix of /blog.
 */
export async function ensureBlogPageType(): Promise<PageType> {
  return ensurePageType({
    slug: 'blog',
    name: 'Blog',
    managedBy: 'makeswift',
    sortOrder: 2,
    icon: 'document',
  });
}

/**
 * Syncs BigCommerce products to Makeswift pages.
 *
 * @param products - Array of products with entityId, name, and path
 * @param options - Sync options
 * @param options.removeOrphans - If true, removes pages that don't exist in the sync (default: false)
 */
export async function syncProductsToMakeswift(
  products: Array<{ entityId: number; name: string; path: string }>,
  options: { removeOrphans?: boolean } = {},
): Promise<SyncResult> {
  const { removeOrphans = false } = options;

  // Transform products to sync format.
  // externalId is the numeric entityId so "View source" can open the BigCommerce product edit URL.
  const pages: SyncPage[] = products.map((product) => ({
    externalId: String(product.entityId),
    pathname: product.path.replace(/^\/|\/$/g, ''), // "/african-fig/" -> "african-fig"
    name: product.name,
    metadata: {
      entityId: product.entityId,
      originalPath: product.path,
    },
  }));

  const response = await fetch(`${MAKESWIFT_API_ORIGIN}/v1/page-types/products/sync`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      pages,
      removeOrphans,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(`Sync failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const result = (await response.json()) as SyncResult;

  console.log(
    `Synced ${result.totalPages} products: ${result.created} created, ${result.updated} updated, ${result.unchanged} unchanged, ${result.removed} removed`,
  );

  return result;
}
