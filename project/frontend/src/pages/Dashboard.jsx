import React, { useState } from 'react';

import axios from 'axios';
import { Text, Flex, Box, SegmentedControl, TextField, Container, Separator } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

import Sidebar from '../components/Sidebar';
import PreviewFrame from '../components/PreviewFrame';
import '../App.css';

function Dashboard() {

  const [user, setUser] = useState({
    email: 'user1@test.com',
  });

  return (
    <Flex height="100vh" width="100vw" direction="column">
      <Box asChild>
        <Flex direction="row" align="center" >

          <Sidebar />

          <Separator orientation="vertical" size="4" mx="0" />

          <Flex height="80%" width="100vw" minWidth="800px" m="40px" direction="column" gap="40px" mx="8">
            <Text size="6" weight="medium" align="center" mb="80px">
              Welcome {user.email}!
            </Text>
            <Box maxWidth="600px">
              <SegmentedControl.Root size="3" radius="medium" variant="surface">
                <SegmentedControl.Item value="1">
                  <Flex direction="column" width="100%" align="">
                    <Text weight="bold">Recently viewed</Text>
                  </Flex>
                </SegmentedControl.Item>
                <SegmentedControl.Item value="2">
                  <Flex direction="column" width="100%">
                    <Text weight="bold">Shared with me</Text>
                  </Flex>
                </SegmentedControl.Item>
              </SegmentedControl.Root>
            </Box>
            <Flex direction="row" gap="30px">
              <PreviewFrame imageUrl="/public/images/thailand.jpeg" description="Itinerary: Trip to Thailand" />
              <PreviewFrame imageUrl="/public/images/budget.jpeg" description="April budget" />
            </Flex>
          </Flex>

        </Flex>
      </Box>
    </Flex>
  );

}

export default Dashboard