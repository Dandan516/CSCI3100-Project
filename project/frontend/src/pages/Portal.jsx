import React from 'react';

import { Flex, Box, Card } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

import NavigateButton from '../components/NavigateButton';
import '../App.css';

function Portal() {
  
  return (
    <Flex width="100vw" height="100vh" direction="column" align="center" justify="center">
      <Box asChild>
        <Card size="3">
          <Flex direction="column" align="center" gap="20px" my="20px">
            
            <NavigateButton url="/login" label="Sign In"/>

            <NavigateButton url="/signup" label="Sign Up"/>

            <NavigateButton url="/forgotpassword" label="Forgot Password"/>

            <NavigateButton url="/home" label="Home"/>

            <NavigateButton url="/profile" label="Profile"/>
            
          </Flex>
        </Card>
      </Box>
    </Flex>
  );
}

export default Portal;
