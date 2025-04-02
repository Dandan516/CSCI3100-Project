import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Box, Heading, Text, Flex } from "@radix-ui/themes";

function NotFound() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <Box asChild width="100%" height="100vh" p="60px">
      <Flex direction="column" align="center" justify="center">
        <Heading size="8" weight="bold">
          404 - Page Not Found
        </Heading>
        <Text size="5" style={{ margin: "20px 0" }}>
          The page you are looking for does not exist.
        </Text>
        <Button size="3" onClick={handleGoBack}>
          Go Back
        </Button>
      </Flex>
    </Box>
  );
}

export default NotFound;