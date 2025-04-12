import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";

import axios from 'axios';
import { Text, Flex, Box, Button, TextField, Heading, TextArea, Grid, Dialog, IconButton, Select, Tabs } from "@radix-ui/themes";

import { Form } from "radix-ui";

import { useAuth } from "../hooks/AuthProvider";
import Panel from '../components/Panel';
import ItineraryCard from '../components/ItineraryCard';
import * as Icons from "../assets/Icons";
import DailyView from '../components/DailyView';
import LocationSearch from '../components/LocationSearch';

function TravelPlanner() {

  const auth = useAuth();
  const params = useParams([]);
  // const navigate = useNavigate();

  const [isEditTravelDialogOpen, setIsEditTravelDialogOpen] = useState(false);
  const [isNewItineraryDialogOpen, setIsNewItineraryDialogOpen] = useState(false);
  const [isInviteCollaboratorDialogOpen, setIsInviteCollaboratorDialogOpen] = useState(false);

  const [travelPlan, setTravelPlan] = useState({
    id: 0,
    title: '',
    start_date: null,
    end_date: null,
    description: '',
    itineraries: [],
    collaborators: [],
    destination: '',
    image: null,
  });

  const [editingTravelPlan, setEditingTravelPlan] = useState({
    id: 0,
    title: '',
    start_date: null,
    end_date: null,
    description: '',
    itineraries: [],
    collaborators: [],
    destination: '',
    image: null,
  });

  const [newItinerary, setNewItinerary] = useState({
    activity: "",
    date: null,
    start_time: null,
    end_time: null,
    location: {},
    notes: "",
    tag: null,
  });

  const [newCollaborator, setNewCollaborator] = useState({
    email: "",
    status: "pending",
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
    if (name === "description" && value.length > 2000) {
      return; // Prevent updating if the description exceeds 2000 characters
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
        headers: { Authorization: `Token ${auth.token}` },
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

  const getDailyItinerary = (date) => {
    if (!date || !(date instanceof Date)) {
      return [];
    }

    const filteredItineraries = travelPlan.itineraries.filter((itinerary) => {
      const itineraryDate = new Date(itinerary.date);
      return itineraryDate.toDateString() === date.toDateString();
    });
    return filteredItineraries;
  };

  const pendingCollaborators = travelPlan?.collaborators?.filter((collaborator) => collaborator.status === "pending") || [];

  const handleInviteCollaborator = async () => {
    axios
      .post(`${import.meta.env.VITE_API_URL}travel/${travelPlan.id}/invite_collaborator/`, { email: newCollaborator.email}, {
        headers: { Authorization: `Token ${auth.token}`,
                   "Content-Type": "application/json"
       },
      })
      .then((response) => {
        alert("Collaborator invited!", response.data);
        getTravelPlan();
      })
      .catch((error) => {
        console.error("Error adding itinerary:", error);
      });
  }

  return (
    <Panel>
      <Box asChild width="100%" p="80px">
        <Flex direction="column" gap="40px">

          {/* Travel Plan Details */}
          <Flex direction="row" justify="between">

            <Heading size="8" weight="medium">
              {travelPlan?.title}
            </Heading>

            {/* Edit Travel Plan Button */}
            <Flex direction="row" gap="20px" align="center">

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
                        <Text size="1" color="gray" mr="4px">
                          {editingTravelPlan.description.length} / 2000
                        </Text>
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

              <Dialog.Root open={isInviteCollaboratorDialogOpen} onOpenChange={setIsInviteCollaboratorDialogOpen}>
                <Box asChild height="40px">
                  <Button size="3" variant="soft" radius="medium" onClick={() => setIsInviteCollaboratorDialogOpen(true)}>
                    Invite Collaborator
                  </Button>
                </Box>
                <Dialog.Content maxWidth="600px">
                  <Box asChild p="10px">
                    <Dialog.Title>Invite Collaborators</Dialog.Title>
                  </Box>
                  <Box asChild p="10px">
                    <Dialog.Description size="2">
                      Enter the email address of the users you want to invite.
                    </Dialog.Description>
                  </Box>
                  <Grid flow="column" gap="20px" mx="10px">
                    <Box asChild height="40px">
                      <TextField.Root
                        name="newCollaborator"
                        value={newCollaborator.email} onChange={(e) => setNewCollaborator({ ...newCollaborator, email: e.target.value })}>
                        <TextField.Slot />
                      </TextField.Root>
                    </Box>
                    <Button size="3" variant="so" onClick={handleInviteCollaborator}>
                      Invite
                    </Button>
                  </Grid>
                  <Flex direction="column" gap="20px" px="10px" my="30px">
                    <Text size="3" weight="medium">
                      Current Collaborators ({travelPlan?.collaborators?.length || 0})
                    </Text>
                    {travelPlan?.collaborators?.length > 0 ? (
                      travelPlan?.collaborators?.map((collaborator) => (
                        <Flex key={collaborator.id} direction="row" gap="20px" align="center">
                          <Text size="3">{collaborator.email}</Text>
                          <Text size="3" color="gray">{collaborator.status}</Text>
                        </Flex>
                      ))
                    ) : (
                      <Flex asChild justify="center" py="40px">
                        <Text size="3" color="gray">No collaborators available.</Text>
                      </Flex>
                    )}
                  </Flex>
                  <Flex gap="16px" mt="30px" justify="end">
                    <Dialog.Close>
                      <Button size="3" variant="solid">
                        Done
                      </Button>
                    </Dialog.Close>
                  </Flex>
                </Dialog.Content>
              </Dialog.Root>

            </Flex>

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

          <Box height="0px" />

          {/* Itinerary List */}

          <Tabs.Root defaultValue="all">

            <Flex direction="row" align="center" justify="between">

              <Tabs.List>
                <Tabs.Trigger value="all">
                  <Text size="3">All Itineraries</Text>
                </Tabs.Trigger>
                <Tabs.Trigger value="daily">
                  <Text size="3">Daily View</Text>
                </Tabs.Trigger>
              </Tabs.List>

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
                        <LocationSearch
                          onSelectLocation={(location) => {
                            setNewItinerary({
                              ...newItinerary,
                              location: newItinerary.location.display_name,
                            });
                          }}
                        />
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
                          <Select.Root
                            defaultValue="no-tag"
                            onValueChange={(value) => {
                              setNewItinerary({
                                ...newItinerary,
                                tag: value,
                              });
                            }}>
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

            <Tabs.Content value="all">
              {travelPlan?.itineraries?.length > 0 ? (
                <Flex direction="column" gap="40px" py="40px">
                  {travelPlan.itineraries.map((item) => (
                    <ItineraryCard
                      key={item.id}
                      itinerary={item}
                      travelTitle={travelPlan.title}
                      onUpdate={getTravelPlan} />
                  ))}
                </Flex>
              ) : (
                <Flex asChild justify="center" py="60px">
                  <Text size="3" color="gray">No itineraries available.</Text>
                </Flex>
              )}
            </Tabs.Content>

            <Tabs.Content value="daily">
              {travelPlan?.itineraries?.length > 0 ? (
                <DailyView startDate={travelPlan.start_date} endDate={travelPlan.end_date}>
                  {(selectedDate) => (
                    getDailyItinerary(selectedDate).length > 0 ? (
                      <Flex direction="column" gap="40px" pb="40px">
                        {getDailyItinerary(selectedDate).map((item) => (
                          <ItineraryCard
                            key={item.id}
                            itinerary={item}
                            travelTitle={travelPlan.title}
                            onUpdate={getTravelPlan} />
                        ))}
                      </Flex>
                    ) : (
                      <Flex asChild justify="center" py="60px">
                        <Text size="3" color="gray">No itineraries available.</Text>
                      </Flex>
                    )
                  )}
                </DailyView>
              ) : (
                <Flex asChild justify="center" py="60px">
                  <Text size="3" color="gray">No itineraries available.</Text>
                </Flex>
              )}
            </Tabs.Content>

            <Tabs.Content value="upcoming">
              <Text size="3" color="gray">Upcoming itineraries</Text>
            </Tabs.Content>
            <Tabs.Content value="past">
              <Text size="3" color="gray">Past itineraries</Text>
            </Tabs.Content>
          </Tabs.Root>

        </Flex>
      </Box>
    </Panel>
  );
}

export default TravelPlanner;