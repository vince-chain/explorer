import { useRouter } from 'next/router';
import React from 'react';

import type { NavItemInternal, NavItem, NavGroupItem } from 'types/client/navigation-items';

import appConfig from 'configs/app/config';
import abiIcon from 'icons/ABI.svg';
import apiKeysIcon from 'icons/API.svg';
import appsIcon from 'icons/apps.svg';
import withdrawalsIcon from 'icons/arrows/north-east.svg';
import depositsIcon from 'icons/arrows/south-east.svg';
import blocksIcon from 'icons/block.svg';
import gearIcon from 'icons/gear.svg';
import globeIcon from 'icons/globe-b.svg';
import graphQLIcon from 'icons/graphQL.svg';
import outputRootsIcon from 'icons/output_roots.svg';
import privateTagIcon from 'icons/privattags.svg';
import publicTagIcon from 'icons/publictags.svg';
import apiDocsIcon from 'icons/restAPI.svg';
import rpcIcon from 'icons/RPC.svg';
import statsIcon from 'icons/stats.svg';
import tokensIcon from 'icons/token.svg';
import topAccountsIcon from 'icons/top-accounts.svg';
import transactionsIcon from 'icons/transactions.svg';
import txnBatchIcon from 'icons/txn_batches.svg';
import verifiedIcon from 'icons/verified.svg';
import watchlistIcon from 'icons/watchlist.svg';
import { rightLineArrow } from 'lib/html-entities';
import UserAvatar from 'ui/shared/UserAvatar';

interface ReturnType {
  mainNavItems: Array<NavItem | NavGroupItem>;
  accountNavItems: Array<NavItem>;
  profileItem: NavItem;
}

export function isGroupItem(item: NavItem | NavGroupItem): item is NavGroupItem {
  return 'subItems' in item;
}

export function isInternalItem(item: NavItem): item is NavItemInternal {
  return 'nextRoute' in item;
}

export default function useNavItems(): ReturnType {
  const isMarketplaceAvailable = Boolean(appConfig.marketplaceConfigUrl && appConfig.network.rpcUrl);
  const hasAPIDocs = appConfig.apiDoc.specUrl;

  const router = useRouter();
  const pathname = router.pathname;

  return React.useMemo(() => {
    let blockchainNavItems: Array<NavItem> | Array<Array<NavItem>> = [];

    const topAccounts = {
      text: 'Top accounts',
      nextRoute: { pathname: '/accounts' as const },
      icon: topAccountsIcon,
      isActive: pathname === '/accounts',
    };
    const blocks = {
      text: 'Blocks',
      nextRoute: { pathname: '/blocks' as const },
      icon: blocksIcon,
      isActive: pathname === '/blocks' || pathname === '/block/[height_or_hash]',
    };
    const txs = {
      text: 'Transactions',
      nextRoute: { pathname: '/txs' as const },
      icon: transactionsIcon,
      isActive: pathname === '/txs' || pathname === '/tx/[hash]',
    };
    const verifiedContracts =
    // eslint-disable-next-line max-len
     { text: 'Verified contracts', nextRoute: { pathname: '/verified-contracts' as const }, icon: verifiedIcon, isActive: pathname === '/verified-contracts' };

    if (appConfig.L2.isL2Network) {
      blockchainNavItems = [
        [
          txs,
          // eslint-disable-next-line max-len
          { text: `Deposits (L1${ rightLineArrow }L2)`, nextRoute: { pathname: '/l2-deposits' as const }, icon: depositsIcon, isActive: pathname === '/l2-deposits' },
          // eslint-disable-next-line max-len
          { text: `Withdrawals (L2${ rightLineArrow }L1)`, nextRoute: { pathname: '/l2-withdrawals' as const }, icon: withdrawalsIcon, isActive: pathname === '/l2-withdrawals' },
        ],
        [
          blocks,
          // eslint-disable-next-line max-len
          { text: 'Txn batches', nextRoute: { pathname: '/l2-txn-batches' as const }, icon: txnBatchIcon, isActive: pathname === '/l2-txn-batches' },
          // eslint-disable-next-line max-len
          { text: 'Output roots', nextRoute: { pathname: '/l2-output-roots' as const }, icon: outputRootsIcon, isActive: pathname === '/l2-output-roots' },
        ],
        [
          topAccounts,
          verifiedContracts,
        ],
      ];
    } else {
      blockchainNavItems = [
        txs,
        blocks,
        topAccounts,
        verifiedContracts,
        appConfig.beaconChain.hasBeaconChain && {
          text: 'Withdrawals',
          nextRoute: { pathname: '/withdrawals' as const },
          icon: withdrawalsIcon,
          isActive: pathname === '/withdrawals',
        },
      ].filter(Boolean);
    }

    const apiNavItems: Array<NavItem> = [
      hasAPIDocs ? {
        text: 'REST API',
        nextRoute: { pathname: '/api-docs' as const },
        icon: apiDocsIcon,
        isActive: pathname === '/api-docs',
      } : null,
      {
        text: 'GraphQL',
        nextRoute: { pathname: '/graphiql' as const },
        icon: graphQLIcon,
        isActive: pathname === '/graphiql',
      },
      {
        text: 'RPC API',
        icon: rpcIcon,
        url: 'https://docs.blockscout.com/for-users/api/rpc-endpoints',
      },
      {
        text: 'Eth RPC API',
        icon: rpcIcon,
        url: ' https://docs.blockscout.com/for-users/api/eth-rpc',
      },
    ].filter(Boolean);

    const mainNavItems = [
      {
        text: 'Blockchain',
        icon: globeIcon,
        isActive: blockchainNavItems.flat().some(item => isInternalItem(item) && item.isActive),
        subItems: blockchainNavItems,
      },
      {
        text: 'Tokens',
        nextRoute: { pathname: '/tokens' as const },
        icon: tokensIcon,
        isActive: pathname.startsWith('/token'),
      },
      isMarketplaceAvailable ? {
        text: 'Apps',
        nextRoute: { pathname: '/apps' as const },
        icon: appsIcon,
        isActive: pathname.startsWith('/app'),
      } : null,
      appConfig.statsApi.endpoint ? {
        text: 'Charts & stats',
        nextRoute: { pathname: '/stats' as const },
        icon: statsIcon,
        isActive: pathname === '/stats',
      } : null,
      {
        text: 'API',
        icon: apiDocsIcon,
        isActive: apiNavItems.some(item => isInternalItem(item) && item.isActive),
        subItems: apiNavItems,
      },
      appConfig.otherLinks.length > 0 ? {
        text: 'Other',
        icon: gearIcon,
        subItems: appConfig.otherLinks,
      } : null,
    ].filter(Boolean) as Array<NavItem | NavGroupItem>;

    const accountNavItems = [
      {
        text: 'Watch list',
        nextRoute: { pathname: '/account/watchlist' as const },
        icon: watchlistIcon,
        isActive: pathname === '/account/watchlist',
      },
      {
        text: 'Private tags',
        nextRoute: { pathname: '/account/tag_address' as const },
        icon: privateTagIcon,
        isActive: pathname === '/account/tag_address',
      },
      {
        text: 'Public tags',
        nextRoute: { pathname: '/account/public_tags_request' as const },
        icon: publicTagIcon, isActive: pathname === '/account/public_tags_request',
      },
      {
        text: 'API keys',
        nextRoute: { pathname: '/account/api_key' as const },
        icon: apiKeysIcon, isActive: pathname === '/account/api_key',
      },
      {
        text: 'Custom ABI',
        nextRoute: { pathname: '/account/custom_abi' as const },
        icon: abiIcon,
        isActive: pathname === '/account/custom_abi',
      },
      appConfig.contractInfoApi.endpoint && appConfig.adminServiceApi.endpoint && {
        text: 'Verified addrs',
        nextRoute: { pathname: '/account/verified_addresses' as const },
        icon: verifiedIcon,
        isActive: pathname === '/account/verified_addresses',
      },
    ].filter(Boolean);

    const profileItem = {
      text: 'My profile',
      nextRoute: { pathname: '/auth/profile' as const },
      iconComponent: UserAvatar,
      isActive: pathname === '/auth/profile',
    };

    return { mainNavItems, accountNavItems, profileItem };
  }, [ hasAPIDocs, isMarketplaceAvailable, pathname ]);
}
