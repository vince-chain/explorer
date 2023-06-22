import { Show, Hide } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { AddressTokensResponse } from 'types/api/address';

import useIsMobile from 'lib/hooks/useIsMobile';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/Pagination';
import type { Props as PaginationProps } from 'ui/shared/Pagination';

import ERC721TokensListItem from './ERC721TokensListItem';
import ERC721TokensTable from './ERC721TokensTable';

type Props = {
  tokensQuery: UseQueryResult<AddressTokensResponse> & {
    pagination: PaginationProps;
    isPaginationVisible: boolean;
  };
}

const ERC721Tokens = ({ tokensQuery }: Props) => {
  const isMobile = useIsMobile();

  const { isError, isPlaceholderData, data, pagination, isPaginationVisible } = tokensQuery;

  const actionBar = isMobile && isPaginationVisible && (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  );

  const content = data?.items ? (
    <>
      <Hide below="lg" ssr={ false }><ERC721TokensTable data={ data.items } isLoading={ isPlaceholderData } top={ isPaginationVisible ? 72 : 0 }/></Hide>
      <Show below="lg" ssr={ false }>{ data.items.map((item, index) => (
        <ERC721TokensListItem
          key={ item.token.address + (isPlaceholderData ? index : '') }
          { ...item }
          isLoading={ isPlaceholderData }
        />
      )) }</Show></>
  ) : null;

  return (
    <DataListDisplay
      isError={ isError }
      items={ data?.items }
      emptyText="There are no tokens of selected type."
      content={ content }
      actionBar={ actionBar }
    />
  );

};

export default ERC721Tokens;
