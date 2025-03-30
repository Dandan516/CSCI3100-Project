import { useState, useEffect, use } from 'react';
import { useParams } from "react-router-dom";

import axios from 'axios';
import { Text, Flex, Box, Grid, Button, Dialog, TextField, Heading, Inset } from "@radix-ui/themes";

import { useAuth } from "../hooks/AuthProvider";
import Panel from '../components/Panel';

function TravelPlanner() {

  const auth = useAuth();
  const params = useParams([]);
  console.log(params);

  const title = params.travelTitle;

  const [travelPlan, setTravelPlan] = useState([]);

  const getTravelPlan = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}travel/${title}`, {
        headers: {
          Authorization: `Token ${auth.token}`,
        },
      });
      const data = response.data.map((item) => ({
        title: item.title,
        startDate: item.start_date,
        endDate: item.end_date,
        description: item.description,
      }));
      setTravelPlan(data);
    } catch (error) {
      console.error("Error fetching travel plan:", error);
    }
  };

  useEffect(() => {
    getTravelPlan();
  }
    , [title]);

  return (
    <Panel>
      <Box width="100%">
        <Flex direction="column" gap="6">
          <Box asChild width="100%" px="60px">
            <Heading size="7" weight="medium">
              {title}
            </Heading>
          </Box>

          <Box asChild width="100%" px="60px">
            <Text size="5" weight="regular">
              {travelPlan}
            </Text>
          </Box>
        </Flex>
      </Box>
    </Panel>

  );
}

export default TravelPlanner;