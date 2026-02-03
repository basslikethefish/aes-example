/**
 * Sync BigCommerce data to Makeswift page types.
 *
 * This script:
 * 1. Ensures the "products" page type exists in Makeswift (externally managed by BigCommerce)
 * 2. Ensures the "blog" page type exists in Makeswift (managed by Makeswift)
 * 3. Fetches all products from BigCommerce
 * 4. Syncs products to Makeswift so they appear in the sidebar
 *
 * Run with: pnpm sync:makeswift
 */

import {
  ensureBlogPageType,
  ensureProductPageType,
  syncProductsToMakeswift,
} from '../lib/makeswift/page-types';

// BigCommerce GraphQL configuration
const graphqlApiDomain = process.env.BIGCOMMERCE_GRAPHQL_API_DOMAIN ?? 'mybigcommerce.com';

function getStoreHash(): string {
  const storeHash = process.env.BIGCOMMERCE_STORE_HASH;

  if (!storeHash) {
    throw new Error('BIGCOMMERCE_STORE_HASH environment variable is required');
  }

  return storeHash;
}

function getChannelId(): string | undefined {
  return process.env.BIGCOMMERCE_CHANNEL_ID;
}

function getStorefrontToken(): string {
  const token = process.env.BIGCOMMERCE_STOREFRONT_TOKEN;

  if (!token) {
    throw new Error('BIGCOMMERCE_STOREFRONT_TOKEN environment variable is required');
  }

  return token;
}

function getGraphQLEndpoint(): string {
  const storeHash = getStoreHash();
  const channelId = getChannelId();

  if (!channelId || channelId === '1') {
    return `https://store-${storeHash}.${graphqlApiDomain}/graphql`;
  }

  return `https://store-${storeHash}-${channelId}.${graphqlApiDomain}/graphql`;
}

// GraphQL query to fetch all products with pagination
const GET_ALL_PRODUCTS_QUERY = `
  query GetAllProductsForSync($first: Int!, $after: String) {
    site {
      products(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            entityId
            name
            path
          }
        }
      }
    }
  }
`;

interface ProductNode {
  entityId: number;
  name: string;
  path: string;
}

interface ProductsResponse {
  data: {
    site: {
      products: {
        pageInfo: {
          hasNextPage: boolean;
          endCursor: string | null;
        };
        edges: Array<{
          node: ProductNode;
        }>;
      };
    };
  };
  errors?: Array<{ message: string }>;
}

/**
 * Fetches all products from BigCommerce using GraphQL.
 * Handles pagination automatically.
 */
async function fetchAllProducts(): Promise<ProductNode[]> {
  const endpoint = getGraphQLEndpoint();
  const token = getStorefrontToken();
  const allProducts: ProductNode[] = [];

  let hasNextPage = true;
  let cursor: string | null = null;
  let pageNumber = 1;

  console.log(`Fetching products from BigCommerce (${endpoint})...`);

  while (hasNextPage) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: GET_ALL_PRODUCTS_QUERY,
        variables: {
          first: 50, // BigCommerce max per page
          after: cursor,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`BigCommerce API error: ${response.status} ${response.statusText}`);
    }

    const result = (await response.json()) as ProductsResponse;

    if (result.errors?.length) {
      throw new Error(
        `BigCommerce GraphQL errors: ${result.errors.map((e) => e.message).join(', ')}`,
      );
    }

    const products = result.data.site.products.edges.map((edge) => edge.node);

    allProducts.push(...products);

    hasNextPage = result.data.site.products.pageInfo.hasNextPage;
    cursor = result.data.site.products.pageInfo.endCursor;

    console.log(
      `  Page ${pageNumber}: fetched ${products.length} products (total: ${allProducts.length})`,
    );
    pageNumber++;
  }

  return allProducts;
}

async function main(): Promise<void> {
  console.log('=== Makeswift Page Types Sync ===\n');

  // Validate required environment variables
  if (!process.env.MAKESWIFT_SITE_API_KEY) {
    throw new Error('MAKESWIFT_SITE_API_KEY environment variable is required');
  }

  // Step 1: Ensure page types exist in Makeswift
  console.log('Step 1: Ensuring page types exist in Makeswift...');
  await ensureProductPageType();
  await ensureBlogPageType();
  console.log('');

  // Step 2: Fetch all products from BigCommerce
  console.log('Step 2: Fetching products from BigCommerce...');
  const products = await fetchAllProducts();
  console.log(`\nFound ${products.length} products total.\n`);

  if (products.length === 0) {
    console.log('No products to sync. Done!');

    return;
  }

  // Step 3: Sync to Makeswift
  console.log('Step 3: Syncing products to Makeswift...');
  const result = await syncProductsToMakeswift(products, {
    // Set to true to remove products that no longer exist in BigCommerce
    // Be careful with this in development!
    removeOrphans: process.env.MAKESWIFT_SYNC_REMOVE_ORPHANS === 'true',
  });

  console.log('\n=== Sync Complete ===');
  console.log(`Total pages: ${result.totalPages}`);
  console.log(`  Created: ${result.created}`);
  console.log(`  Updated: ${result.updated}`);
  console.log(`  Unchanged: ${result.unchanged}`);
  console.log(`  Removed: ${result.removed}`);
}

main().catch((error: unknown) => {
  console.error('\n=== Sync Failed ===');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
