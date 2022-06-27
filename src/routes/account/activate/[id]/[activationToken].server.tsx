import { useRouteParams, Seo } from '@shopify/hydrogen';
import { Suspense } from 'react';
import { AccountActivateForm } from '~/components';
import { Layout } from '~/components/index.server';

/**
 * This page shows a form for the user to activate an account.
 * It should only be accessed by a link emailed to the user.
 */
const ActivateAccount = () => {
  const { id, activationToken } = useRouteParams();

  return (
    <Layout>
      <Suspense>
        <Seo type='noindex' data={{ title: 'Activate account' }} />
      </Suspense>
      <AccountActivateForm
        id={id as string}
        activationToken={activationToken as string}
      />
    </Layout>
  );
};

export default ActivateAccount;
