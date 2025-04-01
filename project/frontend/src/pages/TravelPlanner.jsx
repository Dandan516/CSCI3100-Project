import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";

import axios from 'axios';
import { Text, Flex, Box, Button, TextField, Heading, TextArea, Grid, Callout, IconButton, Dialog } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { Form } from "radix-ui";

import { useAuth } from "../hooks/AuthProvider";
import Panel from '../components/Panel';
import * as Icons from "../assets/Icons";

function TravelPlanner() {

  const auth = useAuth();
  const params = useParams([]);
  const navigate = useNavigate();

  const title = params.travelTitle;

  const [editMode, setEditMode] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [travelPlan, setTravelPlan] = useState([]);

  const [formData, setFormData] = useState({
    id: 0,
    title: "",
    start_date: "",
    end_date: "",
    description: "",
  });

  const isDateInvalid = 
    formData.start_date && formData.end_date
      ? new Date(formData.start_date) > new Date(formData.end_date)
      : false;

  const getTravelPlan = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}travel/${title}`, {
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
      await axios.put(`${import.meta.env.VITE_API_URL}travel/${title}/${travelPlan.id}/`, formData, {
        headers: {
          Authorization: `Token ${auth.token}`,
        },
      });
      console.log("Travel plan updated successfully:", formData);
    } catch (error) {
      console.error("Error updating travel plan:", error);
    }
    if (title !== formData.title) {
      console.log("Title changed, navigating to new URL:", formData.title);
      await navigate(`/travel/${formData.title}`);
    }

  }

  useEffect(() => {
    getTravelPlan();
  }
    , [title]);

  return (
    <Panel>
      <Box asChild width="100%" p="60px">

        {editMode ? (
          <Form.Root>
            <Flex direction="column" gap="60px">
              <Flex direction="row" align="center" justify="between">
                <Form.Field name="title">
                  <Flex gap="20px" align="baseline">


                    <Heading size="8" weight="medium">
                      {formData.title}
                    </Heading>

                    <Form.Control asChild>
                      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>

                        <Dialog.Trigger asChild>
                          <Box asChild>
                            <IconButton variant="ghost" size="3">
                              <Icons.Pencil />
                            </IconButton>
                          </Box>
                        </Dialog.Trigger>

                        <Flex asChild direction="column" gap="10px">
                          <Dialog.Content size="3" maxWidth="450px">
                            <Box asChild p="4px">
                              <Dialog.Title>Edit title</Dialog.Title>
                            </Box>
                            <Form.Control
                              asChild
                              type="text"
                              value={formData.title}
                              onChange={updateFormData}>
                              <TextField.Root>
                                <TextField.Slot pl="8px" />
                                <TextField.Slot pr="8px" />
                              </TextField.Root>

                            </Form.Control>

                            <Flex gap="3" mt="4" justify="end">
                              <Dialog.Close>
                                <Box asChild px="20px">
                                  <Button size="3" variant="solid">
                                    Done
                                  </Button>
                                </Box>
                              </Dialog.Close>
                            </Flex>
                          </Dialog.Content>
                        </Flex>

                      </Dialog.Root>
                    </Form.Control>
                  </Flex>
                </Form.Field>

                <Box asChild width="80px" height="40px">
                  <Button size="3" radius="medium" onClick={handleSave} disabled={isDateInvalid}>
                    Save
                  </Button>
                </Box>

              </Flex>

              <Grid flow="column" gap="40px" columns={3} rows={1}>

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

                {isDateInvalid && (
                  <Callout.Root color="red">
                    <Callout.Icon>
                      <Icons.CrossCircled />
                    </Callout.Icon>
                    <Callout.Text>
                      End date must be later than or equal to the start date.
                    </Callout.Text>
                  </Callout.Root>
                )}

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

            <Flex direction="row" align="center" justify="between">
              <Heading size="8" weight="medium">
                {travelPlan?.title}
              </Heading>
              <Box asChild width="80px" height="40px">
                <Button size="3" radius="medium" onClick={() => setEditMode(true)}>
                  Edit
                </Button>
              </Box>
            </Flex>

            <Text size="5">{travelPlan?.start_date} ~ {travelPlan?.end_date}</Text><br />
            <Text size="5">Description:</Text>
            <Text size="5">{travelPlan?.description}</Text>
          </Flex>
        )}
      </Box>

    </Panel>
  );
}

export default TravelPlanner;