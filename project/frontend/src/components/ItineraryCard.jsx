import PropTypes from "prop-types";
import { useState } from "react";

import axios from "axios";
import { Form } from "radix-ui";
import { Text, Flex, Box, Button, Card, Heading, DataList, Badge, Link, IconButton, Dialog, TextField, Grid, TextArea, Select, Tooltip } from "@radix-ui/themes";

import * as Icons from "../assets/Icons";
import { useAuth } from "../hooks/AuthProvider";
import LocationSearch from "../components/LocationSearch";
import { itineraryTags } from "../utils/itineraryTags";

const formatTime = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
};

const matchBadgeColor = (tag) => {
  return itineraryTags.find((t) => t.value === tag)?.color || "gray";
};

function ItineraryCard({ itinerary, travelId, travelStartDate, travelEndDate, onUpdate }) {

  const auth = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItinerary, setEditingItinerary] = useState(itinerary);

  const updateEditingItinerary = (e) => {
    const { name, value } = e.target;
    if (name === "title" && value.length > 100) {
      return;
    }
    setEditingItinerary({
      ...editingItinerary,
      [name]: value,
    });
  };

  const handleSaveItinerary = async () => {
    axios
      .put(`${import.meta.env.VITE_API_URL}travel/${travelId}/itineraries/${itinerary.id}/`, editingItinerary, {
        headers: { Authorization: `Token ${auth.token}` },
      })
      .then((response) => {
        onUpdate(editingItinerary); // Notify parent component about the update
        setIsEditDialogOpen(false); // Close the dialog
      })
      .catch((error) => {
        console.error("Error updating itinerary:", error);
      });
  }

  const handleDeleteItinerary = async () => {
    axios
      .delete(`${import.meta.env.VITE_API_URL}travel/${travelId}/itineraries/${itinerary.id}/`, {
        headers: { Authorization: `Token ${auth.token}` },
      })
      .then(() => {
        onUpdate(editingItinerary); // Notify parent component about the update
        setIsEditDialogOpen(false); // Close the dialog
      })
      .catch((error) => {
        console.error("Error deleting itinerary:", error);
      });
  }

  return (
    <Box asChild>
      <Card>
        <Flex direction="column" gap="30px" align="start" p="20px" pt="10px">

          <Flex width="100%" direction="row" justify="between" align="center" gap="20px">
            <Heading as="h3" size="6" weight="medium">{itinerary.title}</Heading>
            <Flex>

              <Grid flow="column" gap="16px" columns={2}>

                <Dialog.Root open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <Tooltip content="Edit itinerary">
                    <Dialog.Trigger asChild>
                      <IconButton
                        variant="soft"
                        radius="medium"
                        color="gray"
                        size="3">
                        <Icons.Pencil24 />
                      </IconButton>
                    </Dialog.Trigger>
                  </Tooltip>
                  <Dialog.Content size="3" maxWidth="600px">
                    <Box asChild p="10px">
                      <Dialog.Title>Edit Itinerary</Dialog.Title>
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
                            value={editingItinerary.title || ""}
                            onChange={updateEditingItinerary}>
                            <Box asChild height="40px">
                              <TextField.Root>
                                <TextField.Slot />
                                <TextField.Slot >
                                  <Text size="1" color="gray" mr="4px">
                                    {editingItinerary.title.length} / 100
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
                              value={editingItinerary.start_date || ""}
                              min={travelStartDate}
                              max={travelEndDate}
                              onChange={updateEditingItinerary}>
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
                              value={editingItinerary.start_time || ""}
                              onChange={updateEditingItinerary}>
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
                              value={editingItinerary.end_date || ""}
                              min={travelStartDate}
                              max={travelEndDate}
                              onChange={updateEditingItinerary}>
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
                              value={editingItinerary.end_time || ""}
                              onChange={updateEditingItinerary}>
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
                            selectedLocation={editingItinerary.location || ""}
                            onSelectLocation={(location, locationUrl) => {
                              setEditingItinerary({
                                ...editingItinerary,
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
                            value={editingItinerary.notes || ""}
                            onChange={updateEditingItinerary}>
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
                              defaultValue={itinerary.tag || "no-tag"}
                              onValueChange={(value) => {
                                setEditingItinerary({
                                  ...editingItinerary,
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

                      <Flex gap="16px" mt="20px" justify="end">
                        <Dialog.Close>
                          <Button size="3" variant="soft" color="gray">
                            Cancel
                          </Button>
                        </Dialog.Close>
                        <Button
                          size="3"
                          variant="solid"
                          onClick={handleSaveItinerary}
                          className={editingItinerary.title === "" && "no-click"}
                          disabled={editingItinerary.title === ""}>
                          Save
                        </Button>
                      </Flex>
                    </Form.Root>

                  </Dialog.Content>
                </Dialog.Root>

                <Dialog.Root open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <Tooltip content="Delete itinerary">
                    <Dialog.Trigger asChild>
                      <IconButton
                        variant="soft"
                        color="red"
                        radius="medium"
                        size="3">
                        <Icons.Trash24 />
                      </IconButton>
                    </Dialog.Trigger>
                  </Tooltip>
                  <Dialog.Content size="3" maxWidth="600px">
                    <Box asChild p="10px" pb="0px">
                      <Dialog.Title>Delete Itinerary</Dialog.Title>
                    </Box>

                    <Box asChild px="10px">
                      <Dialog.Description >
                        Are you sure you want to delete this itinerary? This action cannot be undone.
                      </Dialog.Description>
                    </Box>

                    <Flex gap="16px" mt="20px" justify="end">
                      <Dialog.Close>
                        <Button size="3" variant="soft" color="gray">
                          Cancel
                        </Button>
                      </Dialog.Close>
                      <Button size="3" variant="solid" color="red" onClick={handleDeleteItinerary}>
                        Delete
                      </Button>
                    </Flex>
                  </Dialog.Content>
                </Dialog.Root>

              </Grid>
            </Flex>
          </Flex>

          <DataList.Root size="3">

            <DataList.Item>
              <DataList.Label minWidth="88px">Start</DataList.Label>
              <DataList.Value>
                <Grid flow="column" gap="20px" columns={2}>
                  {!(itinerary.start_date || itinerary.start_time) && (
                    <Text size="3">
                      -
                    </Text>
                  )}
                  {itinerary.start_date && (
                    <Text size="3"> {itinerary.start_date} </Text>
                  )}
                  {itinerary.start_time && (
                    <Text size="3"> {formatTime(itinerary.start_time)} </Text>
                  )}
                </Grid>
              </DataList.Value>
            </DataList.Item>

            <DataList.Item>
              <DataList.Label minWidth="88px">End</DataList.Label>
              <DataList.Value>
                <Grid flow="column" gap="20px" columns={2}>
                  {!(itinerary.end_date || itinerary.end_time) && (
                    <Text size="3"> - </Text>
                  )}
                  {itinerary.end_date && (
                    <Text size="3"> {itinerary.end_date} </Text>
                  )}
                  {itinerary.end_time && (
                    <Text size="3"> {formatTime(itinerary.end_time)} </Text>
                  )}
                </Grid>
              </DataList.Value>
            </DataList.Item>

            <DataList.Item>
              <DataList.Label minWidth="88px">Location</DataList.Label>
              <DataList.Value>
                <Link
                  className="radix-ui-link"
                  onClick={() => window.open(itinerary.location_url, "_blank")}>
                  <Text size="3">{itinerary.location}</Text>
                </Link>
              </DataList.Value>
            </DataList.Item>

            <DataList.Item>
              <DataList.Label minWidth="88px">Notes</DataList.Label>
              <DataList.Value>
                <Text size="3">{itinerary.notes}</Text>
              </DataList.Value>
            </DataList.Item>

            <DataList.Item>
              <DataList.Label minWidth="88px">Tag</DataList.Label>
              <DataList.Value>
                {itinerary.tag && (
                  <Badge color={matchBadgeColor(itinerary.tag)} variant="soft" radius="medium" size="2">
                    {itinerary.tag}
                  </Badge>
                )}
              </DataList.Value>
            </DataList.Item>
          </DataList.Root>

        </Flex>
      </Card>
    </Box>
  );
}

ItineraryCard.propTypes = {
  itinerary: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    start_date: PropTypes.string.isRequired,
    start_time: PropTypes.string.isRequired,
    end_date: PropTypes.string.isRequired,
    end_time: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    location_lat: PropTypes.string.isRequired,
    location_lon: PropTypes.string.isRequired,
    location_url: PropTypes.string.isRequired,
    notes: PropTypes.string,
    tag: PropTypes.string,
  }).isRequired,
  travelId: PropTypes.number.isRequired, 
  travelStartDate: PropTypes.string.isRequired, 
  travelEndDate: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default ItineraryCard;