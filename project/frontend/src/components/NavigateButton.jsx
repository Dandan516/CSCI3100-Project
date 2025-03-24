import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import "@radix-ui/themes/styles.css";
import { Text, Button, Flex, Box } from "@radix-ui/themes";
import '../App.css';

function NavigateButton ({ url, label }) {

  const navigate = useNavigate();

  return (
    <Box mx="10px">
      <Button
      asChild
      variant="ghost"
      highContrast
      onClick={() => navigate(url)}>
      <Flex width="200px" height="40px" px="20px" justify="start">
        <Text size="4" weight="medium" align="left">
          {label}
        </Text>
      </Flex>
    </Button>
    </Box>
  );
}

NavigateButton.propTypes = {
  url: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default NavigateButton
