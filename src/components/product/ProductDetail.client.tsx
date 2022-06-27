// @ts-expect-error @headlessui/react incompatibility with node16 resolution
import { Disclosure } from '@headlessui/react';
import { Link } from '@shopify/hydrogen';
import { Text, IconClose } from '~/components';
import type { FC } from 'react';

type ProductDetailProps = {
  title: string;
  content: string;
  learnMore?: string;
};

export const ProductDetail: FC<ProductDetailProps> = ({
  title,
  content,
  learnMore,
}) => {
  return (
    <Disclosure key={title} as='div' className='grid gap-2 w-full'>
      {/* @ts-expect-error @headlessui/react incompatibility with node16 resolution */}
      {({ open }) => (
        <>
          <Disclosure.Button className='text-left'>
            <div className='flex justify-between'>
              <Text size='lead' as='h4'>
                {title}
              </Text>
              <IconClose
                className={`${
                  open ? '' : 'rotate-[45deg]'
                } transition-transform transform-gpu duration-200`}
              />
            </div>
          </Disclosure.Button>

          <Disclosure.Panel className={'grid gap-2 pt-2 pb-4'}>
            <div
              className='prose dark:prose-invert'
              dangerouslySetInnerHTML={{ __html: content }}
            />
            {learnMore && (
              <div className=''>
                <Link
                  className='pb-px border-b border-primary/30 text-primary/50'
                  to={learnMore}
                >
                  Learn more
                </Link>
              </div>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
