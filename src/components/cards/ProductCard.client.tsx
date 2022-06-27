import {
  flattenConnection,
  Image,
  Link,
  Money,
  useMoney,
} from '@shopify/hydrogen';
import clsx from 'clsx';
import { Text } from '~/components';
import { getProductPlaceholder } from '~/lib/placeholders';
import { isDiscounted, isNewArrival } from '~/lib/utils';
import type {
  MoneyV2,
  Product,
  ProductVariant,
  ProductVariantConnection,
} from '@shopify/hydrogen/storefront-api-types';
import type { FC } from 'react';

type CompareAtPriceProps = {
  data: MoneyV2;
  className?: string;
};

type ProductCardProps = {
  product: Product;
  label?: string;
  className?: string;
  loading?: HTMLImageElement['loading'];
  onClick?: () => void;
};

const CompareAtPrice: FC<CompareAtPriceProps> = ({ data, className }) => {
  const { currencyNarrowSymbol, withoutTrailingZerosAndCurrency } =
    useMoney(data);

  const styles = clsx('strike', className);

  return (
    <span className={styles}>
      {currencyNarrowSymbol}
      {withoutTrailingZerosAndCurrency}
    </span>
  );
};

export const ProductCard: FC<ProductCardProps> = ({
  product,
  label,
  className,
  loading,
  onClick,
}) => {
  let cardLabel;

  const cardData = product?.variants ? product : getProductPlaceholder();

  const {
    image,
    priceV2: price,
    compareAtPriceV2: compareAtPrice,
  } = flattenConnection<ProductVariant>(
    cardData?.variants as ProductVariantConnection,
  )[0] || {};

  if (label) {
    cardLabel = label;
  } else if (isDiscounted(price as MoneyV2, compareAtPrice as MoneyV2)) {
    cardLabel = 'Sale';
  } else if (isNewArrival(product.publishedAt)) {
    cardLabel = 'New';
  }

  const styles = clsx('grid gap-6', className);

  return (
    <Link onClick={onClick} to={`/products/${product.handle}`}>
      <div className={styles}>
        <div className='aspect-[4/5] card-image bg-primary/5'>
          <Text
            as='label'
            size='fine'
            className='absolute top-0 right-0 m-4 text-right text-notice'
          >
            {cardLabel}
          </Text>
          {image && (
            <Image
              className='aspect-[4/5] object-cover w-full fadeIn'
              widths={[320]}
              sizes='320px'
              loaderOptions={{
                crop: 'center',
                scale: 2,
                width: 320,
                height: 400,
              }}
              // @ts-ignore Stock type has `src` as optional
              data={image}
              alt={image.altText || `Picture of ${product.title}`}
              loading={loading}
            />
          )}
        </div>
        <div className='grid gap-1'>
          <Text
            className='overflow-hidden w-full text-ellipsis whitespace-nowrap '
            as='h3'
          >
            {product.title}
          </Text>
          <div className='flex gap-4'>
            <Text className='flex gap-4'>
              <Money withoutTrailingZeros data={price!} />
              {isDiscounted(price as MoneyV2, compareAtPrice as MoneyV2) && (
                <CompareAtPrice
                  className={'opacity-50'}
                  data={compareAtPrice as MoneyV2}
                />
              )}
            </Text>
          </div>
        </div>
      </div>
    </Link>
  );
};
