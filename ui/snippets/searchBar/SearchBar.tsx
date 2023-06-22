import { Popover, PopoverTrigger, PopoverContent, PopoverBody, useDisclosure } from '@chakra-ui/react';
import _debounce from 'lodash/debounce';
import { useRouter } from 'next/router';
import { route } from 'nextjs-routes';
import type { FormEvent, FocusEvent } from 'react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import * as mixpanel from 'lib/mixpanel/index';

import SearchBarInput from './SearchBarInput';
import SearchBarSuggest from './SearchBarSuggest';
import useSearchQuery from './useSearchQuery';

type Props = {
  isHomepage?: boolean;
}

const SearchBar = ({ isHomepage }: Props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const inputRef = React.useRef<HTMLFormElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const menuWidth = React.useRef<number>(0);
  const isMobile = useIsMobile();
  const router = useRouter();

  const { searchTerm, handleSearchTermChange, query, pathname, redirectCheckQuery } = useSearchQuery();

  const handleSubmit = React.useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm) {
      const url = route({ pathname: '/search-results', query: { q: searchTerm } });
      mixpanel.logEvent(mixpanel.EventTypes.SEARCH_QUERY, {
        'Search query': searchTerm,
        'Source page type': mixpanel.getPageType(pathname),
        'Result URL': url,
      });
      router.push({ pathname: '/search-results', query: { q: searchTerm } }, undefined, { shallow: true });
    }
  }, [ searchTerm, pathname, router ]);

  const handleFocus = React.useCallback(() => {
    onOpen();
  }, [ onOpen ]);

  const handelHide = React.useCallback(() => {
    onClose();
    inputRef.current?.querySelector('input')?.blur();
  }, [ onClose ]);

  const handleBlur = React.useCallback((event: FocusEvent<HTMLFormElement>) => {
    const isFocusInMenu = menuRef.current?.contains(event.relatedTarget);
    const isFocusInInput = inputRef.current?.contains(event.relatedTarget);
    if (!isFocusInMenu && !isFocusInInput) {
      onClose();
    }
  }, [ onClose ]);

  const handleClear = React.useCallback(() => {
    handleSearchTermChange('');
    inputRef.current?.querySelector('input')?.focus();
  }, [ handleSearchTermChange ]);

  const handleItemClick = React.useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    mixpanel.logEvent(mixpanel.EventTypes.SEARCH_QUERY, {
      'Search query': searchTerm,
      'Source page type': mixpanel.getPageType(pathname),
      'Result URL': event.currentTarget.href,
    });
    onClose();
  }, [ pathname, searchTerm, onClose ]);

  const menuPaddingX = isMobile && !isHomepage ? 32 : 0;
  const calculateMenuWidth = React.useCallback(() => {
    menuWidth.current = (inputRef.current?.getBoundingClientRect().width || 0) - menuPaddingX;
  }, [ menuPaddingX ]);

  React.useEffect(() => {
    const inputEl = inputRef.current;
    if (!inputEl) {
      return;
    }
    calculateMenuWidth();

    const resizeHandler = _debounce(calculateMenuWidth, 200);
    const resizeObserver = new ResizeObserver(resizeHandler);
    resizeObserver.observe(inputRef.current);

    return function cleanup() {
      resizeObserver.unobserve(inputEl);
    };
  }, [ calculateMenuWidth ]);

  return (
    <Popover
      isOpen={ isOpen && searchTerm.trim().length > 0 }
      autoFocus={ false }
      onClose={ onClose }
      placement="bottom-start"
      offset={ isMobile && !isHomepage ? [ 16, -12 ] : undefined }
      isLazy
    >
      <PopoverTrigger>
        <SearchBarInput
          ref={ inputRef }
          onChange={ handleSearchTermChange }
          onSubmit={ handleSubmit }
          onFocus={ handleFocus }
          onBlur={ handleBlur }
          onHide={ handelHide }
          onClear={ handleClear }
          isHomepage={ isHomepage }
          value={ searchTerm }
        />
      </PopoverTrigger>
      <PopoverContent w={ `${ menuWidth.current }px` } maxH={{ base: '300px', lg: '500px' }} overflowY="scroll" ref={ menuRef }>
        <PopoverBody py={ 6 } sx={ isHomepage ? { mark: { bgColor: 'green.100' } } : {} }>
          <SearchBarSuggest query={ query } redirectCheckQuery={ redirectCheckQuery } searchTerm={ searchTerm } onItemClick={ handleItemClick }/>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default SearchBar;
