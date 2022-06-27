import clsx from 'clsx';
import type { ElementType, FC } from 'react';

type SkeletonProps = {
  as: ElementType;
  width: string;
  height: string;
  className: string;
  [key: string]: any;
};

export const Skeleton: FC<Partial<SkeletonProps>> = ({
  as: Component = 'div',
  width,
  height,
  className,
  ...props
}) => {
  const styles = clsx('rounded bg-primary/10', className);

  return (
    <Component {...props} width={width} height={height} className={styles} />
  );
};
