import { gql } from '@shopify/hydrogen';
import type {
  HydrogenApiRouteOptions,
  HydrogenRequest,
} from '@shopify/hydrogen';
import type { Localization } from '@shopify/hydrogen/storefront-api-types';

const COUNTRIES_QUERY = gql`
  query Localization {
    localization {
      availableCountries {
        isoCode
        name
        currency {
          isoCode
        }
      }
    }
  }
`;

export const api = async (
  _request: HydrogenRequest,
  { queryShop }: HydrogenApiRouteOptions,
) => {
  const {
    data: {
      localization: { availableCountries },
    },
  } = await queryShop<{
    localization: Localization;
  }>({
    query: COUNTRIES_QUERY,
  });

  return availableCountries.sort((a, b) => a.name.localeCompare(b.name));
};
