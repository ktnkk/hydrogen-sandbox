import { Image, Link, Video } from '@shopify/hydrogen';
import { Heading, Text } from '~/components';
import type { Media } from '@shopify/hydrogen/storefront-api-types';
import type { FC } from 'react';

type Metafield = {
  value: string;
  reference?: object;
};

type HeroProps = {
  byline: Metafield;
  cta: Metafield;
  handle: string;
  heading: Metafield;
  height?: 'full';
  loading?: 'eager' | 'lazy';
  spread: Metafield;
  spreadSecondary: Metafield;
  top?: boolean;
};

type SpreadMediaProps = {
  data: Media;
  loading?: HTMLImageElement['loading'];
  scale?: 2 | 3;
  sizes: string;
  width: number;
  widths: number[];
};

const SpreadMedia: FC<SpreadMediaProps> = ({
  data,
  loading,
  scale,
  sizes,
  width,
  widths,
}) => {
  if (data.mediaContentType === 'VIDEO') {
    return (
      <Video
        previewImageOptions={{ scale, src: data.previewImage!.url }}
        width={scale! * width}
        className='block object-cover w-full h-full'
        data={data}
        controls={false}
        muted
        loop
        playsInline
        autoPlay
      />
    );
  }

  if (data.mediaContentType === 'IMAGE') {
    return (
      <Image
        widths={widths}
        sizes={sizes}
        alt={data.alt || 'Marketing Banner Image'}
        className='block object-cover w-full h-full'
        // @ts-ignore
        data={data.image}
        loading={loading}
        width={width}
        loaderOptions={{ scale, crop: 'center' }}
      />
    );
  }

  return null;
};

export const Hero: FC<HeroProps> = ({
  byline,
  cta,
  handle,
  heading,
  height,
  loading,
  spread,
  spreadSecondary,
  top,
}) => {
  return (
    <Link to={`/collections/${handle}`}>
      <section
        className={`relative justify-end flex flex-col w-full ${
          top && '-mt-nav'
        } ${
          height === 'full'
            ? 'h-screen'
            : 'aspect-[4/5] sm:aspect-square md:aspect-[5/4] lg:aspect-[3/2] xl:aspect-[2/1]'
        }`}
      >
        <div className='grid absolute inset-0 -z-10 grow grid-flow-col auto-cols-fr text-clip pointer-events-none content-stretch'>
          {spread?.reference && (
            <div className=''>
              <SpreadMedia
                scale={2}
                sizes={
                  spreadSecondary?.reference
                    ? '(min-width: 80em) 700px, (min-width: 48em) 450px, 500px'
                    : '(min-width: 80em) 1400px, (min-width: 48em) 900px, 500px'
                }
                widths={
                  spreadSecondary?.reference
                    ? [500, 450, 700]
                    : [500, 900, 1400]
                }
                width={spreadSecondary?.reference ? 375 : 750}
                data={spread.reference as Media}
                loading={loading}
              />
            </div>
          )}
          {spreadSecondary?.reference && (
            <div className='hidden md:block'>
              <SpreadMedia
                sizes='(min-width: 80em) 700, (min-width: 48em) 450, 500'
                widths={[450, 700]}
                width={375}
                data={spreadSecondary.reference as Media}
              />
            </div>
          )}
        </div>
        <div className='flex flex-col gap-4 justify-between items-baseline py-8 px-6 bg-gradient-to-t sm:px-8 md:px-12 dark:from-contrast/60 dark:text-primary from-primary/60 text-contrast'>
          {heading?.value && (
            <Heading format as='h2' size='display' className='max-w-md'>
              {heading.value}
            </Heading>
          )}
          {byline?.value && (
            <Text format width='narrow' as='p' size='lead'>
              {byline.value}
            </Text>
          )}
          {cta?.value && <Text size='lead'>{cta.value}</Text>}
        </div>
      </section>
    </Link>
  );
};
