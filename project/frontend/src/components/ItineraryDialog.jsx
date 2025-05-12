import * as Form from "@radix-ui/react-form";
import { TextField, TextArea, Button, Box, Flex, Grid, Text, Dialog, Select } from "@radix-ui/themes";
import PropTypes from "prop-types";

import LocationSearch from "./LocationSearch"; 
import { itineraryTags } from "../utils/itineraryTags";

function ItineraryDialog({
  mode,
  itinerary,
  setItinerary,
  isDialogOpen,
  setIsDialogOpen,
  handleSave,
  travelStartDate,
  travelEndDate,
}) {
  const dialogTitle = mode === "edit" ? "Edit Itinerary" : "New Itinerary";
  const updateItinerary = (e) => {
    const { name, value } = e.target;
    if (name === "title" && value.length > 100) {
      return; // Prevent updating if the description exceeds 100 characters
    }
    setItinerary({
      ...itinerary,
      [name]: value,
    });
  };
  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      
      <Dialog.Content size="3" maxWidth="600px">
        <Box asChild p="10px">
          <Dialog.Title>
            {dialogTitle}
          </Dialog.Title>
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
                value={itinerary.title || ""}
                onChange={updateItinerary}>
                <Box asChild height="40px">
                  <TextField.Root>
                    <TextField.Slot />
                    <TextField.Slot >
                      <Text size="1" color="gray" mr="4px">
                        {itinerary.title.length} / 100
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
                  value={itinerary.start_date || ""}
                  min={travelStartDate}
                  max={itinerary.end_date ? itinerary.end_date : travelEndDate}
                  onChange={updateItinerary}>
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
                  value={itinerary.start_time || ""}
                  onChange={updateItinerary}>
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
                  value={itinerary.end_date || itinerary.start_date || ""}
                  min={itinerary.start_date ? itinerary.start_date : travelStartDate}
                  max={travelEndDate}
                  onChange={updateItinerary}>
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
                  value={itinerary.end_time || ""}
                  onChange={updateItinerary}>
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
                selectedLocation={itinerary.location || ""}
                onSelectLocation={(location, locationUrl) => {
                  setItinerary({
                    ...itinerary,
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
                value={itinerary.notes || ""}
                onChange={updateItinerary}>
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
                    setItinerary({
                      ...itinerary,
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
              onClick={handleSave}
              className={itinerary.title === "" && "no-click"}
              disabled={itinerary.title === ""}>
              Save
            </Button>
          </Flex>
        </Form.Root>

      </Dialog.Content>
    </Dialog.Root>
  );
}

ItineraryDialog.propTypes = {
  mode: PropTypes.string.isRequired,
  itinerary: PropTypes.object.isRequired,
  setItinerary: PropTypes.func.isRequired,
  isDialogOpen: PropTypes.bool.isRequired,
  setIsDialogOpen: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  travelStartDate: PropTypes.string.isRequired,
  travelEndDate: PropTypes.string.isRequired,
};

export default ItineraryDialog;