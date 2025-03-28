import React, { useState } from 'react';

import "@radix-ui/themes/styles.css";
import { Text, Flex, Box, Card, Avatar, Link } from "@radix-ui/themes";
import { useNavigate } from 'react-router-dom';

import '../App.css';
import NavigateButton from './NavigateButton';
import { useAuth } from "../hooks/AuthProvider";

function Sidebar() {

  const auth = useAuth();
  const navigate = useNavigate();

  return (
    <Flex minHeight="100vh" direction="column" justify="between" px="20px" pt="60px" pb="40px">

      <Flex direction="column" justify="start" gap="10px" >
        <NavigateButton url="/portal" label="Portal" />
        <NavigateButton url="/home" label="Home" />
        <NavigateButton url="/itinerary" label="Itinerary Planner" />
        <NavigateButton url="/budget" label="Budget Tracker" />
        <NavigateButton url="/calendar" label="Calendar" />
      </Flex>

      <Box asChild mx="20px">
        <Card asChild size="1" variant="ghost">
          <Link underline='none' highContrast onClick={() => navigate("/profile")}>
            <Flex direction="row" gap="14px" align="center" justify="start" display="flex">
              <Avatar
                size="4"
                src={auth.user?.avatarUrl}
                radius="full"
                fallback="T"
              />
              <Box asChild maxWidth="140px">
                <Text size="2" weight="medium" truncate>
                  {auth.user?.email}
                </Text>
              </Box>
            </Flex>
          </Link>
        </Card>
      </Box>
    </Flex>
  );
}

export default Sidebar