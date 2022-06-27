import { useServerProps } from '@shopify/hydrogen';
import { ReactNode, useCallback } from 'react';
// @ts-ignore
import typographicBase from 'typographic-base';
import type {
  Menu,
  MenuItem,
  MoneyV2,
  UserError,
} from '@shopify/hydrogen/storefront-api-types';

export type EnhancedMenuItem = {
  to: string;
  target: string;
  isExternal?: boolean;
  items: EnhancedMenuItem[];
} & MenuItem;

export type EnhancedMenu = {
  items: EnhancedMenuItem[];
} & Menu;

/**
 * This is a hack until we have better built-in primitives for
 * causing server components to re-render.
 *
 * @returns function when called will cause the current page to re-render on the server
 */
export const useRenderServerComponents = () => {
  const { serverProps, setServerProps } = useServerProps();

  return useCallback(() => {
    setServerProps('renderRsc', !serverProps.renderRsc);
  }, [serverProps, setServerProps]);
};

export const missingClass = (string?: string, prefix?: string) => {
  if (!string) return true;

  const regex = new RegExp(` ?${prefix}`, 'g');
  return string.match(regex) === null;
};

export const formatText = (input?: string | ReactNode) => {
  if (!input) return;

  if (typeof input !== 'string') return input;

  return typographicBase(input, { locale: 'en-us' }).replace(
    /\s([^\s<]+)\s*$/g,
    '\u00A0$1',
  );
};

export const isNewArrival = (date: string, daysOld = 30) => {
  return (
    new Date(date).valueOf() >
    new Date().setDate(new Date().getDate() - daysOld).valueOf()
  );
};

export const isDiscounted = (price: MoneyV2, compareAtPrice: MoneyV2) =>
  compareAtPrice?.amount > price?.amount;

export const getExcerpt = (text: string) => {
  const regex = /<p.*>(.*?)<\/p>/;
  const match = regex.exec(text);
  return match?.length ? match[0] : text;
};

const resolveToFromType = (
  {
    customPrefixes,
    pathname,
    type,
  }: {
    customPrefixes: Record<string, string>;
    pathname?: string;
    type?: string;
  } = {
    customPrefixes: {},
  },
) => {
  if (!pathname || !type) return '';

  const defaultPrefixes = {
    BLOG: 'blogs',
    COLLECTION: 'collections',
    COLLECTIONS: 'collections', // Collections All (not documented)
    FRONTPAGE: 'frontpage',
    HTTP: '',
    PAGE: 'pages',
    CATALOG: 'collections/all', // Products All
    PRODUCT: 'products',
    SEARCH: 'search',
    SHOP_POLICY: 'policies',
  };

  const pathParts = pathname.split('/');
  const handle = pathParts.pop() || '';
  const routePrefix: Record<string, string> = {
    ...defaultPrefixes,
    ...customPrefixes,
  };

  switch (true) {
    // special cases
    case type === 'FRONTPAGE':
      return '/';

    case type === 'ARTICLE': {
      const blogHandle = pathParts.pop();
      return routePrefix.BLOG
        ? `/${routePrefix.BLOG}/${blogHandle}/${handle}/`
        : `/${blogHandle}/${handle}/`;
    }

    case type === 'COLLECTIONS':
      return `/${routePrefix.COLLECTIONS}`;

    case type === 'SEARCH':
      return `/${routePrefix.SEARCH}`;

    case type === 'CATALOG':
      return `/${routePrefix.CATALOG}`;

    // common cases: BLOG, PAGE, COLLECTION, PRODUCT, SHOP_POLICY, HTTP
    default:
      return routePrefix[type]
        ? `/${routePrefix[type]}/${handle}`
        : `/${handle}`;
  }
};

/**
 * Parse each menu link and adding, isExternal, to and target
 */
const parseItem = (customPrefixes = {}) => {
  return (item: MenuItem): EnhancedMenuItem => {
    if (!item?.url || !item?.type) {
      // eslint-disable-next-line no-console
      console.warn('Invalid menu item.  Must include a url and type.');
      // @ts-ignore
      return;
    }

    // extract path from url because we don't need the origin on internal to attributes
    const { pathname } = new URL(item.url);

    /**
     * Currently the MenuAPI only returns online store urls e.g — xyz.myshopify.com/..
     *       Note: update logic when API is updated to include the active qualified domain
     */
    const isInternalLink = /\.myshopify\.com/g.test(item.url);

    const parsedItem = isInternalLink
      ? // internal links
        {
          ...item,
          isExternal: false,
          target: '_self',
          to: resolveToFromType({ type: item.type, customPrefixes, pathname }),
        }
      : // external links
        {
          ...item,
          isExternal: true,
          target: '_blank',
          to: item.url,
        };

    return {
      ...parsedItem,
      items: item.items?.map(parseItem(customPrefixes)),
    };
  };
};

/**
 * Recursively adds `to` and `target` attributes to links based on their url
 *   and resource type.
 *   It optionally overwrites url paths based on item.type
 */
export const parseMenu = (menu: Menu, customPrefixes = {}): EnhancedMenu => {
  if (!menu?.items) {
    // eslint-disable-next-line no-console
    console.warn('Invalid menu passed to parseMenu');
    // @ts-ignore
    return menu;
  }

  return {
    ...menu,
    items: menu.items.map(parseItem(customPrefixes)),
  };
};

export const getApiErrorMessage = (
  field: string,
  data: Record<string, any>,
  errors: UserError[],
) => {
  if (errors?.length) return errors[0]?.message ?? errors[0];
  if (data?.[field]?.customerUserErrors?.length)
    return data[field].customerUserErrors[0].message;
  return null;
};

export const statusMessage = (status: string) => {
  const translations: Record<string, string> = {
    ATTEMPTED_DELIVERY: 'Attempted delivery',
    CANCELED: 'Canceled',
    CONFIRMED: 'Confirmed',
    DELIVERED: 'Delivered',
    FAILURE: 'Failure',
    FULFILLED: 'Fulfilled',
    IN_PROGRESS: 'In Progress',
    IN_TRANSIT: 'In transit',
    LABEL_PRINTED: 'Label printed',
    LABEL_PURCHASED: 'Label purchased',
    LABEL_VOIDED: 'Label voided',
    MARKED_AS_FULFILLED: 'Marked as fulfilled',
    NOT_DELIVERED: 'Not delivered',
    ON_HOLD: 'On Hold',
    OPEN: 'Open',
    OUT_FOR_DELIVERY: 'Out for delivery',
    PARTIALLY_FULFILLED: 'Partially Fulfilled',
    PENDING_FULFILLMENT: 'Pending',
    PICKED_UP: 'Displayed as Picked up',
    READY_FOR_PICKUP: 'Ready for pickup',
    RESTOCKED: 'Restocked',
    SCHEDULED: 'Scheduled',
    SUBMITTED: 'Submitted',
    UNFULFILLED: 'Unfulfilled',
  };
  try {
    return translations?.[status];
  } catch (error) {
    return status;
  }
};

export const emailValidation = (email: HTMLInputElement) => {
  if (email.validity.valid) return null;

  return email.validity.valueMissing
    ? 'Please enter an email'
    : 'Please enter a valid email';
};

export const passwordValidation = (password: HTMLInputElement) => {
  if (password.validity.valid) return null;
  if (password.validity.valueMissing) return 'Please enter a password';

  return 'Password must be at least 6 characters';
};
