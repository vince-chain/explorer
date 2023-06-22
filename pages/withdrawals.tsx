import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import Page from 'ui/shared/Page/Page';

const Withdrawals = dynamic(() => import('ui/pages/Withdrawals'), { ssr: false });

const WithdrawalsPage: NextPage = () => {
  const title = getNetworkTitle();
  return (
    <>
      <Head>
        <title>{ title }</title>
      </Head>
      <Page>
        <Withdrawals/>
      </Page>
    </>
  );
};

export default WithdrawalsPage;

export { getServerSideProps } from 'lib/next/getServerSidePropsBeacon';
