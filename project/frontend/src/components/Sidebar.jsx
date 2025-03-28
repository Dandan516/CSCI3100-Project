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
      px="20px"
      pt="60px"
      pb="40px"
      style={{
        borderRight: "1px solid rgb(102, 104, 106)", // Subtle gray border
        boxShadow: "4px 0 10px rgba(0, 0, 0, 0.1)", // Shadow effect
        zIndex: 10, // Ensure it is above the main panel
      }}
    >

      <Flex direction="column" justify="start" gap="10px" >
        <NavigateButton url="/portal" label="Portal" />
        <NavigateButton url="/home" label="Home" />
        <NavigateButton url="/itinerary" label="Itinerary Planner" />
        <NavigateButton url="/budget" label="Budget Tracker" />
        <NavigateButton url="/calendar" label="Calendar" />
      </Flex>

      <Box asChild mx="20px">
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