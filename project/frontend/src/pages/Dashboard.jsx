import { useEffect, useState } from 'react';
import { Text, Flex, Box, Tabs, Grid } from "@radix-ui/themes";

import PropTypes from 'prop-types';

import Panel from '../components/Panel';
import PreviewFrame from '../components/PreviewFrame';
import { useAuth } from "../hooks/AuthProvider";

function Dashboard() {

  const auth = useAuth();

  const [recentPlans, setRecentPlans] = useState([
    {
      id: "1",
    },
    {
      id: "2",
    },
  ]);

  const [sharedPlans, setSharedPlans] = useState([
    {
      id: "3",
    },
    {
      id: "4",
    },
  ]);
  const [allPlans, setAllPlans] = useState([
    {
      id: "5",
    },
    {
      id: "6",
    },
  ]);

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
                {recentPlans.length !== 0 && (
                  <Grid flow="row" columns="repeat(auto-fill, minmax(202px, 202px))" gap="6">
                    {recentPlans.map((recentPlan, index) => (
                      <PreviewFrame
                        key={index} // Added unique key prop
                        linkUrl={`${recentPlan.id}`}
                        title={recentPlan.title}
                        imageUrl={recentPlan.imageUrl}
                      />
                    ))}
                  </Grid>
                )}
              </Tabs.Content>

              <Tabs.Content value="shared">
                {sharedPlans.length !== 0 && (
                  <Grid flow="row" columns="repeat(auto-fill, minmax(202px, 202px))" gap="6">
                    {sharedPlans.map((sharedPlan, index) => (
                      <PreviewFrame
                        key={index} // Added unique key prop
                        linkUrl={`${sharedPlan.id}`}
                        title={sharedPlan.title}
                        imageUrl={sharedPlan.imageUrl}
                      />
                    ))}
                  </Grid>
                )}
              </Tabs.Content>

              <Tabs.Content value="all">
                {allPlans.length !== 0 && (
                  <Grid flow="row" columns="repeat(auto-fill, minmax(202px, 202px))" gap="6">
                    {allPlans.map((allPlan, index) => (
                      <PreviewFrame
                        key={index} // Added unique key prop
                        linkUrl={`${allPlan.id}`}
                        title={allPlan.title}
                        imageUrl={allPlan.imageUrl}
                      />
                    ))}
                  </Grid>
                )}
              </Tabs.Content>

            </Tabs.Root>
          </Box>
        </Flex>
      </Box>
    </Panel>
  );
}

export default Dashboard