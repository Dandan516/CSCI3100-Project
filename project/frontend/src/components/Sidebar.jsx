import React, { useState } from 'react';

import "@radix-ui/themes/styles.css";
import { Text, Flex, Box, Card, Avatar, Link, Button } from "@radix-ui/themes";
import { useNavigate } from 'react-router-dom';

import '../App.css';
import NavigateButton from './NavigateButton';
import { useAuth } from "../hooks/AuthProvider";

function Sidebar() {

  const auth = useAuth();
  const navigate = useNavigate();

  return (
    <Flex
      minHeight="100vh"
      direction="column"
      justify="between"
      p="40px"
      pt="60px"
      style={{
        boxShadow: "4px 0 10px rgba(0, 0, 0, 0.1)", // Shadow effect
        zIndex: 10, // Ensure it is above the main panel
        transition: "width 0.3s ease-in-out", // Smooth transition for width
        overflow: "hidden", // Prevent content overflow during collapse
      }}>

      <Flex direction="column" align="center" gap="20px" >
        <NavigateButton url="/portal" label="Portal" />
        <NavigateButton url="/home" label="Home" />
        <NavigateButton url="/travel" label="Travel Planner" />
        <NavigateButton url="/budget" label="Budget Tracker" />
        <NavigateButton url="/calendar" label="Calendar" />
      </Flex>

      <Box asChild>
        <Card asChild size="1" variant="ghost">
          <Button variant="ghost" onClick={() => navigate("/profile")}>
            <Flex direction="row" gap="14px" align="center" justify="start" display="flex">
              <Avatar
                size="4"
                src={auth.user?.avatarUrl}
                radius="full"
                fallback="T"
              />
              <Box asChild maxWidth="140px">
                <Text size="2" weight="medium" highContrast truncate>
                  {auth.user?.email}
                </Text>
              </Box>
            </Flex>
          </Button>
        </Card>
      </Box>
    </Flex>
  );
}

export default Sidebar