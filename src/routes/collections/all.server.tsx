import type { HydrogenRouteProps } from '@shopify/hydrogen';

const Redirect = ({ response }: HydrogenRouteProps) =>
  response.redirect('/products');

export default Redirect;
