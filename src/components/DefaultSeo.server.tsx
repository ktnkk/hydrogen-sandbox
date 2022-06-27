import { CacheLong, gql, Seo, useShopQuery } from '@shopify/hydrogen';

const SHOP_QUERY = gql`
  query shopInfo {
    shop {
      name
      description
    }
  }
`;

export const DefaultSeo = () => {
  const {
    data: {
      shop: { name, description },
    },
  } = useShopQuery({
    query: SHOP_QUERY,
    cache: CacheLong(),
    preload: '*',
  });

  return (
    // @ts-ignore TODO: Fix types
    <Seo
      type='defaultSeo'
      data={{
        title: name,
        description,
        titleTemplate: `%s · ${name}`,
      }}
    />
  );
};
