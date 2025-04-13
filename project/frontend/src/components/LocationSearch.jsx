import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Flex, TextField, Button, Box, Text, Card, Separator, Grid, ScrollArea, Popover, Inset, Spinner } from "@radix-ui/themes";
import axios from "axios";

function LocationSearch({ onSelectLocation }) {
  const [query, setQuery] = useState("");
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
    if (onSelectLocation) {
      onSelectLocation(location); // Pass the selected location back to the parent
    }
    setQuery(location.display_name);
  };

  return (
    <Popover.Root>

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


      <Popover.Content width="400px" maxHeight="600px">
        <Inset>
          <Flex direction="column" align="center" gap="20px">

            <Flex width="100%" direction="column" gap="10px" p="10px">
              {results.length > 0 ? (
                <>
                  {results.map((result, index) => (
                    <>
                      <Box asChild width="402px">
                        <Card asChild variant="ghost" >
                          <Link key={index} onClick={() => handleSelectLocation(result)}>
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
                    </>
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
