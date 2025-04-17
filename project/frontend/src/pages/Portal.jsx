import React from 'react';

import { Flex, Box, Card } from "@radix-ui/themes";

import NavigateButton from '../components/NavigateButton';

function Portal() {
  
  return (
    <Flex width="100vw" height="100vh" direction="column" align="center" justify="center">
      <Box asChild >
        <Card size="3">
          <Flex direction="column" align="center" gap="20px" m="20px">
            
            <NavigateButton url="/login" label="Sign In"/>

            <NavigateButton url="/signup" label="Sign Up"/>

            <NavigateButton url="/forgot-password" label="Forgot Password"/>

            <NavigateButton url="/dashboard" label="Dashboard"/>
            
          </Flex>
        </Card>
      </Box>
    </Flex>
  );
}

export default Portal;
