import {
  CacheNone,
  Seo,
  gql,
  type HydrogenRequest,
  type HydrogenApiRouteOptions,
  type HydrogenRouteProps,
} from '@shopify/hydrogen';
import { FC, Suspense } from 'react';
import { AccountCreateForm } from '~/components';
import { Layout } from '~/components/index.server';
import { getApiErrorMessage } from '~/lib/utils';

const CUSTOMER_CREATE_MUTATION = gql`
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const Register: FC<HydrogenRouteProps> = ({ response }) => {
  response.cache(CacheNone());

  return (
    <Layout>
      <Suspense>
        <Seo type='noindex' data={{ title: 'Register' }} />
      </Suspense>
      <AccountCreateForm />
    </Layout>
  );
};

export const api = async (
  request: HydrogenRequest,
  { queryShop }: HydrogenApiRouteOptions,
) => {
  const jsonBody = await request.json();

  if (
    !jsonBody.email ||
    jsonBody.email === '' ||
    !jsonBody.password ||
    jsonBody.password === ''
  ) {
    return new Response(
      JSON.stringify({ error: 'Email and password are required' }),
      { status: 400 },
    );
  }

  const { data, errors } = await queryShop<{ customerCreate: any }>({
    query: CUSTOMER_CREATE_MUTATION,
    variables: {
      input: {
        email: jsonBody.email,
        password: jsonBody.password,
        firstName: jsonBody.firstName,
        lastName: jsonBody.lastName,
      },
    },
    // @ts-expect-error `queryShop.cache` is not yet supported but soon will be.
    cache: CacheNone(),
  });

  const errorMessage = getApiErrorMessage('customerCreate', data, errors);

  if (
    !errorMessage &&
    data &&
    data.customerCreate &&
    data.customerCreate.customer &&
    data.customerCreate.customer.id
  ) {
    return new Response(null, {
      status: 200,
    });
  } else {
    return new Response(
      JSON.stringify({
        error: errorMessage ?? 'Unknown error',
      }),
      { status: 401 },
    );
  }
};

export default Register;
