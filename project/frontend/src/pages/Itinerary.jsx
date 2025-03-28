import React, { useState, useMemo } from 'react';
import { Text, Flex, Box, Table, Button, Dialog, TextField, Heading, Inset } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { themeQuartz, colorSchemeDarkBlue, AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';

import Panel from '../components/Panel';
import '../App.css';

ModuleRegistry.registerModules([AllCommunityModule]);

function Itinerary() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItineraryName, setNewItineraryName] = useState("");
  const gridTheme = themeQuartz
    .withPart(colorSchemeDarkBlue)
    .withParams({
      headerHeight: 50,
      rowHeight: 50,
      fontSize: 16,
      backgroundColor: 'rgba(40, 40, 40, 0.22)',
    });

  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState([
    { title: "Trip to Thailand", lastModified: "2025-03-12" },
    { title: "Road trip in Texas", lastModified: "2024-02-03" },
    { title: "Europe backpack trip", lastModified: "2023-14-41" },
  ]);

  // const columnTypes = useMemo(() => {
  //   return {
  //     lastModified: {
  //       valueFormatter: DateFormatter, 
  //     }
  //   };
  // }, []);


  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    {
      field: "title", 
      resizable: false, 
      sortable: true, 
      flex: 4,
      cellDataType: 'text',
    },
    { 
      field: "lastModified", 
      resizable: false, 
      sortable: true, 
      flex: 1,
      cellDataType: 'dateString',
    },
  ]);

  const handleCreateItinerary = () => {
    if (newItineraryName.trim()) {
      alert(`New itinerary created: ${newItineraryName}`);
      setNewItineraryName("");
      setIsDialogOpen(false);
    }
  };

  return (
    <Panel>

      <Box asChild width="100%" my="60px">
        <Flex direction="column" align="start" gap="60px">
          <Box asChild width="100%" p="100px">
            <Flex
              direction="column"
              align="start"
              justify="center"
              gap="40px"
              style={{
                backgroundImage: "url('/images/universe-1566161_640.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                marginTop: "-60px",
              }}>
              <Text size="8" weight="bold" color="white">
                Travel Itinerary
              </Text>
              <Text size="5" color="white" maxWidth="600px">
                Plan your trips effortlessly with our itinerary planner. Create, view, and manage your travel plans all in one place.
              </Text>

              <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>

                <Dialog.Trigger asChild>
                  <Box asChild height="60px" px="30px">
                    <Button size="3" variant="solid">
                      <Text size="5" weight="medium">
                        Create New Itinerary
                      </Text>
                    </Button>
                  </Box>
                </Dialog.Trigger>

                <Flex asChild direction="column" gap="10px">
                  <Dialog.Content size="3" maxWidth="450px">
                    <Box asChild p="4px">
                      <Dialog.Title>Create New Itinerary</Dialog.Title>
                    </Box>
                    <Box asChild height="40px">
                      <TextField.Root
                        value={newItineraryName}
                        onChange={(e) => setNewItineraryName(e.target.value)}
                        placeholder="Enter title for new itinerary...">
                        <TextField.Slot pl="8px" />
                        <TextField.Slot pr="8px" />
                      </TextField.Root>
                    </Box>


                    <Flex gap="3" mt="4" justify="end">
                      <Dialog.Close>
                        <Box asChild px="20px">
                          <Button size="3" variant="soft" color="gray">
                            Cancel
                          </Button>
                        </Box>

                      </Dialog.Close>
                      <Box asChild px="20px">
                        <Button size="3" onClick={handleCreateItinerary}>
                          Create
                        </Button>
                      </Box>
                    </Flex>
                  </Dialog.Content>
                </Flex>
              </Dialog.Root>
            </Flex>
          </Box>

          <Box asChild width="100%" px="60px">
            <Heading size="7" weight="medium">
              Your itineraries
            </Heading>
          </Box>

          <Box width="100%" px="60px" style={{ overflowX: "auto" }}>
            <AgGridReact
              style={{ width: "100%", height: `${rowData.length * 50}px` }}
              theme={gridTheme}
              rowData={rowData}
              // columnTypes={columnTypes}
              columnDefs={colDefs}
              domLayout="autoHeight"
            />
          </Box>
        </Flex>
      </Box>
    </Panel>
  );
}

export default Itinerary;
