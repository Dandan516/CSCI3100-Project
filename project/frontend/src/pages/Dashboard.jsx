import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import axios, { all } from 'axios';
import { Text, Flex, Box, Tabs, Grid } from "@radix-ui/themes";

import Panel from '../components/Panel';
import PreviewFrame from '../components/PreviewFrame';
import { useAuth } from "../hooks/AuthProvider";

function Dashboard() {

  const auth = useAuth();

  const [recentPlans, setRecentPlans] = useState([]);
  const [sharedPlans, setSharedPlans] = useState([]);
  const [travelPlans, setTravelPlans] = useState([]);

  const getPlans = async () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}travel/`, {
        headers: { Authorization: `Token ${auth.token}` },
      })
      .then(response => {
        const data = response.data.map((item) => ({
          id: item.id,
          title: item.title,
          user: item.user.username,
        }))
        setTravelPlans(data);
      });
  }

  const getRecentPlans = () => {
    travelPlans.filter((plan) => {
      const date = new Date(plan.created_at);
      const today = new Date();
      const diffTime = Math.abs(today - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    });
  }

  const getSharedPlans = () => {
    travelPlans.filter((plan) => {
      return (plan.user.id !== auth.user.id);
    });
  }

  useEffect(() => {
    getPlans();
  }, []);

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
                <Tabs.Trigger value="all">View all plans</Tabs.Trigger>
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
                {travelPlans.length !== 0 && (
                  <Grid flow="row" columns="repeat(auto-fill, minmax(202px, 202px))" gap="6">
                    {travelPlans.map((travelPlan, index) => (
                      <PreviewFrame
                        key={index} // Added unique key prop
                        linkUrl={`/travel/${travelPlan.id}`}
                        title={travelPlan.title}
                        imageUrl={"/public/images/travel.png"}
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