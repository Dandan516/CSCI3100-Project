import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import "@radix-ui/themes/styles.css";
import { Text, Button, Flex, Box } from "@radix-ui/themes";
import '../App.css';

function NavigateButton({ url, label }) {

  const navigate = useNavigate();

  return (
    <Flex asChild width="180px" height="40px" px="20px">
      <Button
        variant="ghost"
        highContrast
        onClick={() => navigate(url)}
        style={{ justifyContent: "flex-start" }}>
        <Text size="4" weight="medium">
          {label}
        </Text>
      </Button>
    </Flex>
  );
}

NavigateButton.propTypes = {
  url: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default NavigateButton
