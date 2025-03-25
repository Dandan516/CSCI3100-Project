import React from 'react';
import PropTypes from 'prop-types';
import "@radix-ui/themes/styles.css";
import { Text, Inset, Flex, Box, Card, Link } from "@radix-ui/themes";
import '../App.css';
//import previewImage from '../assets/budget.jpeg';

function PreviewFrame({ imageUrl, description }) {

  return (
    <Box asChild width="200px" height="200px">
      <Card asChild>
        <Link href="https://www.google.com">
          <Flex direction="column" align="center" gap="12px">
            <Inset asChild clip="border-box" side="top" pb="0">
              <Box height="150px" overflow="hidden">
                <img src={imageUrl} width="200px" />
              </Box>
            </Inset>
            <Box asChild width="200px" px="3" >
              <Text size="3" align="left" highContrast truncate>
                {description}
              </Text>
            </Box>
          </Flex>
        </Link>
      </Card>
    </Box>
  );
}

PreviewFrame.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default PreviewFrame
