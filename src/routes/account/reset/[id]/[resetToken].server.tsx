import { useRouteParams, Seo } from '@shopify/hydrogen';
import { Suspense } from 'react';
import { AccountPasswordResetForm } from '~/components';
import { Layout } from '~/components/index.server';

/**
 * This page shows a form for the user to enter a new password.
 * It should only be accessed by a link emailed to the user after
 * they initiate a password reset from `/account/recover`.
 */
const ResetPassword = () => {
  const { id, resetToken } = useRouteParams();

  return (
    <Layout>
      <Suspense>
        <Seo type='noindex' data={{ title: 'Reset password' }} />
      </Suspense>
      <AccountPasswordResetForm
        id={id as string}
        resetToken={resetToken as string}
      />
    </Layout>
  );
};

export default ResetPassword;
