import React, { useState } from 'react';

import "@radix-ui/themes/styles.css";
import { Text, Flex, Box, Card, Avatar, Link } from "@radix-ui/themes";

import '../App.css';
import NavigateButton from './NavigateButton';

function Sidebar() {
  const [currentUser, setCurrentUser] = useState({
    email: "user1@test.com",
    profilePicUrl: "https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
  });


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
          <Link href="/profile" underline='none' highContrast>
            <Flex direction="row" gap="14px" align="center" justify="start" display="flex">
              <Avatar
                size="4"
                src={currentUser.profilePicUrl}
                radius="full"
                fallback="T"
              />
              <Box asChild maxWidth="140px">
                <Text size="2" weight="medium" truncate>
                  {currentUser.email}
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