import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";

import axios from 'axios';
import { Text, Flex, Box, Button, TextField, Heading, TextArea, Grid, Dialog } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { Form } from "radix-ui";

import { useAuth } from "../hooks/AuthProvider";
import Panel from '../components/Panel';
import ItineraryCard from '../components/ItineraryCard';
import * as Icons from "../assets/Icons";

function TravelPlanner() {

  const auth = useAuth();
  const params = useParams([]);
  // const navigate = useNavigate();

  const id = params.id;

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [travelPlan, setTravelPlan] = useState();

  const [formData, setFormData] = useState({
    id: 0,
    title: "",
    start_date: "",
    end_date: "",
    description: "",
    itineraries: [],
  });

  const getTravelPlan = async () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}travel/${id}/`, {
        headers: {
          Authorization: `Token ${auth.token}`,
        },
      })
      .then(response => {
        const data = response.data;
        setTravelPlan(data);
        setFormData(data);
      })
      .catch((error) => {
        console.error("Error fetching travel plan:", error);
      });
  };

  const updateFormData = (e) => {
    const { name, value } = e.target;

    // Enforce title length limit
    if (name === "title" && value.length > 60) {
      return; // Prevent updating if the title exceeds 60 characters
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    axios
      .put(`${import.meta.env.VITE_API_URL}travel/${id}/`, formData, {
        headers: {
          Authorization: `Token ${auth.token}`,
        },
      })
      .then(() => {
        setTravelPlan(formData); // Update the travel plan with the saved data
        setIsDialogOpen(false); // Close the dialog
      })
      .catch((error) => {
        console.error("Error updating travel plan:", error);
      });
  };

  useEffect(() => {
    getTravelPlan();
  }, [id]);

  return (
    <Panel>
      <Box asChild width="100%" p="60px">
        <Flex direction="column" gap="40px">

          {/* Travel Plan Details */}
          <Flex direction="row" justify="between">
            <Heading size="8" weight="medium">
              {travelPlan?.title}
            </Heading>
            <Box asChild width="80px" height="40px">
              <Button size="3" radius="medium" onClick={() => setIsDialogOpen(true)}>
                Edit
              </Button>
            </Box>
          </Flex>

          <Flex direction="row" gap="20px" align="center">
            <Icons.Calendar />
            <Text size="4">{travelPlan?.start_date} ~ {travelPlan?.end_date}</Text>
          </Flex>

          <Box asChild maxWidth="100vw">
            <Text as="p" size="4" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {travelPlan?.description}
            </Text>
          </Box>

          <br /><Heading as="h2" size="6" weight="medium">Itineraries:</Heading>
          {travelPlan?.itineraries?.length > 0 ? (
            <Flex direction="column" gap="40px">
              {travelPlan.itineraries.map((item) => (
                <ItineraryCard
                  key={item.id}
                  itinerary={item}
                  travelTitle={travelPlan.title}
                  onUpdate={getTravelPlan}/>
              ))}
            </Flex>
          ) : (
            <Text size="3" color="gray">No itineraries available.</Text>
          )}

          {/* Edit Dialog */}
          <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Dialog.Content size="3" maxWidth="600px">
              <Box asChild p="6px" pb="16px">
                <Dialog.Title>Edit Travel Plan</Dialog.Title>
              </Box>
              <Dialog.Description></Dialog.Description>
              <Form.Root>
                <Flex direction="column" gap="20px">
                  <Form.Field name="title">
                    <Form.Label asChild>
                      <Box asChild mb="10px" ml="6px">
                        <Text size="2" weight="medium">Title</Text>
                      </Box>
                    </Form.Label>
                    <Form.Control
                      asChild
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={updateFormData}>
                      <Box asChild height="40px">
                        <TextField.Root>
                          <TextField.Slot pl="10px" />
                          <TextField.Slot >
                            <Text size="1" color="gray" mr="4px">
                              {formData.title.length} / 60
                            </Text>
                          </TextField.Slot>
                        </TextField.Root>
                      </Box>
                    </Form.Control>
                  </Form.Field>

                  <Grid flow="column" gap="20px" columns={2}>
                    <Form.Field name="start_date">
                      <Form.Label asChild>
                        <Box asChild mb="10px" ml="6px">
                          <Text size="2" weight="medium">Start Date</Text>
                        </Box>
                      </Form.Label>
                      <Form.Control
                        asChild
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={updateFormData}>
                        <Box asChild height="40px">
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
                          <Text size="2" weight="medium">End Date</Text>
                        </Box>
                      </Form.Label>
                      <Form.Control
                        asChild
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={updateFormData}
                        min={formData.start_date}>
                        <Box asChild height="40px">
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
                        <Text size="2" weight="medium">Description</Text>
                      </Box>
                    </Form.Label>
                    <Form.Control
                      asChild
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={updateFormData}>
                      <Box asChild height="100px" mx="10px" p="2px">
                        <TextArea size="2" />
                      </Box>
                    </Form.Control>
                  </Form.Field>
                </Flex>
              </Form.Root>

              <Flex gap="16px" mt="30px" justify="end">
                <Dialog.Close>
                  <Button size="3" variant="soft" color="gray">
                    Cancel
                  </Button>
                </Dialog.Close>
                <Button size="3" variant="solid" onClick={handleSave}>
                  Save
                </Button>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </Flex>
      </Box>
    </Panel>
  );
}

export default TravelPlanner;