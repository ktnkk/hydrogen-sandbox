import { Seo } from '@shopify/hydrogen';
import { PageHeader, Section, CartDetails } from '~/components';
import { Layout } from '~/components/index.server';

const Cart = () => {
  return (
    <Layout>
      <Seo type='page' data={{ title: 'Cart' }} />
      <PageHeader heading='Your Cart' className='mx-auto max-w-7xl' />
      <Section className='mx-auto max-w-7xl'>
        <CartDetails layout='page' />
      </Section>
    </Layout>
  );
};

export default Cart;
