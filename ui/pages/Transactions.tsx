import { useRouter } from 'next/router';
import React from 'react';

import type { RoutedTab } from 'ui/shared/Tabs/types';

import appConfig from 'configs/app/config';
import useHasAccount from 'lib/hooks/useHasAccount';
import useIsMobile from 'lib/hooks/useIsMobile';
import useNewTxsSocket from 'lib/hooks/useNewTxsSocket';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import { TX } from 'stubs/tx';
import { generateListStub } from 'stubs/utils';
import PageTitle from 'ui/shared/Page/PageTitle';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';
import TxsContent from 'ui/txs/TxsContent';
import TxsTabSlot from 'ui/txs/TxsTabSlot';
import TxsWatchlist from 'ui/txs/TxsWatchlist';

const TAB_LIST_PROPS = {
  marginBottom: 0,
  py: 5,
  marginTop: -5,
};

const Transactions = () => {
  const verifiedTitle = appConfig.network.verificationType === 'validation' ? 'Validated' : 'Mined';
  const router = useRouter();
  const isMobile = useIsMobile();
  const txsQuery = useQueryWithPages({
    resourceName: router.query.tab === 'pending' ? 'txs_pending' : 'txs_validated',
    filters: { filter: router.query.tab === 'pending' ? 'pending' : 'validated' },
    options: {
      enabled: !router.query.tab || router.query.tab === 'validated' || router.query.tab === 'pending',
      placeholderData: generateListStub<'txs_validated'>(TX, 50, { next_page_params: {
        block_number: 9005713,
        index: 5,
        items_count: 50,
        filter: 'validated',
      } }),
    },
  });

  const txsWatchlistQuery = useQueryWithPages({
    resourceName: 'txs_watchlist',
    options: {
      enabled: router.query.tab === 'watchlist',
      placeholderData: generateListStub<'txs_watchlist'>(TX, 50, { next_page_params: {
        block_number: 9005713,
        index: 5,
        items_count: 50,
      } }),
    },
  });

  const { num, socketAlert } = useNewTxsSocket();

  const hasAccount = useHasAccount();

  const tabs: Array<RoutedTab> = [
    {
      id: 'validated',
      title: verifiedTitle,
      component: <TxsContent query={ txsQuery } showSocketInfo={ txsQuery.pagination.page === 1 } socketInfoNum={ num } socketInfoAlert={ socketAlert }/> },
    {
      id: 'pending',
      title: 'Pending',
      component: (
        <TxsContent
          query={ txsQuery }
          showBlockInfo={ false }
          showSocketInfo={ txsQuery.pagination.page === 1 }
          socketInfoNum={ num }
          socketInfoAlert={ socketAlert }
        />
      ),
    },
    hasAccount ? {
      id: 'watchlist',
      title: 'Watch list',
      component: <TxsWatchlist query={ txsWatchlistQuery }/>,
    } : undefined,
  ].filter(Boolean);

  return (
    <>
      <PageTitle title="Transactions" withTextAd/>
      <RoutedTabs
        tabs={ tabs }
        tabListProps={ isMobile ? undefined : TAB_LIST_PROPS }
        rightSlot={ (
          <TxsTabSlot
            pagination={ router.query.tab === 'watchlist' ? txsWatchlistQuery.pagination : txsQuery.pagination }
            isPaginationVisible={ txsQuery.isPaginationVisible && !isMobile }
          />
        ) }
        stickyEnabled={ !isMobile }
      />
    </>
  );
};

export default Transactions;
