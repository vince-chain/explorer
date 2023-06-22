import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';

import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';

const Marketplace = dynamic(() => import('ui/pages/Marketplace'), { ssr: false });

const MarketplacePage: NextPage = () => {
  return (
    <Page>
      <PageTitle title="Marketplace"/>
      <Head><title>Blockscout | Marketplace</title></Head>

      <Marketplace/>
    </Page>
  );
};

export default MarketplacePage;

export { getServerSideProps } from 'lib/next/getServerSideProps';
