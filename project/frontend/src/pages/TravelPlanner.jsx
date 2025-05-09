import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

import axios from 'axios';
import { Text, Flex, Box, Button, TextField, Heading, TextArea, Grid, Dialog, Callout, Select, Tabs, Avatar, Card } from "@radix-ui/themes";
import { Form } from "radix-ui";

import { useAuth } from "../hooks/AuthProvider";
import Panel from '../components/Panel';
import ItineraryCard from '../components/ItineraryCard';
import * as Icons from "../assets/Icons";
import DailyView from '../components/DailyView';
import LocationSearch from '../components/LocationSearch';
import { itineraryTags } from '../utils/itineraryTags';

function TravelPlanner() {

  const auth = useAuth();
  const params = useParams([]);

  const [isEditTravelDialogOpen, setIsEditTravelDialogOpen] = useState(false);
  const [isNewItineraryDialogOpen, setIsNewItineraryDialogOpen] = useState(false);s
  const [isInviteCollaboratorDialogOpen, setIsInviteCollaboratorDialogOpen] = useState(false);

  const [travelPlan, setTravelPlan] = useState({
    id: 0,
    title: '',
    start_date: undefined,
    end_date: undefined,
    description: '',
    itineraries: [],
    owner: undefined,
    collaborators: [],
    destination: '',
    image: undefined,
  });

  const [editingTravelPlan, setEditingTravelPlan] = useState({
    title: '',
    start_date: undefined,
    end_date: undefined,
    description: '',
    destination: '',
    image: undefined,
  });

  const [newItinerary, setNewItinerary] = useState({
    title: "",
    start_date: undefined,
    start_time: undefined,
    end_date: undefined,
    end_time: undefined,
    location: "",
    location_lat: undefined,
    location_lon: undefined,
    location_url: undefined,
    notes: "",
    tag: undefined,
  });

  const [newCollaborator, setNewCollaborator] = useState({
    email: "",
    status: "pending",
  });

  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [inviteErrorMessage, setInviteErrorMessage] = useState("");

  const getTravelPlan = async () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}travel/${params.id}/`, {
        headers: { Authorization: `Token ${auth.token}` },
      })
      .then(response => {
        const data = response.data;
        setTravelPlan({
          ...data,
          owner: data.user,
        });
        setEditingTravelPlan({
          title: data.title,
          start_date: data.start_date,
          end_date: data.end_date,
          description: data.description,
          destination: data.destination,
          image: data.image,
        });
        //console.log("Travel plan fetched successfully:", JSON.stringify(data));
      })
      .catch((error) => {
        console.error("Error fetching travel plan:", error);
      });
  };

  const updateEditingTravelPlan = (e) => {
    const { name, value } = e.target;

    // Enforce title length limit
    if (name === "title" && value.length > 100) {
      return;
    }
    if (name === "destination " && value.length > 200) {
      return; // Prevent updating if the destination exceeds 200 characters
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
      .patch(`${import.meta.env.VITE_API_URL}travel/${travelPlan.id}/`, {
        title: editingTravelPlan.title,
        start_date: editingTravelPlan.start_date,
        end_date: editingTravelPlan.end_date,
        description: editingTravelPlan.description,
        destination: editingTravelPlan.destination,
        image: editingTravelPlan.image,
      }, {
        headers: { Authorization: `Token ${auth.token}` },
      })
      .then(() => {
        getTravelPlan();
        setIsEditTravelDialogOpen(false); // Close the dialog
      })
      .catch((error) => {
        console.error("Error updating travel plan:", error);
      });
  };

  const updateNewItinerary = (e) => {

    const { name, value } = e.target;
    if (name === "title" && value.length > 100) {
      return; // Prevent updating if the title exceeds 100 characters
    }
    setNewItinerary({
      ...newItinerary,
      [name]: value,
    });
  };

  const handleNewItinerary = async () => {
    axios
      .post(`${import.meta.env.VITE_API_URL}travel/${travelPlan.id}/itineraries/`, newItinerary, {
        headers: {
          Authorization: `Token ${auth.token}`
        },
        ContentType: "multipart/form-data",
      })
      .then((response) => {
        alert("Itinerary added successfully!", response.data);
        setIsNewItineraryDialogOpen(false);
        getTravelPlan();
      })
      .catch((error) => {
        alert("Error adding itinerary:", error);
      });
  };



  const getDailyItinerary = (date) => {
    if (!date || !(date instanceof Date)) {
      return [];
    }

    const filteredItineraries = travelPlan.itineraries.filter((itinerary) => {
      const startDate = new Date(itinerary.start_date);
      const endDate = new Date(itinerary.end_date);

      // Check if the selected date falls within the itinerary's start and end dates
      return date >= startDate && date <= endDate;
    });

    return filteredItineraries;
  };



  // const pendingCollaborators = travelPlan?.collaborators?.filter((collaborator) => collaborator.status === "pending") || [];

  const handleInviteCollaborator = async () => {
    setInviteErrorMessage("");
    if (newCollaborator.email === "") {
      setInviteErrorMessage("Please enter a valid email.");
      return;
    }
    axios
      .post(`${import.meta.env.VITE_API_URL}travel/${travelPlan.id}/invite_collaborator/`, { email: newCollaborator.email }, {
        headers: {
          Authorization: `Token ${auth.token}`,
          "Content-Type": "application/json"
        },
      })
      .then((response) => {
        setInviteSuccess(true);
        setNewCollaborator({
          ...newCollaborator,
          email: ""
        });
        getTravelPlan();
        setTimeout(() => {
          setInviteSuccess(false);
        }, 2000);
      })
      .catch((error) => {
        console.error("Error adding itinerary:", error);
        const message = JSON.parse(error.request.response).error
        if (message === "User with this email not found") {
          setInviteErrorMessage("User with this email not found.");
        } else if (message === "User is already a collaborator") {
          setInviteErrorMessage("User is already a collaborator.");
        }
        setTimeout(() => {
          setInviteErrorMessage("");
        }, 2000);
      });
  }

  const getUsernames = () => {
    return (
      travelPlan.owner?.username
      + (travelPlan.collaborators?.length > 0 && ", " || "")
      + travelPlan.collaborators?.map((collab) => collab.username).join(", ") || "-"
    );
  }

  useEffect(() => {
    getTravelPlan();
  }, [params.id]);

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
                          value={editingTravelPlan.title || ""} // Default to an empty string
                          onChange={updateEditingTravelPlan}>
                          <Box asChild height="40px">
                            <TextField.Root>
                              <TextField.Slot />
                              <TextField.Slot >
                                <Text size="1" color="gray" mr="4px">
                                  {editingTravelPlan?.title?.length} / 100
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
                            max={editingTravelPlan.end_date}
                            value={editingTravelPlan.start_date || ""} // Default to an empty string
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
                            min={editingTravelPlan.start_date}
                            value={editingTravelPlan.end_date || ""}
                            onChange={updateEditingTravelPlan}>
                            <Box asChild height="40px">
                              <TextField.Root>
                                <TextField.Slot />
                                <TextField.Slot />
                              </TextField.Root>
                            </Box>
                          </Form.Control>
                        </Form.Field>
                      </Grid>

                      <Form.Field name="destination">
                        <Form.Label asChild>
                          <Box asChild mb="6px">
                            <Text size="2" weight="medium">Destination</Text>
                          </Box>
                        </Form.Label>
                        <Form.Control
                          asChild
                          type="text"
                          value={editingTravelPlan.destination || ""} // Default to an empty string
                          onChange={updateEditingTravelPlan}>
                          <Box asChild height="40px">
                            <TextField.Root>
                              <TextField.Slot />
                              <TextField.Slot >
                                <Text size="1" color="gray" mr="4px">
                                  {editingTravelPlan?.destination?.length} / 200
                                </Text>
                              </TextField.Slot>
                            </TextField.Root>
                          </Box>
                        </Form.Control>
                      </Form.Field>

                      <Form.Field name="description">
                        <Form.Label asChild>
                          <Box asChild mb="6px">
                            <Text size="2" weight="medium">Description</Text>
                          </Box>
                        </Form.Label>
                        <Form.Control
                          asChild
                          type="text"
                          value={editingTravelPlan.description || ""}
                          onChange={updateEditingTravelPlan}>
                          <Box asChild height="100px" p="2px">
                            <TextArea size="2" />
                          </Box>
                        </Form.Control>
                        <Text size="1" color="gray" mr="4px">
                          {editingTravelPlan?.description?.length} / 2000
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
                    <Button
                      size="3"
                      variant="solid"
                      onClick={handleSaveTravelPlan}
                      className={editingTravelPlan.title === "" && "no-click"}
                      disabled={editingTravelPlan.title === ""}>
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
                  {(inviteErrorMessage !== "") && (
                    <Box asChild my="10px">
                      <Flex asChild direction="column" align="center" gap="10px">
                        <Callout.Root color="red">
                          <Callout.Icon>
                            <Icons.CrossCircled />
                          </Callout.Icon>
                          <Callout.Text>
                            <Text size="2" color="red" mb="5px">
                              {inviteErrorMessage}
                            </Text>
                          </Callout.Text>
                        </Callout.Root>
                      </Flex>
                    </Box>
                  )}
                  {inviteSuccess && (
                    <Box asChild my="10px">
                      <Flex asChild direction="column" align="center" gap="10px">
                        <Callout.Root color="green">
                          <Callout.Icon>
                            <Icons.Check />
                          </Callout.Icon>
                          <Callout.Text>
                            <Text size="2" color="greed" mb="5px">
                              Collaborator invited successfully!
                            </Text>
                          </Callout.Text>
                        </Callout.Root>
                      </Flex>
                    </Box>
                  )}
                  <Box asChild p="10px">
                    <Dialog.Description size="2">
                      Enter the email of the user you want to invite.
                    </Dialog.Description>
                  </Box>
                  <Grid flow="column" gap="20px" mx="10px">
                    <Box asChild height="40px">
                      <TextField.Root
                        name="newCollaborator"
                        onChange={(e) => setNewCollaborator({ ...newCollaborator, email: e.target.value })}>
                        <TextField.Slot />
                      </TextField.Root>
                    </Box>
                    <Button size="3" variant="so" onClick={handleInviteCollaborator}>
                      Invite
                    </Button>
                  </Grid>
                  <Flex direction="column" gap="10px" px="10px" my="30px">
                    <Text size="3" weight="medium">
                      Current Collaborators ({travelPlan.collaborators?.length + 1 || 1})
                    </Text>
                    <Box width="240px">
                      <Card>
                        <Flex gap="3" align="center">
                          <Avatar
                            size="3"
                            src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
                          />
                          <Box>
                            <Text size="3"> {travelPlan.owner?.username}  (Owner) </Text>
                            <Text as="div" size="2" color="gray"> {travelPlan.owner?.email} </Text>
                          </Box>
                        </Flex>
                      </Card>
                    </Box>
                    {travelPlan.collaborators?.length > 0 ? (
                      travelPlan.collaborators?.map((collaborator) => (
                        <Flex key={collaborator.username} direction="row" gap="20px" align="center">
                          <Box width="240px">
                            <Card>
                              <Flex gap="3" align="center">
                                <Avatar
                                  size="3"
                                  src=""
                                />
                                <Box>
                                  <Text size="3"> {collaborator.username} </Text>
                                  <Text as="div" size="2" color="gray"> {collaborator?.email} </Text> 
                                </Box>
                              </Flex>
                            </Card>
                          </Box>
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
            <Text size="3">{travelPlan?.destination || "-"}</Text>
            <Box width="30px" />
            <Icons.Person20></Icons.Person20>
            <Text size="3">{getUsernames() || "No collaborators yet."}</Text>
          </Flex>

          <Box asChild maxWidth="100vw">
            {travelPlan?.description ? (
              <Text as="p" size="3" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {travelPlan.description}
              </Text>
            ) : (
              <Text as="p" size="3" color="gray" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                <i>Add a description to your travel plan...</i>
              </Text>
            )}
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

                      <Form.Field name="title">
                        <Form.Label asChild>
                          <Box asChild mb="6px" >
                            <Text size="2" weight="medium">Title</Text>
                          </Box>
                        </Form.Label>
                        <Form.Control
                          asChild
                          type="text"
                          value={newItinerary.title || ""} // Default to an empty string
                          onChange={updateNewItinerary}>
                          <Box asChild height="40px">
                            <TextField.Root>
                              <TextField.Slot />
                              <TextField.Slot >
                                <Text size="1" color="gray" mr="4px">
                                  {newItinerary.title?.length} / 100
                                </Text>
                              </TextField.Slot>
                            </TextField.Root>
                          </Box>
                        </Form.Control>
                      </Form.Field>

                      <Grid flow="column" gap="20px" columns={2}>
                        <Form.Field name="start_date">
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
                            // value={newItinerary.date}
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
                            // value={newItinerary.start_time}
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
                        <Form.Field name="end_date">
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
                            // value={newItinerary.date}
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
                            // value={newItinerary.end_time}
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
                          defaultValue={newItinerary.location}
                          onSelectLocation={(location, locationUrl) => {
                            setNewItinerary({
                              ...newItinerary,
                              location: location.display_name,
                              location_lat: location.lat,
                              location_lon: location.lon,
                              location_url: locationUrl,
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
                              {itineraryTags.map((tag) => (
                                <Select.Item key={tag.value} value={tag.value}>{tag.label}</Select.Item>
                              ))}
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
                      <Button
                        size="3"
                        variant="solid"
                        onClick={handleNewItinerary}
                        className={newItinerary.title === "" && "no-click"}
                        disabled={newItinerary.title === ""}>
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
                  {travelPlan.itineraries?.map((item) => (
                    <ItineraryCard
                      key={item.id}
                      itinerary={item}
                      travelId={travelPlan.id}
                      travelStartDate={travelPlan.start_date}
                      travelEndDate={travelPlan.end_date}
                      onUpdate={getTravelPlan} />
                  ))}
                </Flex>
              ) : (
                <Flex asChild justify="center" py="120px">
                  <Text size="3" color="gray">No itineraries available.</Text>
                </Flex>
              )}
            </Tabs.Content>

            <Tabs.Content value="daily">
              {(travelPlan?.itineraries?.length > 0 && travelPlan.start_date && travelPlan.end_date) ? (
                <DailyView startDate={travelPlan.start_date} endDate={travelPlan.end_date}>
                  {(selectedDate) => (
                    getDailyItinerary(selectedDate)?.length > 0 ? (
                      <Flex direction="column" gap="40px" pb="40px">
                        {getDailyItinerary(selectedDate).map((item) => (
                          <ItineraryCard
                            key={item.id}
                            itinerary={item}
                            travelId={travelPlan.id}
                            travelStartDate={travelPlan.start_date}
                            travelEndDate={travelPlan.end_date}
                            onUpdate={getTravelPlan}
                          />
                        ))}
                      </Flex>
                    ) : (
                      <Flex asChild justify="center" py="120px">
                        <Text size="3" color="gray">No itineraries available for this day.</Text>
                      </Flex>
                    )
                  )}
                </DailyView>
              ) : (
                <>
                  {!(travelPlan.start_date && travelPlan.end_date) ? (
                    <Flex asChild justify="center" py="120px">
                      <Text size="3" color="gray">Set Start Date & End Date to enable Daily View.</Text>
                    </Flex>
                  ) : (
                    <Flex asChild justify="center" py="120px">
                      <Text size="3" color="gray">No itineraries yet.</Text>
                    </Flex>
                  )}
                </>
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