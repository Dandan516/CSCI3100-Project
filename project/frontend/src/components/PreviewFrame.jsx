import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import "@radix-ui/themes/styles.css";
import { Text, Inset, Flex, Box, Card } from "@radix-ui/themes";

function PreviewFrame({ linkUrl, title, imageUrl }) {
  
  const fallbackImage = '/images/no-image.png';

  return (
    <Box asChild width="200px" height="200px">
      <Card asChild>
        <Link to={linkUrl}>
          <Flex direction="column" align="center" gap="12px">
            <Inset asChild clip="border-box" side="top" pb="0">
              <Box height="150px" overflow="hidden">
                <img 
                  src={imageUrl} 
                  width="200px" 
                  onError={(e) => { e.target.src = fallbackImage; }} 
                /> 
              </Box>
            </Inset>
            <Box asChild width="200px" px="16px" >
              <Text size="3" align="left" highContrast truncate>
                {title}
              </Text>
            </Box>
          </Flex>
        </Link>
      </Card>
    </Box>
  );
}

PreviewFrame.propTypes = {
  url: PropTypes.string.isRequired,
};

export default PreviewFrame
