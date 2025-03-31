import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

import axios from 'axios';
import { Text, Flex, Box, Button, TextField, Heading, TextArea, Grid } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { Form } from "radix-ui";

import { useAuth } from "../hooks/AuthProvider";
import Panel from '../components/Panel';

function TravelPlanner() {

  const auth = useAuth();
  const params = useParams([]);

  const title = params.travelTitle;

  const [editMode, setEditMode] = useState(false);

  const [travelPlan, setTravelPlan] = useState([]);

  const [formData, setFormData] = useState({
    id: 0,
    title: "",
    start_date: "",
    end_date: "",
    description: "",
  });

  const getTravelPlan = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}travel/?title=${title}`, {
        headers: {
          Authorization: `Token ${auth.token}`,
        },
      });
      const data = response.data[0]; // Extract the single element from the array
      setTravelPlan(data);
      setFormData(data);
    } catch (error) {
      console.error("Error fetching travel plan:", error);
    }
  };

  const updateFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}travel/?title=${title}/${travelPlan.id}/`, formData, {
        headers: {
          Authorization: `Token ${auth.token}`,
        },
      });
    } catch (error) {
      console.error("Error updating travel plan:", error);
    }
    setEditMode(false);
  }

  useEffect(() => {
    getTravelPlan();
  }
    , [title]);

  return (
    <Panel>
      <Box asChild width="100%">
        <Flex direction="column" gap="60px" px="60px" my="60px">

          <Box asChild width="100%" >
            <Flex direction="row" align="center" justify="between">
              <Heading size="8" weight="medium">
                {travelPlan?.title}
              </Heading>
              {editMode ? (
                <Button size="3" onClick={handleSave}>Save</Button>
              ) : (
                <Button size="3" onClick={() => setEditMode(true)}>Edit</Button>
              )}
            </Flex>
          </Box>

          <Box asChild width="100%">
            {editMode ? (


              <Form.Root>
                <Flex direction="column" gap="60px">
                  <Grid flow="column" gap="40px" columns={2} rows={1}>
                    <Form.Field name="start_date">
                      <Form.Label asChild>
                        <Box asChild mb="10px" ml="6px">
                          <Text size="2" weight="medium">
                            Start Date
                          </Text>
                        </Box>
                      </Form.Label>
                      <Form.Control
                        asChild
                        type="date"
                        value={formData.start_date}
                        onChange={updateFormData}>
                        <Box asChild height="50px">
                          <TextField.Root>
                            <TextField.Slot pl="10px" />
                            <TextField.Slot pr="10px" />
                          </TextField.Root>
                        </Box>
                      </Form.Control>
                    </Form.Field>

                    <Form.Field name="end_date">
                      <Form.Label asChild>
                        <Box asChild mb="10px" ml="6px">
                          <Text size="2" weight="medium">
                            End Date
                          </Text>
                        </Box>
                      </Form.Label>
                      <Form.Control
                        asChild
                        type="date"
                        value={formData.end_date}
                        onChange={updateFormData}>
                        <Box asChild height="50px">
                          <TextField.Root>
                            <TextField.Slot pl="10px" />
                            <TextField.Slot pr="10px" />
                          </TextField.Root>
                        </Box>
                      </Form.Control>
                    </Form.Field>
                  </Grid>

                  <Form.Field name="description">
                    <Form.Label asChild>
                      <Box asChild mb="10px" ml="6px">
                        <Text size="2" weight="medium">
                          Description
                        </Text>
                      </Box>
                    </Form.Label>
                    <Form.Control
                      asChild
                      type="text"
                      value={formData.description}
                      onChange={updateFormData}>
                      <Box asChild width="800px" height="160px">
                        <TextArea size="3" />
                      </Box>
                    </Form.Control>
                  </Form.Field>
                </Flex>
              </Form.Root>

            ) : (
              <Flex direction="column" gap="60px">
                <Text size="5">{travelPlan?.start_date} to {travelPlan?.end_date}</Text><br />
                <Text size="5">Description: {travelPlan?.description}</Text><br />
              </Flex>
            )}
          </Box>
        </Flex>
      </Box>
    </Panel>

  );
}

export default TravelPlanner;