import { Box } from '@chakra-ui/react';
import React from 'react';

import IndexingAlert from 'ui/home/IndexingAlert';

interface Props {
  children: React.ReactNode;
  isHomePage?: boolean;
}

const PageContent = ({ children, isHomePage }: Props) => {
  return (
    <Box
      as="main"
      w="100%"
      paddingX={{ base: 4, lg: 12 }}
      paddingBottom={ 10 }
      paddingTop={{ base: isHomePage ? '88px' : '138px', lg: 0 }}
    >
      <IndexingAlert display={{ base: 'block', lg: 'none' }}/>
      { children }
    </Box>
  );
};

export default PageContent;
