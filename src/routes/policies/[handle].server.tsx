import {
  useLocalization,
  useShopQuery,
  Seo,
  useServerAnalytics,
  ShopifyAnalyticsConstants,
  gql,
  type HydrogenRouteProps,
} from '@shopify/hydrogen';
import { FC, Suspense } from 'react';
import { Button, PageHeader, Section } from '~/components';
import { NotFound, Layout } from '~/components/index.server';

const POLICIES_QUERY = gql`
  fragment Policy on ShopPolicy {
    body
    handle
    id
    title
    url
  }

  query PoliciesQuery(
    $languageCode: LanguageCode
    $privacyPolicy: Boolean!
    $shippingPolicy: Boolean!
    $termsOfService: Boolean!
    $refundPolicy: Boolean!
  ) @inContext(language: $languageCode) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) {
        ...Policy
      }
      shippingPolicy @include(if: $shippingPolicy) {
        ...Policy
      }
      termsOfService @include(if: $termsOfService) {
        ...Policy
      }
      refundPolicy @include(if: $refundPolicy) {
        ...Policy
      }
    }
  }
`;

const Policy: FC<HydrogenRouteProps> = ({ params }) => {
  const {
    language: { isoCode: languageCode },
  } = useLocalization();
  const { handle } = params;

  // standard policy pages
  const policy: Record<string, boolean> = {
    privacyPolicy: handle === 'privacy-policy',
    shippingPolicy: handle === 'shipping-policy',
    termsOfService: handle === 'terms-of-service',
    refundPolicy: handle === 'refund-policy',
  };

  // if not a valid policy route, return not found
  if (
    !policy.privacyPolicy &&
    !policy.shippingPolicy &&
    !policy.termsOfService &&
    !policy.refundPolicy
  ) {
    return <NotFound />;
  }

  // The currently visited policy page key
  const activePolicy = Object.keys(policy).find((key) => policy[key])!;

  const {
    data: { shop },
  } = useShopQuery({
    query: POLICIES_QUERY,
    variables: {
      languageCode,
      ...policy,
    },
  });

  const page = shop?.[activePolicy];

  // If the policy page is empty, return not found
  if (!page) return <NotFound />;

  useServerAnalytics({
    shopify: {
      pageType: ShopifyAnalyticsConstants.pageType.page,
      resourceId: page.id,
    },
  });

  return (
    <Layout>
      <Suspense>
        <Seo type='page' data={page} />
      </Suspense>
      <Section
        padding='all'
        display='flex'
        className='flex-col gap-8 items-baseline w-full md:flex-row'
      >
        <PageHeader
          heading={page.title}
          className='grid top-36 grow gap-4 items-start md:sticky md:w-5/12'
        >
          <Button
            className='justify-self-start'
            variant='inline'
            to='/policies'
          >
            &larr; Back to Policies
          </Button>
        </PageHeader>
        <div className='grow w-full md:w-7/12'>
          <div
            dangerouslySetInnerHTML={{ __html: page.body }}
            className='prose dark:prose-invert'
          />
        </div>
      </Section>
    </Layout>
  );
};

export default Policy;
