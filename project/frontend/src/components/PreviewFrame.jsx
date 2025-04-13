import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Text, Inset, Flex, Box, Card } from "@radix-ui/themes";

function PreviewFrame({ linkUrl, title, imageUrl }) {
  
  return (
    <Box asChild width="200px" height="200px">
      <Card asChild>
        <Link to={linkUrl}>
          <Flex direction="column" align="center" gap="12px">
            <Inset asChild clip="border-box" side="top" pb="0">
              <Box height="150px" overflow="hidden">
                <img 
                  src={imageUrl ? imageUrl : "/public/images/no-image.png"} 
                  width="200px" 
                /> 
              </Box>
            </Inset>
            <Box asChild width="200px" px="16px" >
              <Text size="3" align="left" highContrast truncate>
                { title ? title : <i>Untitled </i> }
              </Text>
            </Box>
          </Flex>
        </Link>
      </Card>
    </Box>
  );
}

PreviewFrame.propTypes = {
  linkUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
};

export default PreviewFrame
