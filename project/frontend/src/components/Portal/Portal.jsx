import React from 'react';
import '../../App.css';
import { useNavigate } from 'react-router-dom';
import PlannerImage from '../../assets/Planner.png';
import "@radix-ui/themes/styles.css";
import { Text, Button, Flex, Box, Card } from "@radix-ui/themes";

function Portal() {
  const navigate = useNavigate();
  return (
    <Flex width="100vw" height="100vh" direction="column" align="center" justify="center">
      <Box width="500px" justify="center">
        <Card size="3" elevation="3" padding="5" radius="2">
          <Flex direction="column" align="center" gap="20px" my="20px">
            <img className="logo" src={PlannerImage} alt="Planner logo"></img>
            <Button
              asChild
              variant="solid"
              highContrast
              onClick={() => navigate('/signin')}>
              <Box width="400px" height="60px">
                <Text
                  size="5"
                  weight="bold">
                  Sign In
                </Text>
              </Box>
            </Button>
            <Button
              asChild
              variant="solid"
              onClick={() => navigate('/signup')}>
              <Box width="400px" height="60px">
                <Text
                  size="5"
                  weight="bold">
                  Sign Up
                </Text>
              </Box>
            </Button>
          </Flex>
        </Card>
      </Box>
    </Flex>
  );
}

export default Portal;
