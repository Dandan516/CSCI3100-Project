import PropTypes from "prop-types";
import { useState } from "react";

import axios from "axios";
import { Form } from "radix-ui";
import { Text, Flex, Box, Button, Card, Heading, DataList, Badge, Link, IconButton, Dialog, TextField, Grid, TextArea } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

import * as Icons from "../assets/Icons";

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

function ItineraryCard({ itinerary, travelTitle, onUpdate }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState(itinerary);

  const matchBadgeColor = () => {
    switch (itinerary.tag) {
      case "accommodation":
        return "blue";
      case "transit":
        return "green";
      case "visit":
        return "orange";
      case "food":
        return "red";
      default:
        return "gray";
    }
  };

  const updateFormData = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    axios
      .put(`${import.meta.env.VITE_API_URL}travel/${travelTitle}/itineraries/${itinerary.id}/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        })
      .then((response) => {
        onUpdate(formData); // Notify parent component about the update
        setIsDialogOpen(false); // Close the dialog
      })
      .catch((error) => {
        console.error("Error updating itinerary:", error);
      });
  };

  return (
    <Box asChild>
      <Card>
        <Flex p="20px" direction="column" gap="30px" align="start">
          <Flex width="100%" direction="row" justify="between" align="center" gap="20px">
            <Heading as="h3" size="6" weight="medium">{itinerary.activity}</Heading>
            <Flex>
              <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <Dialog.Trigger asChild>
                  <IconButton
                    variant="soft"
                    color="gray"
                    radius="medium"
                    size="2">
                    <Icons.Pencil />
                  </IconButton>
                </Dialog.Trigger>
                <Dialog.Content size="3" maxWidth="600px">
                  <Box asChild p="6px" pb="16px">
                    <Dialog.Title>Edit Itinerary</Dialog.Title>
                  </Box>
                  <Dialog.Description></Dialog.Description>
                  <Form.Root className="FormRoot">
                    <Flex direction="column" gap="20px">

                      <Form.Field name="activity">
                        <Form.Label asChild>
                          <Box asChild mb="10px" ml="6px">
                            <Text size="2" weight="medium">Activity</Text>
                          </Box>
                        </Form.Label>
                        <Form.Control
                          asChild
                          type="text"
                          value={formData.activity}
                          onChange={updateFormData}>
                          <Box asChild height="40px">
                            <TextField.Root>
                              <TextField.Slot pl="10px" />
                              <TextField.Slot >
                                <Text size="1" color="gray" mr="4px">
                                  {formData.activity.length} / 60
                                </Text>
                              </TextField.Slot>
                            </TextField.Root>
                          </Box>
                        </Form.Control>
                      </Form.Field>

                      <Grid flow="column" gap="20px" columns={2}>
                        <Form.Field name="date">
                          <Form.Label asChild>
                            <Box asChild mb="10px" ml="6px">
                              <Text size="2" weight="medium">Start Date</Text>
                            </Box>
                          </Form.Label>
                          <Form.Control
                            asChild
                            type="date"
                            value={formData.date}
                            onChange={updateFormData}>
                            <Box asChild height="40px">
                              <TextField.Root>
                                <TextField.Slot pl="10px" />
                                <TextField.Slot pr="10px" />
                              </TextField.Root>
                            </Box>
                          </Form.Control>
                        </Form.Field>

                        <Form.Field name="start_time">
                          <Form.Label asChild>
                            <Box asChild mb="10px" ml="6px">
                              <Text size="2" weight="medium">Start Time</Text>
                            </Box>
                          </Form.Label>
                          <Form.Control
                            asChild
                            type="time"
                            value={formData.start_time}
                            onChange={updateFormData}>
                            <Box asChild height="40px">
                              <TextField.Root>
                                <TextField.Slot pl="10px" />
                                <TextField.Slot pr="10px" />
                              </TextField.Root>
                            </Box>
                          </Form.Control>
                        </Form.Field>
                      </Grid>

                      <Grid flow="column" gap="20px" columns={2}>
                        <Form.Field name="date">
                          <Form.Label asChild>
                            <Box asChild mb="10px" ml="6px">
                              <Text size="2" weight="medium">End Date</Text>
                            </Box>
                          </Form.Label>
                          <Form.Control
                            asChild
                            type="date"
                            value={formData.date}
                            onChange={updateFormData}>
                            <Box asChild height="40px">
                              <TextField.Root>
                                <TextField.Slot pl="10px" />
                                <TextField.Slot pr="10px" />
                              </TextField.Root>
                            </Box>
                          </Form.Control>
                        </Form.Field>

                        <Form.Field name="end_time">
                          <Form.Label asChild>
                            <Box asChild mb="10px" ml="6px">
                              <Text size="2" weight="medium">End Time</Text>
                            </Box>
                          </Form.Label>
                          <Form.Control
                            asChild
                            type="time"
                            value={formData.end_time}
                            onChange={updateFormData}>
                            <Box asChild height="40px">
                              <TextField.Root>
                                <TextField.Slot pl="10px" />
                                <TextField.Slot pr="10px" />
                              </TextField.Root>
                            </Box>
                          </Form.Control>
                        </Form.Field>
                      </Grid>

                      <Form.Field name="location">
                        <Form.Label asChild>
                          <Box asChild mb="10px" ml="6px">
                            <Text size="2" weight="medium">Location</Text>
                          </Box>
                        </Form.Label>
                        <Form.Control
                          asChild
                          type="text"
                          value={formData.location}
                          onChange={updateFormData}>
                          <Box asChild height="40px">
                            <TextField.Root>
                              <TextField.Slot pl="10px" />
                              <TextField.Slot pr="10px" />
                            </TextField.Root>
                          </Box>
                        </Form.Control>
                      </Form.Field>

                      <Form.Field name="notes">
                        <Form.Label asChild>
                          <Box asChild mb="10px" ml="6px">
                            <Text size="2" weight="medium">Notes</Text>
                          </Box>
                        </Form.Label>
                        <Form.Control
                          asChild
                          type="text"
                          value={formData.notes}
                          onChange={updateFormData}>
                          <Box asChild height="100px" mx="10px" p="2px">
                            <TextArea size="2" />
                          </Box>
                        </Form.Control>
                      </Form.Field>

                      <Form.Field name="tag">
                        <Form.Label asChild>
                          <Box asChild mb="10px" ml="6px">
                            <Text size="2" weight="medium">Tag</Text>
                          </Box>
                        </Form.Label>
                        <Form.Control
                          asChild
                          type="text"
                          value={formData.tag}
                          onChange={updateFormData}>
                          <Box asChild height="40px">
                            <TextField.Root>
                              <TextField.Slot pl="10px" />
                              <TextField.Slot pr="10px" />
                            </TextField.Root>
                          </Box>
                        </Form.Control>
                      </Form.Field>
                    </Flex>

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
                  </Form.Root>
                </Dialog.Content>
              </Dialog.Root>

            </Flex>
          </Flex>

          <DataList.Root size="3">

            <DataList.Item>
              <DataList.Label minWidth="88px">Date</DataList.Label>
              <DataList.Value>
                <Text size="3">{itinerary.date}</Text>
              </DataList.Value>
            </DataList.Item>

            <DataList.Item>
              <DataList.Label minWidth="88px">Time</DataList.Label>
              <DataList.Value>
                <Text size="3">
                  {itinerary.start_time} - {itinerary.end_time}
                </Text>
              </DataList.Value>
            </DataList.Item>

            <DataList.Item>
              <DataList.Label minWidth="88px">Location</DataList.Label>
              <DataList.Value>
                <Link target="_blank" href="https://workos.com">
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
                <Badge color={matchBadgeColor()} variant="soft" radius="medium" size="2">
                  {itinerary.tag}
                </Badge>
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
    activity: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    start_time: PropTypes.string.isRequired,
    end_time: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    notes: PropTypes.string,
    tag: PropTypes.string,
  }).isRequired,
  travelTitle: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default ItineraryCard;