import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";

import axios from 'axios';
import { Text, Flex, Box, Button, TextField, Heading, TextArea, Grid, Dialog, IconButton, Select } from "@radix-ui/themes";

import { Form } from "radix-ui";

import { useAuth } from "../hooks/AuthProvider";
import Panel from '../components/Panel';
import ItineraryCard from '../components/ItineraryCard';
import * as Icons from "../assets/Icons";

function TravelPlanner() {

  const auth = useAuth();
  const params = useParams([]);
  // const navigate = useNavigate();

  const [isEditTravelDialogOpen, setIsEditTravelDialogOpen] = useState(false);
  const [isNewItineraryDialogOpen, setIsNewItineraryDialogOpen] = useState(false);

  const [travelPlan, setTravelPlan] = useState({
    id: 0,
    title: '',
    start_date: null,
    end_date: null,
    description: '',
    itineraries: [],
  });

  const [editingTravelPlan, setEditingTravelPlan] = useState({
    id: 0,
    title: '',
    start_date: null,
    end_date: null,
    description: '',
    itineraries: [],
  });

  const [newItinerary, setNewItinerary] = useState({
    activity: "",
    date: null,
    start_time: null,
    end_time: null,
    location: "",
    notes: "",
    tag: null,
  });

  const getTravelPlan = async () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}travel/${params.id}/`, {
        headers: { Authorization: `Token ${auth.token}` },
      })
      .then(response => {
        const data = response.data;
        setTravelPlan(data);
        setEditingTravelPlan(data);
      })
      .catch((error) => {
        console.error("Error fetching travel plan:", error);
      });
  };

  const updateEditingTravelPlan = (e) => {
    const { name, value } = e.target;

    // Enforce title length limit
    if (name === "title" && value.length > 60) {
      return; // Prevent updating if the title exceeds 60 characters
    }

    setEditingTravelPlan({
      ...editingTravelPlan,
      [name]: value,
    });
  };

  const handleSaveTravelPlan = async () => {
    axios
      .put(`${import.meta.env.VITE_API_URL}travel/${params.id}/`, editingTravelPlan, {
        headers: { Authorization: `Token ${auth.token}` },
      })
      .then(() => {
        setTravelPlan(editingTravelPlan); // Update the travel plan with the saved data
        setIsEditTravelDialogOpen(false); // Close the dialog
      })
      .catch((error) => {
        console.error("Error updating travel plan:", error);
      });
  };

  const updateTagSelection = (value) => {
    console.log("Selected tag:", value);
    setNewItinerary({
      ...newItinerary,
      tag: value,
    });
  }

  const updateNewItinerary = (e) => {

    const { name, value } = e.target;
    if (name === "activity" && value.length > 60) {
      return; // Prevent updating if the title exceeds 60 characters
    }
    setNewItinerary({
      ...newItinerary,
      [name]: value,
    });
  };

  const handleNewItinerary = async () => {
    axios
      .post(`${import.meta.env.VITE_API_URL}travel/${travelPlan.title}/itineraries/`, newItinerary, {
          headers: { Authorization: `Token ${auth.token}`},
          ContentType: "multipart/form-data",
        })
      .then((response) => {
        alert("Itinerary added successfully!", response.data);
        setIsNewItineraryDialogOpen(false);
        getTravelPlan();
      })
      .catch((error) => {
        console.error("Error adding itinerary:", error);
      });
  };

  useEffect(() => {
    getTravelPlan();
  }, [params.id]);

  return (
    <Panel>
      <Box asChild width="100%" p="60px">
        <Flex direction="column" gap="40px">

          {/* Travel Plan Details */}
          <Flex direction="row" justify="between">

            <Heading size="8" weight="medium">
              {travelPlan?.title}
            </Heading>

            {/* Edit Travel Plan Button */}

            <Dialog.Root open={isEditTravelDialogOpen} onOpenChange={setIsEditTravelDialogOpen}>
              <Box asChild width="80px" height="40px">
                <Button size="3" variant="soft" radius="medium" onClick={() => setIsEditTravelDialogOpen(true)}>
                  Edit
                </Button>
              </Box>
              <Dialog.Content size="3" maxWidth="600px">
                <Box asChild p="10px" pb="20px">
                  <Dialog.Title>Edit Travel Plan</Dialog.Title>
                </Box>
                <Dialog.Description></Dialog.Description>
                <Form.Root>
                  <Flex direction="column" gap="20px" px="10px">
                    <Form.Field name="title">
                      <Form.Label asChild>
                        <Box asChild mb="6px">
                          <Text size="2" weight="medium">Title</Text>
                        </Box>
                      </Form.Label>
                      <Form.Control
                        asChild
                        type="text"
                        name="title"
                        value={editingTravelPlan.title}
                        onChange={updateEditingTravelPlan}>
                        <Box asChild height="40px">
                          <TextField.Root>
                            <TextField.Slot />
                            <TextField.Slot >
                              <Text size="1" color="gray" mr="4px">
                                {editingTravelPlan.title.length} / 60
                              </Text>
                            </TextField.Slot>
                          </TextField.Root>
                        </Box>
                      </Form.Control>
                    </Form.Field>

                    <Grid flow="column" gap="20px" columns={2}>
                      <Form.Field name="start_date">
                        <Form.Label asChild>
                          <Box asChild mb="6px">
                            <Text size="2" weight="medium">Start Date</Text>
                          </Box>
                        </Form.Label>
                        <Form.Control
                          asChild
                          type="date"
                          name="start_date"
                          value={editingTravelPlan.start_date}
                          onChange={updateEditingTravelPlan}>
                          <Box asChild height="40px">
                            <TextField.Root>
                              <TextField.Slot />
                              <TextField.Slot />
                            </TextField.Root>
                          </Box>
                        </Form.Control>
                      </Form.Field>

                      <Form.Field name="end_date">
                        <Form.Label asChild>
                          <Box asChild mb="6px">
                            <Text size="2" weight="medium">End Date</Text>
                          </Box>
                        </Form.Label>
                        <Form.Control
                          asChild
                          type="date"
                          name="end_date"
                          value={editingTravelPlan.end_date}
                          onChange={updateEditingTravelPlan}
                          min={editingTravelPlan.start_date}>
                          <Box asChild height="40px">
                            <TextField.Root>
                              <TextField.Slot />
                              <TextField.Slot />
                            </TextField.Root>
                          </Box>
                        </Form.Control>
                      </Form.Field>
                    </Grid>

                    <Form.Field name="description">
                      <Form.Label asChild>
                        <Box asChild mb="6px">
                          <Text size="2" weight="medium">Description</Text>
                        </Box>
                      </Form.Label>
                      <Form.Control
                        asChild
                        type="text"
                        name="description"
                        value={editingTravelPlan.description}
                        onChange={updateEditingTravelPlan}>
                        <Box asChild height="100px" p="2px">
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
                  <Button size="3" variant="solid" onClick={handleSaveTravelPlan}>
                    Save
                  </Button>
                </Flex>
              </Dialog.Content>
            </Dialog.Root>

          </Flex>

          <Flex direction="row" gap="20px" align="center">
            <Icons.Calendar />
            <Text size="4">{travelPlan?.start_date} - {travelPlan?.end_date}</Text>
            <Box width="30px" />
            <Icons.SewingPinFilled />
            <Text size="3">{travelPlan?.location || "-"}</Text>
          </Flex>

          <Box asChild maxWidth="100vw">
            <Text as="p" size="4" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {travelPlan?.description || <i>Add a description to your travel plan...</i>}
            </Text>
          </Box>

          <Box height="40px" />

          {/* Itinerary List */}

          <Flex direction="row" align="center" justify="between">

            <Heading as="h2" size="6" weight="medium">Itineraries:</Heading>

            {/* Add Itinerary Button */}
            <Dialog.Root open={isNewItineraryDialogOpen} onOpenChange={setIsNewItineraryDialogOpen}>
              <Dialog.Trigger asChild>
                <Button variant="soft" radius="medium" size="3">
                  <Flex direction="row" gap="8px" align="center" justify="center">
                    <Icons.Plus />
                    <Text size="3" weight="medium">Add Itinerary</Text>
                  </Flex>
                </Button>
              </Dialog.Trigger>
              <Dialog.Content size="3" maxWidth="600px">
                <Box asChild p="10px" pb="20px">
                  <Dialog.Title>Add Itinerary</Dialog.Title>
                </Box>
                <Dialog.Description></Dialog.Description>
                <Form.Root className="FormRoot">
                  <Flex direction="column" gap="20px" px="10px">

                    <Form.Field name="activity">
                      <Form.Label asChild>
                        <Box asChild mb="6px" >
                          <Text size="2" weight="medium">Activity</Text>
                        </Box>
                      </Form.Label>
                      <Form.Control
                        asChild
                        type="text"
                        value={newItinerary.activity}
                        onChange={updateNewItinerary}>
                        <Box asChild height="40px">
                          <TextField.Root>
                            <TextField.Slot />
                            <TextField.Slot >
                              <Text size="1" color="gray" mr="4px">
                                {newItinerary.activity.length} / 60
                              </Text>
                            </TextField.Slot>
                          </TextField.Root>
                        </Box>
                      </Form.Control>
                    </Form.Field>

                    <Grid flow="column" gap="20px" columns={2}>
                      <Form.Field name="date">
                        <Form.Label asChild>
                          <Box asChild mb="6px" >
                            <Text size="2" weight="medium">Start Date</Text>
                          </Box>
                        </Form.Label>
                        <Form.Control
                          asChild
                          type="date"
                          min={travelPlan.start_date}
                          max={travelPlan.end_date}
                          value={newItinerary.date}
                          onChange={updateNewItinerary}>
                          <Box asChild height="40px">
                            <TextField.Root>
                              <TextField.Slot />
                              <TextField.Slot />
                            </TextField.Root>
                          </Box>
                        </Form.Control>
                      </Form.Field>

                      <Form.Field name="start_time">
                        <Form.Label asChild>
                          <Box asChild mb="6px" >
                            <Text size="2" weight="medium">Start Time</Text>
                          </Box>
                        </Form.Label>
                        <Form.Control
                          asChild
                          type="time"
                          value={newItinerary.start_time}
                          onChange={updateNewItinerary}>
                          <Box asChild height="40px">
                            <TextField.Root>
                              <TextField.Slot />
                              <TextField.Slot />
                            </TextField.Root>
                          </Box>
                        </Form.Control>
                      </Form.Field>
                    </Grid>

                    <Grid flow="column" gap="20px" columns={2}>
                      <Form.Field name="date">
                        <Form.Label asChild>
                          <Box asChild mb="6px" >
                            <Text size="2" weight="medium">End Date</Text>
                          </Box>
                        </Form.Label>
                        <Form.Control
                          asChild
                          type="date"
                          min={travelPlan.start_date}
                          max={travelPlan.end_date}
                          value={newItinerary.date}
                          onChange={updateNewItinerary}>
                          <Box asChild height="40px">
                            <TextField.Root>
                              <TextField.Slot />
                              <TextField.Slot />
                            </TextField.Root>
                          </Box>
                        </Form.Control>
                      </Form.Field>

                      <Form.Field name="end_time">
                        <Form.Label asChild>
                          <Box asChild mb="6px" >
                            <Text size="2" weight="medium">End Time</Text>
                          </Box>
                        </Form.Label>
                        <Form.Control
                          asChild
                          type="time"
                          value={newItinerary.end_time}
                          onChange={updateNewItinerary}>
                          <Box asChild height="40px">
                            <TextField.Root>
                              <TextField.Slot />
                              <TextField.Slot />
                            </TextField.Root>
                          </Box>
                        </Form.Control>
                      </Form.Field>
                    </Grid>

                    <Form.Field name="location">
                      <Form.Label asChild>
                        <Box asChild mb="6px" >
                          <Text size="2" weight="medium">Location</Text>
                        </Box>
                      </Form.Label>
                      <Form.Control
                        asChild
                        type="text"
                        value={newItinerary.location}
                        onChange={updateNewItinerary}>
                        <Box asChild height="40px">
                          <TextField.Root>
                            <TextField.Slot />
                            <TextField.Slot />
                          </TextField.Root>
                        </Box>
                      </Form.Control>
                    </Form.Field>

                    <Form.Field name="notes">
                      <Form.Label asChild>
                        <Box asChild mb="6px" >
                          <Text size="2" weight="medium">Notes</Text>
                        </Box>
                      </Form.Label>
                      <Form.Control
                        asChild
                        type="text"
                        value={newItinerary.notes}
                        onChange={updateNewItinerary}>
                        <Box asChild height="100px" p="2px">
                          <TextArea size="2" />
                        </Box>
                      </Form.Control>
                    </Form.Field>

                    <Form.Field name="tag">
                      <Form.Label asChild>
                        <Box asChild mb="6px" >
                          <Text size="2" weight="medium">Tag</Text>
                        </Box>
                      </Form.Label>
                      <Box asChild height="40px">
                        <Select.Root defaultValue="no-tag" onValueChange={updateTagSelection}>
                          <Select.Trigger radius="medium" />
                          <Select.Content>
                            <Select.Item value="no-tag">No tag</Select.Item>
                            <Select.Item value="visit">Visit</Select.Item>
                            <Select.Item value="food">Food</Select.Item>
                            <Select.Item value="accommodation">Accommdation</Select.Item>
                            <Select.Item value="transit">Transit</Select.Item>
                            <Select.Item value="other">Other</Select.Item>
                          </Select.Content>
                        </Select.Root>
                      </Box>
                    </Form.Field>
                  </Flex>

                  <Flex gap="16px" mt="30px" justify="end">
                    <Dialog.Close>
                      <Button size="3" variant="soft" color="gray">
                        Cancel
                      </Button>
                    </Dialog.Close>
                    <Button size="3" variant="solid" onClick={handleNewItinerary}>
                      Add
                    </Button>
                  </Flex>
                </Form.Root>

              </Dialog.Content>
            </Dialog.Root>

          </Flex>

          {travelPlan?.itineraries?.length > 0 ? (
            <Flex direction="column" gap="40px">
              {travelPlan.itineraries.map((item) => (
                <ItineraryCard
                  key={item.id}
                  itinerary={item}
                  travelTitle={travelPlan.title}
                  onUpdate={getTravelPlan} />
              ))}
            </Flex>
          ) : (
            <Text size="3" color="gray">No itineraries available.</Text>
          )}

        </Flex>
      </Box>
    </Panel>
  );
}

export default TravelPlanner;