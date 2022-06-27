import clsx from 'clsx';
import { missingClass, formatText } from '~/lib/utils';
import type { ElementType, FC, HTMLAttributes, ReactNode } from 'react';

type HeadingProps = {
  as?: ElementType;
  children: ReactNode;
  format?: boolean;
  size?: 'display' | 'heading' | 'lead' | 'copy';
  width?: 'default' | 'narrow' | 'wide';
} & HTMLAttributes<HTMLHeadingElement>;

export const Heading: FC<HeadingProps> = ({
  as: Component = 'h2',
  children,
  className = '',
  format,
  size = 'heading',
  width = 'default',
  ...props
}) => {
  const sizes = {
    display: 'font-bold text-display',
    heading: 'font-bold text-heading',
    lead: 'font-bold text-lead',
    copy: 'font-medium text-copy',
  };

  const widths = {
    default: 'max-w-prose',
    narrow: 'max-w-prose-narrow',
    wide: 'max-w-prose-wide',
  };

  const styles = clsx(
    missingClass(className, 'whitespace-') && 'whitespace-pre-wrap',
    missingClass(className, 'max-w-') && widths[width],
    missingClass(className, 'font-') && sizes[size],
    className,
  );

  return (
    <Component {...props} className={styles}>
      {format ? formatText(children) : children}
    </Component>
  );
};
