import { Image, Link } from '@shopify/hydrogen';
import type { Article } from '@shopify/hydrogen/storefront-api-types';
import type { FC } from 'react';

type ArticleCardProps = {
  blogHandle: string;
  article: Article;
  loading?: HTMLImageElement['loading'];
};

export const ArticleCard: FC<ArticleCardProps> = ({
  blogHandle,
  article,
  loading,
}) => {
  return (
    <li key={article.id}>
      <Link to={`/${blogHandle}/${article.handle}`}>
        {article.image && (
          <div className='aspect-[3/2] card-image'>
            <Image
              alt={article.image.altText || article.title}
              className='object-cover w-full'
              data={article.image}
              height={400}
              loading={loading}
              sizes='(min-width: 768px) 50vw, 100vw'
              width={600}
              loaderOptions={{
                scale: 2,
                crop: 'center',
              }}
            />
          </div>
        )}
        <h2 className='mt-4 font-medium'>{article.title}</h2>
        <span className='block mt-1'>{article.publishedAt}</span>
      </Link>
    </li>
  );
};
