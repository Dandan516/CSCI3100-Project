import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';
import { Text, Flex, Box, Tabs, Grid, Card, Inset, Heading, Separator } from "@radix-ui/themes";

import { Panel } from '../components/index';
import { useAuth } from "../hooks/AuthProvider";
import * as Icons from "../assets/Icons";

function Dashboard() {

  const auth = useAuth();
  const [travelPlans, setTravelPlans] = useState([]);
  const [budgets, setBudgets] = useState([]);

  const getBudgets = async () => {
    axios
      .get(
        `${import.meta.env.VITE_API_URL}budget/`,
        {
          headers: {
            Authorization: `Token ${auth.token}`
          },
        }
      )
      .then(
        response => {
          const data = response.data.map(
            (item) => ({
              id: item.id,
              title: item.title,
              dateCreated: item.date,
              totalBalance: "$" + item.total_balance,
              totalIncome: "$" + item.total_income,
              totalExpense: "$" + item.total_expense,
            })
          );
          setBudgets(data);
        }
      )
      .catch(
        error => {
          console.error("Error fetching budgets:", error);
        }
      );
  };

  const getTravelPlans = async () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}travel/`, {
        headers: { Authorization: `Token ${auth.token}` },
      })
      .then(response => {
        const data = response.data.map((item) => ({
          id: item.id,
          title: item.title,
          startDate: item.start_date,
          endDate: item.end_date,
          destination: item.destination,
          description: item.description,
          owner: item.user.username,
          collaboratorsList: item.collaborators.map((collab) => collab.username).join(", ") || "",
        }));
        setTravelPlans(data);
      })
      .catch(error => {
        console.error("Error fetching travels:", error);
      });
  };

  const recentBudget = useMemo(() => {

    return budgets[0];

  }, [budgets]);

  const recentTravelPlan = useMemo(() => {

    return travelPlans[0];

  }, [travelPlans]);

  useEffect(() => {
    getBudgets();
    getTravelPlans();
  }, []);

  return (
    <Panel>
      <Box asChild width="100%" my="60px">
        <Flex direction="column" align="start" gap="50px">

          <Box asChild px="60px" >
            <Text size="6" weight="medium">
              Welcome {auth.user?.email}!
            </Text>
          </Box>
          <Box asChild px="60px" >
            <Text size="5">
              Today's date: {new Date().toISOString().split('T')[0]}
            </Text>
          </Box>

          <Box asChild minWidth="100%" px="60px">
            <Tabs.Root defaultValue="quick-access">

              <Tabs.List mb="30px">
                <Tabs.Trigger value="quick-access">Quick Access</Tabs.Trigger>
                {/* <Tabs.Trigger value="view-all-functions">View All Functions</Tabs.Trigger> */}
              </Tabs.List>

              <Tabs.Content value="quick-access">
                <Flex direction="column" gap="40px" align="start" justify="start" mt="40px">
                  <Heading as="h2" size="7" weight="medium">
                    Budget
                  </Heading>
                  {
                    recentBudget && (
                      <Box asChild width="800px" height="300px">
                        <Card asChild>
                          <Link to={`/budget/${recentBudget.id}`}>
                            <Grid flow="row" columns="2">
                              <Flex
                                direction="column"
                                align="start"
                                justify="start"
                                gap="20px"
                                p="40px"
                                style={{
                                  boxShadow: "inset -10px 0px 10px -10px rgba(0, 0, 0, 0.3)", // Add shadow between text and image
                                  zIndex: 1,
                                }}>
                                <Box asChild width="100%">
                                  <Heading as="h3" size="7" weight="medium">
                                    {recentBudget.title}
                                  </Heading>
                                </Box>
                                <Flex gap="20px" align="center">
                                  <Text size="6" weight="regular" color={recentBudget.totalBalance >= 0 ? "green" : "red"}>
                                    {recentBudget.totalBalance}
                                  </Text>
                                </Flex>
                                <Flex gap="20px" align="center">
                                  <Icons.Plus />
                                  <Text size="4" weight="regular">
                                    {recentBudget.totalIncome}
                                  </Text>
                                </Flex>
                                <Flex gap="20px" align="center">
                                  <Icons.Minus />
                                  <Text size="4" weight="regular">
                                    {recentBudget.totalExpense}
                                  </Text>
                                </Flex>
                              </Flex>

                              <Inset asChild clip="padding-box" side="right" pb="0">
                                <Box height="300px" overflow="hidden">
                                  <img
                                    src="/images/pexels-pixabay-53621.jpg"
                                    width="100%"
                                    height="100%"
                                    style={{
                                      objectFit: "cover",
                                      objectPosition: "left",
                                    }}
                                  />
                                </Box>
                              </Inset>
                            </Grid>
                          </Link>
                        </Card>
                      </Box>
                    )
                  }
                  <Separator size="4" color="gray" />
                  <Heading as="h2" size="7" weight="medium">
                    Travel Plan
                  </Heading>
                  {
                    recentTravelPlan && (
                      <Box asChild width="800px" height="300px">
                        <Card asChild>
                          <Link to={`/travel/${recentTravelPlan.id}`}>
                            <Grid flow="row" columns="2">
                              <Flex
                                direction="column"
                                align="start"
                                justify="start"
                                gap="20px"
                                p="40px"
                                style={{
                                  boxShadow: "inset -10px 0px 10px -10px rgba(0, 0, 0, 0.3)", // Add shadow between text and image
                                  zIndex: 1,
                                }}>
                                <Box asChild width="100%" pb="16px">
                                  <Heading as="h3" size="6" weight="medium">
                                    {recentTravelPlan.title}
                                  </Heading>
                                </Box>
                                <Flex gap="20px" align="center">
                                  <Icons.Calendar />
                                  <Text size="3" weight="regular">
                                    {recentTravelPlan.startDate} - {recentTravelPlan.endDate}
                                  </Text>
                                </Flex>
                                <Flex gap="20px" align="center">
                                  <Icons.SewingPinFilled />
                                  <Text size="3" weight="regular">
                                    {recentTravelPlan.destination || "-"}
                                  </Text>
                                </Flex>
                                <Flex gap="20px" align="center">
                                  <Icons.Person20 />
                                  <Text size="3" weight="regular">
                                    {recentTravelPlan.owner}
                                    {recentTravelPlan.collaboratorsList !== "" && ", "}
                                    {recentTravelPlan.collaboratorsList || ""}
                                  </Text>
                                </Flex>
                              </Flex>

                              <Inset asChild clip="padding-box" side="right" pb="0">
                                <Box height="300px" overflow="hidden">
                                  <img
                                    src="/images/Greece.jpeg"
                                    width="100%"
                                    height="100%"
                                    style={{ objectFit: "cover" }}
                                  />
                                </Box>
                              </Inset>
                            </Grid>
                          </Link>
                        </Card>
                      </Box>
                    )
                  }
                </Flex>
              </Tabs.Content>

            </Tabs.Root>
          </Box>
        </Flex>
      </Box>
    </Panel>
  );
}

export default Dashboard