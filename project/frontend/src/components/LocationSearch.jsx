import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";

import { Flex, TextField, Button, Box, Text, Card, Separator, Grid, ScrollArea, Popover, Inset, Spinner } from "@radix-ui/themes";
import axios from "axios";

import { useSettings } from "../hooks/SettingsProvider";

function LocationSearch({ selectedLocation, onSelectLocation }) {

  const settings = useSettings();

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [query, setQuery] = useState(selectedLocation || "");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchLocation = async () => {
    setIsLoading(true);
    axios
      .get(`https://nominatim.openstreetmap.org/search.php?q=${query}&format=jsonv2`)
      .then((response) => {
        setResults(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching location data:", error);
        setIsLoading(false);
      });
  };

  const handleLocationQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSelectLocation = (location) => {
    let locationUrl = "";
    switch (settings.mapProvider) {
      case "applemaps":
        locationUrl = `https://maps.apple.com/?q=${location.lat},${location.lon}`;
        break;
      case "googlemaps":
        const jointDisplayName = location.display_name.split(" ").join("+");
        locationUrl = `https://www.google.com/maps/search/?api=1&query=${jointDisplayName}`;
        break;
      case "openstreetmap":
        locationUrl = `https://www.openstreetmap.org/?#map=19/${location.lat}/${location.lon}`;
        break;
    }
    if (onSelectLocation) {
      onSelectLocation(location, locationUrl); // Pass the selected location back to the parent
    }
    setQuery(location.display_name);
    setIsPopoverOpen(false);
  };

  return (
    <Popover.Root open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>

      <Flex direction="column" align="center" gap="20px" style={{ zIndex: 1 }}>
        <Grid width="100%" flow="column" gap="20px">
          <Box asChild height="40px">
            <TextField.Root
              type="text"
              value={query}
              onChange={handleLocationQueryChange}
              placeholder="Enter location...">
              <TextField.Slot></TextField.Slot>
              <TextField.Slot></TextField.Slot>
            </TextField.Root>
          </Box>
          <Popover.Trigger asChild>
            <Box asChild width="80px" height="40px">
              <Button onClick={searchLocation}>Search</Button>
            </Box>
          </Popover.Trigger>
        </Grid>
      </Flex>


      <Popover.Content width="400px" maxHeight="400px">
        <Inset>
          <Flex direction="column" align="center" gap="20px">

            <Flex width="100%" direction="column" gap="10px" p="10px">
              {results.length > 0 ? (
                <>
                  {results.map((result, index) => (
                    <Fragment key={index}>
                      <Box asChild width="402px">
                        <Card asChild variant="ghost" >
                          <Link onClick={() => handleSelectLocation(result)}>
                            <Flex direction="column" p="10px">
                              <Text size="4">{result.name}</Text>
                              <Text size="2" color="gray">{result.display_name}</Text>
                            </Flex>
                          </Link>
                        </Card>
                      </Box>
                      {index < results.length - 1 && (
                        <Separator orientation="horizontal" size="4" color="gray" width="100%" />
                      )}
                    </Fragment>
                  ))}
                </>
              ) : (
                <Spinner loading={isLoading}>
                  <Flex direction="column" justify="center" height="40px">
                    <Text size="2" color="gray" align="center">
                      <i>No results found</i>
                    </Text>
                  </Flex>
                </Spinner>
              )}
            </Flex>
          </Flex>
        </Inset>
      </Popover.Content>

    </Popover.Root>
  );
}

export default LocationSearch;
