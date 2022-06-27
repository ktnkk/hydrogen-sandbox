import { Link, Image } from '@shopify/hydrogen';
import { Heading, Section, Grid } from '~/components';
import type { Collection } from '@shopify/hydrogen/storefront-api-types';
import type { FC } from 'react';

type FeaturedCollectionsProps = {
  data: Collection[];
  title?: string;
  [key: string]: any;
};

export const FeaturedCollections: FC<FeaturedCollectionsProps> = ({
  data,
  title = 'Collections',
  ...props
}) => {
  const items = data.filter((item) => item.image).length;
  const haveCollections = data.length > 0;

  if (!haveCollections) return null;

  return (
    <Section {...props} heading={title}>
      <Grid items={items}>
        {data.map((collection) => {
          if (!collection?.image) return null;

          // TODO: Refactor to use CollectionCard
          return (
            <Link key={collection.id} to={`/collections/${collection.handle}`}>
              <div className='grid gap-4'>
                <div className='aspect-[3/2] card-image bg-primary/5'>
                  {collection?.image && (
                    <Image
                      alt={`Image of ${collection.title}`}
                      data={collection.image}
                      height={400}
                      sizes='(max-width: 32em) 100vw, 33vw'
                      width={600}
                      widths={[400, 500, 600, 700, 800, 900]}
                      loaderOptions={{
                        scale: 2,
                        crop: 'center',
                      }}
                    />
                  )}
                </div>
                <Heading size='copy'>{collection.title}</Heading>
              </div>
            </Link>
          );
        })}
      </Grid>
    </Section>
  );
};
