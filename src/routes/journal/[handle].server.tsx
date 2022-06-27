import {
  useLocalization,
  useShopQuery,
  Seo,
  gql,
  Image,
  CacheLong,
  type HydrogenRouteProps,
} from '@shopify/hydrogen';
import { FC, Suspense } from 'react';
import { CustomFont, PageHeader, Section } from '~/components';
import { Layout } from '~/components/index.server';
import { ATTR_LOADING_EAGER } from '~/lib/const';
import type { Blog } from '@shopify/hydrogen/storefront-api-types';

const BLOG_HANDLE = 'journal';

const ARTICLE_QUERY = gql`
  query ArticleDetails(
    $language: LanguageCode
    $blogHandle: String!
    $articleHandle: String!
  ) @inContext(language: $language) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) {
        title
        contentHtml
        publishedAt
        author: authorV2 {
          name
        }
        image {
          id
          altText
          url
          width
          height
        }
      }
    }
  }
`;

const Post: FC<HydrogenRouteProps> = ({ params, response }) => {
  response.cache(CacheLong());
  const {
    language: { isoCode: languageCode },
    country: { isoCode: countryCode },
  } = useLocalization();

  const { handle } = params;
  const { data } = useShopQuery<{
    blog: Blog;
  }>({
    query: ARTICLE_QUERY,
    variables: {
      language: languageCode,
      blogHandle: BLOG_HANDLE,
      articleHandle: handle,
    },
  });

  if (!data?.blog?.articleByHandle) return <div>Article not found</div>;

  const { title, publishedAt, contentHtml, author } = data.blog.articleByHandle;
  const formattedDate = new Intl.DateTimeFormat(
    `${languageCode}-${countryCode}`,
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  ).format(new Date(publishedAt));

  return (
    <Layout>
      {/* Loads Fraunces custom font only on articles */}
      {/* @ts-ignore */}
      <CustomFont />
      <Suspense>
        {/* @ts-expect-error Blog article types are not supported in TS */}
        <Seo type='page' data={data.blog.articleByHandle} />
      </Suspense>
      <PageHeader heading={title} variant='blogPost'>
        <span>
          {formattedDate} &middot; {author.name}
        </span>
      </PageHeader>
      <Section as='article' padding='x'>
        {data.blog.articleByHandle.image && (
          <Image
            data={data.blog.articleByHandle.image}
            className='mx-auto mt-8 w-full max-w-7xl md:mt-16'
            sizes='90vw'
            widths={[400, 800, 1200]}
            width='100px'
            loading={ATTR_LOADING_EAGER}
            loaderOptions={{
              scale: 2,
              crop: 'center',
            }}
          />
        )}
        <div
          dangerouslySetInnerHTML={{ __html: contentHtml }}
          className='article'
        />
      </Section>
    </Layout>
  );
};

export default Post;
