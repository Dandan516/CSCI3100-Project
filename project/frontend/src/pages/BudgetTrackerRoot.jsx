import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Text, Flex, Box, Grid, Button, Dialog, TextField, Heading, IconButton, DropdownMenu, Card, Inset, Popover } from "@radix-ui/themes";

import { themeQuartz, colorSchemeDarkBlue, AllCommunityModule, ClientSideRowModelModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';

import Panel from '../components/Panel';

import { useAuth } from "../hooks/AuthProvider";
import * as Icons from '../assets/Icons';

ModuleRegistry.registerModules([AllCommunityModule, ClientSideRowModelModule]);

function BudgetTrackerRoot() {

  const auth = useAuth();
  const navigate = useNavigate();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newBudgetTitle, setNewBudgetTitle] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleOpenDeleteDialog = (e) => {
    e.preventDefault();
    setIsDeleteDialogOpen(true);
  };

  // Row Data: The data to be displayed.
  const [budgets, setBudgets] = useState([]);

  // Column Definitions: Defines the columns to be displayed.
  const colDefs = useMemo(() => {
    return [
      {
        field: "title",
        resizable: false,
        sortable: true,
        flex: 1.5,
        suppressMovable: true,
        cellDataType: 'text',
        cellRenderer: (params) => {
          return (
            <Link to={`/budget/${params.data.id}`} size="3" style={{ textDecoration: 'none' }}>
              {params.data.title}
            </Link>
          );
        }
      },
      {
        field: "dateCreated",
        resizable: false,
        sortable: true,
        flex: 1,
        suppressMovable: true,
        cellDataType: 'dateString',
      },
      {
        field: "totalBalance",
        resizable: false,
        sortable: true,
        flex: 0.8,
        suppressMovable: true,
        cellDataType: 'text',
      },
      {
        field: "totalIncome",
        resizable: false,
        sortable: true,
        flex: 0.8,
        suppressMovable: true,
        cellDataType: 'text',
      },
      {
        field: "totalExpense",
        resizable: false,
        sortable: true,
        flex: 0.8,
        suppressMovable: true,
        cellDataType: 'text',
      },
      {
        field: "",
        resizable: false,
        sortable: false,
        flex: 0.3,
        suppressMovable: true,
        cellRenderer: (params) => {
          return (
            <Flex width="100%" height="100%" align="center" justify="end">
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <IconButton variant="ghost" color="gray" size="3">
                    <Icons.DotsHorizontal />
                  </IconButton>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Item onClick={() => navigate(`/budget/${params.data.id}`)}>
                    <Icons.EyeOpen />View
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onClick={() => navigate(`/budget/`)}>
                    <Icons.Share2 />Share
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item color="red" onClick={handleOpenDeleteDialog}>
                    <Icons.Trash />Delete
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>

              <Dialog.Root open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <Dialog.Content size="3" maxWidth="600px">
                  <Box asChild p="10px" pb="0px">
                    <Dialog.Title>Delete Itinerary</Dialog.Title>
                  </Box>

                  <Box asChild px="10px">
                    <Dialog.Description>
                      Are you sure you want to delete this budget plan? This action cannot be undone.
                    </Dialog.Description>
                  </Box>

                  <Flex gap="16px" mt="20px" justify="end">
                    <Dialog.Close>
                      <Button size="3" variant="soft" color="gray">
                        Cancel
                      </Button>
                    </Dialog.Close>
                    <Button size="3" variant="solid" color="red" onClick={handleDeleteBudget.bind(this, params.data.id)}>
                      Delete
                    </Button>
                  </Flex>
                </Dialog.Content>
              </Dialog.Root>
            </Flex>
          );
        },
      },
    ];
  });

  const getBudgets = async () => {
    axios
      .get(
        `${import.meta.env.VITE_API_URL}budget/`,
        {
          headers: {
            Authorization: `Token ${auth.token}`
          },
        }
      )
      .then(
        response => {
          const data = response.data.map((item) => ({
            id: item.id,
            title: item.title,
            dateCreated: item.date,
            totalBalance: "$" + item.total_balance,
            totalIncome: "$" + item.total_income,
            totalExpense: "$" + item.total_expense,
          }
          ));
          setBudgets(data);
        }
      )
      .catch(
        error => {
          console.error("Error fetching budgets:", error);
        }
      );
  };

  const recentBudget = useMemo(() => {

    return budgets[0];

  }, [budgets]);

  // Fetch Budgets when the component mounts
  useEffect(() => {
    getBudgets();
  }, []);

  const handleCreateBudget = async () => {

    axios
      .post(
        `${import.meta.env.VITE_API_URL}budget/`,
        {
          title: newBudgetTitle,
        },
        {
          headers: { Authorization: `Token ${auth.token}` },
        }
      )
      .then(
        response => {
          setNewBudgetTitle("");
          setIsCreateDialogOpen(false);
          getBudgets();
        }
      );

  };

  const handleDeleteBudget = async (id) => {
    axios
      .delete(
        `${import.meta.env.VITE_API_URL}budget/${id}/`,
        {
          headers: {
            Authorization: `Token ${auth.token}`
          },
        }
      )
      .then(
        response => {
          getBudgets();
        })
      .catch(
        error => {
          console.error("Error deleting budget plan:", error);
        });
    setIsDeleteDialogOpen(false);
  };

  const gridTheme = themeQuartz
    .withPart(colorSchemeDarkBlue)
    .withParams({
      headerHeight: 50,
      rowHeight: 50,
      fontSize: 16,
      backgroundColor: 'rgba(40, 40, 40, 0.22)',
      width: "100%",
      height: `${budgets.length * 50}px`,
      cellHorizontalPadding: 30,
      cellVerticalPadding: 20,
    });

  return (
    <Panel>
      <Box asChild width="100%" p="80px" pt="60px">
        <Flex
          direction="column"
          align="start"
          justify="center"
          gap="40px"
          style={{
            width: "100%",
            backgroundImage: "url('/images/sky.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center", // Center the image to handle sidebar collapse
            backgroundRepeat: "no-repeat", // Prevent tiling
            position: "relative", // Added for positioning the shadow
          }}>
          <Box
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "linear-gradient(to right, rgba(59, 58, 58, 0.85), rgba(0, 0, 0, 0))", // Shadow effect
              zIndex: 1,
            }}
          />
          <Flex
            direction="column"
            align="start"
            justify="center"
            gap="40px"
            style={{
              position: "relative", // Ensure content is above the shadow
              zIndex: 1,
            }}>
            <Heading size="8">
              Budget Tracker
            </Heading >
            <Box asChild width="100%">
              <Text size="5" >
                Track your budget effortlessly with our budget tracker.<br />
                Create, view, and manage your budgets all in one place.
              </Text>
            </Box>

          </Flex>
        </Flex>
      </Box>

      <Flex width="100%" direction="column" align="start" gap="40px" p="60px">
        {recentBudget && (
          <>
            <Box asChild width="100%">
              <Heading size="7" weight="medium">
                Continue planning your budget...
              </Heading>
            </Box>
            <Box asChild width="800px" height="300px">
              <Card asChild>
                <Link to={`${recentBudget.id}`}>
                  <Grid flow="row" columns="2">
                    <Flex
                      direction="column"
                      align="start"
                      justify="start"
                      gap="20px"
                      p="40px"
                      style={{
                        boxShadow: "inset -10px 0px 10px -10px rgba(0, 0, 0, 0.3)", // Add shadow between text and image
                        zIndex: 1,
                      }}>
                      <Box asChild width="100%">
                        <Heading as="h3" size="7" weight="medium">
                          {recentBudget.title}
                        </Heading>
                      </Box>
                      <Flex gap="20px" align="center">
                        <Text size="6" weight="regular" color={recentBudget.totalBalance >= 0 ? "green" : "red"}>
                          {recentBudget.totalBalance}
                        </Text>
                      </Flex>
                      <Flex gap="20px" align="center">
                        <Icons.Plus />
                        <Text size="4" weight="regular">
                          {recentBudget.totalIncome}
                        </Text>
                      </Flex>
                      <Flex gap="20px" align="center">
                        <Icons.Minus />
                        <Text size="4" weight="regular">
                          {recentBudget.totalExpense}
                        </Text>
                      </Flex>
                    </Flex>

                    <Inset asChild clip="padding-box" side="right" pb="0">
                      <Box height="300px" overflow="hidden">
                        <img
                          src="/images/pexels-pixabay-53621.jpg"
                          width="100%"
                          height="100%"
                          style={{
                            objectFit: "cover",
                            objectPosition: "left",
                          }}
                        />
                      </Box>
                    </Inset>
                  </Grid>
                </Link>
              </Card>
            </Box>
          </>
        )}

        <Flex width="100%" align="center" justify="between">
          <Heading size="7" weight="medium">
            All budgets
          </Heading>
          <Dialog.Root open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>

            <Dialog.Trigger asChild>
              <Button variant="soft" radius="medium" size="3">
                <Flex direction="row" gap="8px" align="center" justify="center">
                  <Icons.Plus />
                  <Text size="3" weight="medium">New Budget</Text>
                </Flex>
              </Button>
            </Dialog.Trigger>



            <Flex asChild direction="column" gap="10px">
              <Dialog.Content size="3" maxWidth="450px">
                <Box asChild p="4px">
                  <Dialog.Title>Create New Budget</Dialog.Title>
                </Box>

                <Dialog.Description>
                  <Text size="2" weight="medium" mx="6px">
                    Budget title
                  </Text>
                </Dialog.Description>

                <Box asChild height="40px">
                  <TextField.Root
                    value={newBudgetTitle}
                    onChange={(e) => setNewBudgetTitle(e.target.value)}
                    placeholder="Enter title for your new budget...">
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
                    <Button size="3" onClick={handleCreateBudget}>
                      Create
                    </Button>
                  </Box>
                </Flex>
              </Dialog.Content>
            </Flex>
          </Dialog.Root>
        </Flex>

        <Box width="100%" style={{ overflowX: "auto" }}>
          {budgets.length === 0 ? (
            <Box asChild width={"100%"} mt="60px" mb="100px">
              <Text size="5" weight="regular">
                <i>No budget plans available.</i>
              </Text>
            </Box>
          ) : (
            <AgGridReact
              theme={gridTheme}
              rowData={budgets}
              columnDefs={colDefs}
              domLayout="autoHeight"
            />
          )}
        </Box>
      </Flex>
    </Panel>
  );
}

export default BudgetTrackerRoot;
