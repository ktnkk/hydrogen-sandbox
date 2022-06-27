import { ProductCard } from '~/components';
import type { Product } from '@shopify/hydrogen/storefront-api-types';

export const ProductCards = ({ products }: { products: Product[] }) => {
  return (
    <>
      {products.map((product) => (
        <ProductCard
          product={product}
          key={product.id}
          className={'w-80 snap-start'}
        />
      ))}
    </>
  );
};
