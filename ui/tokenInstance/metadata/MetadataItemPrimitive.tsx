import { Box } from '@chakra-ui/react';
import React from 'react';
import type { Primitive } from 'react-hook-form';

import LinkExternal from 'ui/shared/LinkExternal';

import MetadataAccordionItem from './MetadataAccordionItem';
import MetadataAccordionItemTitle from './MetadataAccordionItemTitle';

interface Props {
  name?: string;
  value: Primitive;
  isItem?: boolean;
  isFlat?: boolean;
  level: number;
}

const MetadataItemPrimitive = ({ name, value, isItem = true, isFlat, level }: Props) => {

  const Component = isItem ? MetadataAccordionItem : Box;

  const content = (() => {
    switch (typeof value) {
      case 'string': {
        try {
          if (!value.includes('http')) {
            throw new Error();
          }
          const url = new URL(value);
          return <LinkExternal href={ url.toString() }>{ value }</LinkExternal>;
        } catch (error) {}
      }
      // eslint-disable-next-line no-fallthrough
      default: {
        return <div>{ String(value) }</div>;
      }
    }
  })();

  return (
    <Component level={ level } isFlat={ isFlat }>
      { name && <MetadataAccordionItemTitle name={ name }/> }
      { content }
    </Component>
  );
};

export default React.memo(MetadataItemPrimitive);
