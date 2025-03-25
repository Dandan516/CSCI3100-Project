import React, { useState } from 'react';

import axios from 'axios';
import { Text, Flex, Box, Tabs, Grid, Separator, TextField, ScrollArea } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

import Sidebar from '../components/Sidebar';
import PreviewFrame from '../components/PreviewFrame';
import MagnifyingGlassIcon from '../components/MagnifyingGlassIcon';
import '../App.css';

function Dashboard() {

  const [user, setUser] = useState({
    email: 'user1@test.com',
  });

  const [selectedSegment, setSelectedSegment] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchQueryChange = (newQuery) => {
    setSearchQuery(newQuery);
    // Add any additional logic for handling search query changes here
  };

  return (
    <Flex direction="column">
      <Box asChild>
        <Flex direction="row" align="center" >

          <Sidebar />

          <ScrollArea type="always" scrollbars="vertical">
            <Box height="100vh" p="20px">
              <Flex direction="column" align="center" gap="60px" m="60px">

                <Text size="6" weight="medium" align="center" mb="20px">
                  Welcome {user.email}!
                </Text>

                <Box asChild minWidth="70%" minHeight="50px" px="6px">
                  <TextField.Root
                    size="3"
                    placeholder="Search..."
                    value={searchQuery}
                    onValueChange={handleSearchQueryChange}>
                    <TextField.Slot>
                      <MagnifyingGlassIcon />
                    </TextField.Slot>
                  </TextField.Root>
                </Box>

                <Box asChild minWidth="100%">
                  <Tabs.Root defaultValue="recent">

                    <Tabs.List mb="30px">
                      <Tabs.Trigger value="recent">Recently viewed</Tabs.Trigger>
                      <Tabs.Trigger value="shared">Shared with me</Tabs.Trigger>
                      <Tabs.Trigger value="all">View all documents</Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.Content value="recent">
                      <Grid flow="row" columns="repeat(auto-fill, minmax(200px, 1fr))" gap="30px">
                        <PreviewFrame imageUrl="/images/thailand.jpeg" description="Itinerary: Trip to Thailand" />
                        <PreviewFrame imageUrl="/images/budget.jpeg" description="April budget" />
                        <PreviewFrame imageUrl="/images/3.jpeg" description="Document 3" />
                        <PreviewFrame imageUrl="/images/4.jpeg" description="Document 4" />
                        <PreviewFrame imageUrl="/images/5.jpeg" description="Document 5" />
                        <PreviewFrame imageUrl="/images/6.jpeg" description="Document 6" />
                        <PreviewFrame imageUrl="/images/7.jpeg" description="Document 7" />
                        <PreviewFrame imageUrl="/images/8.jpeg" description="Document 8" />
                        <PreviewFrame imageUrl="/images/thailand.jpeg" description="Itinerary: Trip to Thailand" />
                        <PreviewFrame imageUrl="/images/budget.jpeg" description="April budget" />
                        <PreviewFrame imageUrl="/images/3.jpeg" description="Document 3" />
                        <PreviewFrame imageUrl="/images/4.jpeg" description="Document 4" />
                        <PreviewFrame imageUrl="/images/5.jpeg" description="Document 5" />
                        <PreviewFrame imageUrl="/images/6.jpeg" description="Document 6" />
                        <PreviewFrame imageUrl="/images/7.jpeg" description="Document 7" />
                        <PreviewFrame imageUrl="/images/8.jpeg" description="Document 8" />
                      </Grid>
                    </Tabs.Content>

                    <Tabs.Content value="shared">
                      <Grid flow="row" columns="repeat(auto-fill, minmax(202px, 1fr))" gap="6">
                        <PreviewFrame imageUrl="/images/3.jpeg" description="Document 3" />
                        <PreviewFrame imageUrl="/images/4.jpeg" description="Document 4" />
                      </Grid>
                    </Tabs.Content>

                    <Tabs.Content value="all">
                      <Grid flow="row" columns="repeat(auto-fill, minmax(202px, 1fr))" gap="6">
                        <PreviewFrame imageUrl="/images/3.jpeg" description="Document 3" />
                        <PreviewFrame imageUrl="/images/4.jpeg" description="Document 4" />
                      </Grid>
                    </Tabs.Content>

                  </Tabs.Root>
                </Box>
              </Flex>
            </Box>
          </ScrollArea>

        </Flex>
      </Box>
    </Flex>
  );

}

export default Dashboard