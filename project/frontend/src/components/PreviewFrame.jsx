import React from 'react';
import PropTypes from 'prop-types';
import "@radix-ui/themes/styles.css";
import { Text, Inset, Flex, Box, Card, Link } from "@radix-ui/themes";
import '../App.css';
//import previewImage from '../assets/budget.jpeg';

function PreviewFrame({ imageUrl, description }) {

  return (
    <Card asChild>
      <Link href="https://www.google.com">
        <Flex direction="column" width="180px" height="180px" gap="15px">
          <Inset clip="border-box" side="top" pb="0">
            <Box width="202px" height="150px" overflow="hidden">
              <img src={imageUrl} width="202px" />
            </Box>
          </Inset>
          <Text size="3" mx="4px" highContrast truncate>
            {description}
          </Text>
        </Flex>
      </Link>
    </Card>
  );
}

PreviewFrame.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default PreviewFrame
