import {
  useLocalization,
  useShopQuery,
  useServerAnalytics,
  ShopifyAnalyticsConstants,
  gql,
  Link,
} from '@shopify/hydrogen';
import { PageHeader, Section, Heading } from '~/components';
import { Layout, NotFound } from '~/components/index.server';
import type { Shop } from '@shopify/hydrogen/storefront-api-types';

const POLICIES_QUERY = gql`
  fragment Policy on ShopPolicy {
    id
    title
    handle
  }

  query PoliciesQuery {
    shop {
      privacyPolicy {
        ...Policy
      }
      shippingPolicy {
        ...Policy
      }
      termsOfService {
        ...Policy
      }
      refundPolicy {
        ...Policy
      }
      subscriptionPolicy {
        id
        title
        handle
      }
    }
  }
`;

const Policies = () => {
  const {
    language: { isoCode: languageCode },
  } = useLocalization();

  const { data } = useShopQuery<{
    shop: Shop;
  }>({
    query: POLICIES_QUERY,
    variables: {
      languageCode,
    },
  });

  useServerAnalytics({
    shopify: {
      pageType: ShopifyAnalyticsConstants.pageType.page,
    },
  });

  const {
    privacyPolicy,
    shippingPolicy,
    termsOfService,
    refundPolicy,
    subscriptionPolicy,
  } = data.shop;

  const policies = [
    privacyPolicy,
    shippingPolicy,
    termsOfService,
    refundPolicy,
    subscriptionPolicy,
  ];

  if (policies.every((element) => element === null)) {
    return <NotFound type='page' />;
  }

  return (
    <Layout>
      <PageHeader heading='Policies' />
      <Section padding='x' className='mb-24'>
        {policies.map((policy) => {
          if (!policy) {
            return;
          }
          return (
            <Heading className='text-heading font-normal' key={policy.id}>
              <Link to={`/policies/${policy.handle}`}>{policy.title}</Link>
            </Heading>
          );
        })}
      </Section>
    </Layout>
  );
};

export default Policies;
