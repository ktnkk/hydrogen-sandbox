import { Heading, Input, PageHeader } from '~/components';
import { Layout } from '~/components/index.server';
import type { FC, ReactNode } from 'react';

type SearchPageProps = {
  searchTerm?: string | null;
  children: ReactNode;
};

export const SearchPage: FC<SearchPageProps> = ({ searchTerm, children }) => {
  return (
    <Layout>
      <PageHeader>
        <Heading as='h1' size='copy'>
          Search
        </Heading>
        <form className='flex relative w-full text-heading'>
          <Input
            defaultValue={searchTerm}
            placeholder='Search…'
            type='search'
            variant='search'
            name='q'
          />
          <button className='absolute right-0 py-2' type='submit'>
            Go
          </button>
        </form>
      </PageHeader>
      {children}
    </Layout>
  );
};
