import { Button, Text, OrderCard } from '~/components';
import type { Order } from '@shopify/hydrogen/storefront-api-types';
import type { FC } from 'react';

const EmptyOrders = () => {
  return (
    <div>
      <Text className='mb-1' size='fine' width='narrow' as='p'>
        You haven&apos;t placed any orders yet.
      </Text>
      <div className='w-48'>
        <Button className='mt-2 w-full text-sm' variant='secondary' to={'/'}>
          Start Shopping
        </Button>
      </div>
    </div>
  );
};

const Orders: FC<{ orders: Order[] }> = ({ orders }) => {
  return (
    <ul className='grid grid-cols-1 grid-flow-row gap-2 gap-y-6 sm:grid-cols-3 md:gap-4 lg:gap-6  false'>
      {orders.map((order) => (
        <OrderCard order={order} key={order.id} />
      ))}
    </ul>
  );
};

export const AccountOrderHistory: FC<{ orders: Order[] }> = ({ orders }) => {
  return (
    <div className='mt-6'>
      <div className='grid gap-4 p-4 py-6 w-full md:gap-8 md:p-8 lg:p-12'>
        <h2 className='text-lead font-bold'>Order History</h2>
        {orders?.length ? <Orders orders={orders} /> : <EmptyOrders />}
      </div>
    </div>
  );
};
