import {
  useCart,
  useCartLine,
  CartLineQuantityAdjustButton,
  CartLinePrice,
  CartLineQuantity,
  Image,
  Link,
} from '@shopify/hydrogen';
import { Heading, IconRemove, Text } from '~/components';
import type { Image as ImageType } from '@shopify/hydrogen/storefront-api-types';
import type { FC } from 'react';

type CartLineQuantityAdjustProps = {
  lineId: string;
  quantity: number;
};

const CartLineQuantityAdjust: FC<CartLineQuantityAdjustProps> = ({
  lineId,
  quantity,
}) => {
  return (
    <>
      <label htmlFor={`quantity-${lineId}`} className='sr-only'>
        Quantity, {quantity}
      </label>
      <div className='flex items-center rounded border'>
        <CartLineQuantityAdjustButton
          adjust='decrease'
          aria-label='Decrease quantity'
          className='w-10 h-10 transition disabled:cursor-wait text-primary/50 hover:text-primary'
        >
          &#8722;
        </CartLineQuantityAdjustButton>
        <CartLineQuantity as='div' className='px-2 text-center' />
        <CartLineQuantityAdjustButton
          adjust='increase'
          aria-label='Increase quantity'
          className='w-10 h-10 transition disabled:cursor-wait text-primary/50 hover:text-primary'
        >
          &#43;
        </CartLineQuantityAdjustButton>
      </div>
    </>
  );
};

export const CartLineItem = () => {
  const { linesRemove } = useCart();
  const { id: lineId, quantity, merchandise } = useCartLine();

  return (
    <li key={lineId} className='flex gap-4'>
      <div className='shrink'>
        <Image
          width={112}
          height={112}
          widths={[112]}
          data={merchandise.image as ImageType}
          loaderOptions={{
            scale: 2,
            crop: 'center',
          }}
          className='object-cover object-center w-24 h-24 rounded border md:w-28 md:h-28'
        />
      </div>

      <div className='flex grow justify-between'>
        <div className='grid gap-2'>
          <Heading as='h3' size='copy'>
            <Link to={`/products/${merchandise.product.handle}`}>
              {merchandise.product.title}
            </Link>
          </Heading>

          <div className='grid pb-2'>
            {(merchandise?.selectedOptions || []).map((option) => (
              <Text color='subtle' key={option.name}>
                {option.name}: {option.value}
              </Text>
            ))}
          </div>

          <div className='flex gap-2 items-center'>
            <div className='flex justify-start text-copy'>
              <CartLineQuantityAdjust lineId={lineId} quantity={quantity} />
            </div>
            <button
              type='button'
              onClick={() => linesRemove([lineId])}
              className='flex justify-center items-center w-10 h-10 rounded border'
            >
              <span className='sr-only'>Remove</span>
              <IconRemove aria-hidden='true' />
            </button>
          </div>
        </div>
        <Text>
          <CartLinePrice as='span' />
        </Text>
      </div>
    </li>
  );
};
