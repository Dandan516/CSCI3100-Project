import React from 'react';
import { Text, Flex, Box, Tabs, Grid } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import PropTypes from 'prop-types';

import Panel from '../components/Panel';
import PreviewFrame from '../components/PreviewFrame';
import { useAuth } from "../hooks/AuthProvider";

function Home() {

  const auth = useAuth();

  return (
    <Panel>
      <Box asChild width="100%" my="60px">
        <Flex direction="column" align="start" gap="60px">

          <Box asChild px="60px" > 
            <Text size="6" weight="medium">
              Welcome {auth.user?.email}!
            </Text>
          </Box>

          <Box asChild minWidth="100%" px="60px">
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
                <Grid flow="row" columns="repeat(auto-fill, minmax(202px, 202px))" gap="6">
                  <PreviewFrame imageUrl="/images/3.jpeg" description="Document 3" />
                  <PreviewFrame imageUrl="/images/4.jpeg" description="Document 4" />
                </Grid>
              </Tabs.Content>

              <Tabs.Content value="all">
                <Grid flow="row" columns="repeat(auto-fill, minmax(202px, 202px))" gap="6">
                  <PreviewFrame imageUrl="/images/3.jpeg" description="Document 3" />
                  <PreviewFrame imageUrl="/images/4.jpeg" description="Document 4" />
                </Grid>
              </Tabs.Content>

            </Tabs.Root>
          </Box>
        </Flex>
      </Box>
    </Panel>
  );
}

export default Home