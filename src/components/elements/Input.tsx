import clsx from 'clsx';
import type { FC } from 'react';

type IndexType = {
  className?: string;
  type?: string;
  variant: 'search' | 'minisearch';
  [key: string]: any;
};

export const Input: FC<IndexType> = ({
  className = '',
  type,
  variant,
  ...props
}) => {
  const variants = {
    search:
      'py-2 px-0 w-full text-heading bg-transparent border-x-0 border-t-0 border-b-2 focus:ring-0 transition border-primary/10 focus:border-primary/90',
    minisearch:
      'hidden py-1 px-0 -mb-px text-left placeholder:text-inherit bg-transparent border-x-0 border-t-0 border-b border-transparent focus:ring-transparent placeholder:opacity-20 transition appearance-none md:inline-block lg:text-right',
  };

  const styles = clsx(variants[variant], className);

  return <input type={type} {...props} className={styles} />;
};
