import { gql } from '@shopify/hydrogen';
import { PRODUCT_CARD_FRAGMENT } from '~/lib/fragments';
import type {
  HydrogenApiRouteOptions,
  HydrogenRequest,
} from '@shopify/hydrogen';
import type { ProductConnection } from '@shopify/hydrogen/storefront-api-types';

const TOP_PRODUCTS_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query topProducts(
    $count: Int
    $countryCode: CountryCode
    $languageCode: LanguageCode
  ) @inContext(country: $countryCode, language: $languageCode) {
    products(first: $count, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
`;

export const api = async (
  _request: HydrogenRequest,
  { queryShop }: HydrogenApiRouteOptions,
) => {
  const {
    data: { products },
  } = await queryShop<{
    products: ProductConnection;
  }>({
    query: TOP_PRODUCTS_QUERY,
    variables: {
      count: 4,
    },
  });

  return products.nodes;
};
