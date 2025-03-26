import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { Text, Flex, Box, Tabs, Grid, IconButton, TextField, ScrollArea } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

import Sidebar from '../components/Sidebar';
import PreviewFrame from '../components/PreviewFrame';
import * as Icons from '../assets/Icons';
import '../App.css';

function Dashboard() {

  const [user, setUser] = useState({
    email: 'user1@test.com',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const updateSearchQuery = (e) => setSearchQuery(e.target.value);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 800) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Flex direction="column">
      <Box asChild>
        <Flex direction="row" align="center" >

          {isCollapsed ? null : <Sidebar />}

          <ScrollArea type="always" scrollbars="vertical">
            <Box asChild minWidth="800px" height="100vh" p="60px">
              <Flex direction="column" align="start" gap="60px">

                <Box asChild width="60px" height="60px">
                  <IconButton asChild highContrast variant="ghost" radius="medium" onClick={toggleSidebar}>
                    {isCollapsed ? <Icons.LayoutSidebarLeftExpand /> : <Icons.LayoutSidebarLeftCollapseFilled />}
                  </IconButton>
                </Box>

                <Box asChild pl="4px">
                  <Text size="6" weight="medium" align="center">
                    Welcome {user.email}!
                  </Text>
                </Box>

                <Box asChild minWidth="70%" minHeight="50px" px="6px">
                  <TextField.Root
                    size="3"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={updateSearchQuery} >
                    <TextField.Slot>
                      <Icons.MagnifyingGlass />
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
                      <Grid flow="row" columns="repeat(auto-fill, minmax(200px, 200px))" gap="6">
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
                      <Grid flow="row" columns="repeat(auto-fill, minmax(200px, 200px))" gap="6">
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