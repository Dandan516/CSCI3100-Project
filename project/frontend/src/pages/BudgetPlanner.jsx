import { useState, useEffect, useMemo } from 'react';
import { useParams } from "react-router-dom";

import axios from 'axios';
import { Text, Flex, Box, Button, TextField, Heading, TextArea, Grid, Dialog, DropdownMenu, Select, Tabs, SegmentedControl, IconButton } from "@radix-ui/themes";
import { Form } from "radix-ui";
import { themeQuartz, colorSchemeDarkBlue, AllCommunityModule, ClientSideRowModelModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';

import { useAuth } from "../hooks/AuthProvider";
import Panel from '../components/Panel';
import * as Icons from "../assets/Icons";
import { incomeTags } from '../utils/incomeTags';
import { expenseTags } from '../utils/expenseTags';

ModuleRegistry.registerModules([AllCommunityModule, ClientSideRowModelModule]);

function BudgetPlanner() {

  const auth = useAuth();
  const params = useParams([]);

  const [isEditBudgetDialogOpen, setIsEditBudgetDialogOpen] = useState(false);
  const [isNewEntryDialogOpen, setIsNewEntryDialogOpen] = useState(false);
  const [isEditEntryDialogOpen, setIsEditEntryDialogOpen] = useState(false);
  const [isDeleteEntryDialogOpen, setIsDeleteEntryDialogOpen] = useState(false);


  const [budgetPlan, setBudgetPlan] = useState({
    id: 0,
    title: '',
    date: undefined,
    incomes: [],
    expenses: [],
    totalBalance: '',
    totalIncome: '',
    totalExpense: '',
  });

  const [editingBudgetPlan, setEditingBudgetPlan] = useState({
    title: '',
  });

  const [newEntry, setNewEntry] = useState({
    entryType: "expenses",
    budget: params.id,
    title: "",
    date: undefined,
    amount: "",
    description: "",
    categories: undefined,
  });

  const [editingEntry, setEditingEntry] = useState({
    entryType: "expenses",
    budget: params.id,
    id: "",
    title: "",
    date: undefined,
    amount: "",
    description: "",
    categories: undefined,
  });


  const handleOpenEditEntryDialog = (entry) => {
    if (!entry) {
      console.error("No entry data provided.");
      return;
    }
  
    setEditingEntry({
      ...entry,
      entryType: entry.entryType || "expenses", // Default to "expenses" if entryType is undefined
    });
  
    setIsEditEntryDialogOpen(true);
  };

  const handleOpenDeleteEntryDialog = (e) => {
    e.preventDefault();
    setIsDeleteEntryDialogOpen(true);
  };



  const getBudgetPlan = async () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}budget/${params.id}/`, {
        headers: { Authorization: `Token ${auth.token}` },
      })
      .then(response => {
        const data = response.data;
        setBudgetPlan({
          title: data.title,
          dateCreated: data.date,
          totalBalance: data.total_balance.toFixed(2),
          totalIncome: data.total_income.toFixed(2),
          totalExpense: data.total_expense.toFixed(2),
          expenses: data.expenses,
          incomes: data.incomes,
        });
        setEditingBudgetPlan({
          title: data.title,
          dateCreated: data.date,
          totalBalance: data.total_balance.toFixed(2),
          totalIncome: data.total_income.toFixed(2),
          totalExpense: data.total_expense.toFixed(2),
          expenses: data.expenses,
          incomes: data.incomes,
        });
        //console.log("Budget plan fetched successfully:", JSON.stringify(data));
      })
      .catch((error) => {
        console.error("Error fetching budget plan:", error);
      });
  };

  const updateEditingBudgetPlan = (e) => {
    const { name, value } = e.target;

    // Enforce title length limit
    if (name === "title" && value.length > 100) {
      return;
    }

    setEditingBudgetPlan({
      ...editingBudgetPlan,
      [name]: value,
    });
  };

  const handleSaveBudgetPlan = async () => {
    axios
      .patch(`${import.meta.env.VITE_API_URL}budget/${budgetPlan.id}/`, {
        title: editingBudgetPlan.title,
      }, {
        headers: { Authorization: `Token ${auth.token}` },
      })
      .then(() => {
        getBudgetPlan();
        setIsEditBudgetDialogOpen(false); // Close the dialog
      })
      .catch((error) => {
        console.error("Error updating budget plan:", error);
      });
  };

  const updateNewEntry = (e) => {

    const { name, value } = e.target;
    if (name === "title" && value.length > 100) {
      return; // Prevent updating if the title exceeds 100 characters
    }
    setNewEntry({
      ...newEntry,
      [name]: value,
    });
  };

  const updateEditingEntry = (e) => {

    const { name, value } = e.target;
    if (name === "title" && value.length > 100) {
      return; // Prevent updating if the title exceeds 100 characters
    }
    setEditingEntry({
      ...editingEntry,
      [name]: value,
    });
  };

  const handleNewEntry = async () => {
    axios
      .post(`${import.meta.env.VITE_API_URL}budget/${params.id}/${newEntry.entryType}/`,
        {
          "budget": params.id,
          "date": newEntry.date,
          "amount": newEntry.amount,
          "description": newEntry.description,
          "categories": newEntry.categories,
        },
        {
          headers:
          {
            Authorization: `Token ${auth.token}`
          },
          ContentType: "application/json",
        })
      .then((response) => {

        alert("Entry added successfully!", response.data);
        setIsNewEntryDialogOpen(false);
        getBudgetPlan();
      })
      .catch((error) => {
        alert("Error adding budget entry:", error);
      });
  };

  const handleSaveEntry = async (entry) => {
    alert(entryType)
    axios
      .patch(`${import.meta.env.VITE_API_URL}budget/${params.id}/${entry.entryType}/${entry.id}/`,
        {
          "date": editingEntry.date,
          "amount": editingEntry.amount,
          "description": editingEntry.description,
          "categories": editingEntry.categories,
        },
        {
          headers:
          {
            Authorization: `Token ${auth.token}`
          },
          ContentType: "application/json",
        })
      .then((response) => {

        alert("Entry saved successfully!", response.data);
        setIsNewEntryDialogOpen(false);
        getBudgetPlan();
      })
      .catch((error) => {
        alert("Error adding budget entry:", error);
      });
  };

  const handleDeleteEntry = async (id, entryType) => {
    axios
      .delete(`${import.meta.env.VITE_API_URL}budget/${params.id}/${entryType}/${id}/`,
        {
          headers:
          {
            Authorization: `Token ${auth.token}`
          },
          ContentType: "application/json",
        })
      .then((response) => {
        alert("Entry deleted successfully!", response.data);
        setIsDeleteEntryDialogOpen(false);
        getBudgetPlan();
      })
      .catch((error) => {
        alert("Error deleting budget entry:", error);
      });
  };

    const colDefs = useMemo(() => {
    return [
      {
        field: "title",
        resizable: false,
        sortable: true,
        flex: 1.5,
        suppressMovable: true,
        cellDataType: 'text',
      },
      {
        field: "date",
        resizable: false,
        sortable: true,
        flex: 1,
        suppressMovable: true,
        cellDataType: 'dateString',
      },
      {
        field: "amount",
        resizable: false,
        sortable: true,
        flex: 0.8,
        suppressMovable: true,
        cellDataType: 'text',
      },
      {
        field: "tag",
        resizable: false,
        sortable: true,
        flex: 1,
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
                  <DropdownMenu.Item
                    onClick={() => handleOpenEditEntryDialog(params.data)}>
                    <Icons.Pencil />Edit
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item color="red" onClick={handleOpenDeleteEntryDialog}>
                    <Icons.Trash />Delete
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>

              <Dialog.Root open={isEditEntryDialogOpen} onOpenChange={setIsEditEntryDialogOpen}>
                <Dialog.Content size="3" maxWidth="600px">
                  <Box asChild p="10px" pb="0px">
                    <Dialog.Title>Edit Entry</Dialog.Title>
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
                          value={editingEntry.title || ""} // Default to an empty string
                          onChange={updateEditingEntry}>
                          <Box asChild height="40px">
                            <TextField.Root>
                              <TextField.Slot />
                              <TextField.Slot >
                                <Text size="1" color="gray" mr="4px">
                                  {editingEntry.title?.length} / 100
                                </Text>
                              </TextField.Slot>
                            </TextField.Root>
                          </Box>
                        </Form.Control>
                      </Form.Field>

                      <Grid flow="column" gap="20px" columns={1}>
                        <Form.Field name="date">
                          <Form.Label asChild>
                            <Box asChild mb="6px" >
                              <Text size="2" weight="medium">Date</Text>
                            </Box>
                          </Form.Label>
                          <Form.Control
                            asChild
                            type="date"
                            onChange={updateEditingEntry}>
                            <Box asChild height="40px">
                              <TextField.Root>
                                <TextField.Slot />
                                <TextField.Slot />
                              </TextField.Root>
                            </Box>
                          </Form.Control>
                        </Form.Field>
                      </Grid>

                      <Form.Field name="amount">
                        <Form.Label asChild>
                          <Box asChild mb="6px" >
                            <Text size="2" weight="medium">Amount</Text>
                          </Box>
                        </Form.Label>
                        <Form.Control
                          asChild
                          type="number"
                          value={editingEntry.amount || ""} // Default to an empty string
                          onChange={updateEditingEntry}>
                          <Box asChild height="40px">
                            <TextField.Root>
                              <TextField.Slot />
                              <TextField.Slot >
                                <Text size="1" color="gray" mr="4px">
                                  {editingEntry.amount?.length} / 100
                                </Text>
                              </TextField.Slot>
                            </TextField.Root>
                          </Box>
                        </Form.Control>
                      </Form.Field>

                      <Form.Field name="description">
                        <Form.Label asChild>
                          <Box asChild mb="6px" >
                            <Text size="2" weight="medium">Description</Text>
                          </Box>
                        </Form.Label>
                        <Form.Control
                          asChild
                          type="text"
                          value={editingEntry.description}
                          onChange={updateEditingEntry}>
                          <Box asChild height="100px" p="2px">
                            <TextArea size="2" />
                          </Box>
                        </Form.Control>
                      </Form.Field>

                      <Form.Field name="categories">
                        <Form.Label asChild>
                          <Box asChild mb="6px" >
                            <Text size="2" weight="medium">Tag</Text>
                          </Box>
                        </Form.Label>
                        <Box asChild height="40px">
                          <Select.Root
                            defaultValue="no-tag"
                            onValueChange={(value) => {
                              setEditingEntry({
                                ...editingEntry,
                                categories: value,
                              });
                            }}>
                            <Select.Trigger radius="medium" />
                            <Select.Content>
                              {incomeTags.map((tag) => (
                                <Select.Item key={tag.value} value={tag.value}>{tag.label}</Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Root>
                        </Box>
                      </Form.Field>
                    </Flex>

                  </Form.Root>

                  <Flex gap="16px" mt="20px" justify="end">
                    <Dialog.Close>
                      <Button size="3" variant="soft" color="gray">
                        Cancel
                      </Button>
                    </Dialog.Close>
                    <Button size="3" variant="solid" onClick={handleSaveEntry.bind(params.data)}>
                      Save
                    </Button>
                  </Flex>
                </Dialog.Content>
              </Dialog.Root>

              <Dialog.Root open={isDeleteEntryDialogOpen} onOpenChange={setIsDeleteEntryDialogOpen}>
                <Dialog.Content size="3" maxWidth="600px">
                  <Box asChild p="10px" pb="0px">
                    <Dialog.Title>Delete Entry</Dialog.Title>
                  </Box>

                  <Box asChild px="10px">
                    <Dialog.Description>
                      Are you sure you want to delete this entry? This action cannot be undone.
                    </Dialog.Description>
                  </Box>

                  <Flex gap="16px" mt="20px" justify="end">
                    <Dialog.Close>
                      <Button size="3" variant="soft" color="gray">
                        Cancel
                      </Button>
                    </Dialog.Close>
                    <Button size="3" variant="solid" color="red" onClick={handleDeleteEntry.bind(params.data)}>
                      Delete
                    </Button>
                  </Flex>
                </Dialog.Content>
              </Dialog.Root>
            </Flex>
          );
        },
      }
    ];
  });

  const expensesGridTheme = themeQuartz
    .withPart(colorSchemeDarkBlue)
    .withParams({
      headerHeight: 50,
      rowHeight: 50,
      fontSize: 16,
      backgroundColor: 'rgba(40, 40, 40, 0.22)',
      width: "100%",
      height: `${budgetPlan?.expenses?.length * 50}px`,
      cellHorizontalPadding: 30,
      cellVerticalPadding: 20,
    });

  const incomesGridTheme = themeQuartz
    .withPart(colorSchemeDarkBlue)
    .withParams({
      headerHeight: 50,
      rowHeight: 50,
      fontSize: 16,
      backgroundColor: 'rgba(40, 40, 40, 0.22)',
      width: "100%",
      height: `${budgetPlan?.incomes?.length * 50}px`,
      cellHorizontalPadding: 30,
      cellVerticalPadding: 20,
    });

  useEffect(() => {
    getBudgetPlan();
  }, [params.id]);

  return (
    <Panel>
      <Box asChild width="100%" p="80px">
        <Flex direction="column" gap="40px">

          {/* Budget Plan Details */}
          <Flex direction="row" justify="between">

            <Heading size="8" weight="medium">
              {budgetPlan?.title}
            </Heading>

            {/* Edit Budget Plan Button */}
            <Flex direction="row" gap="20px" align="center">

              <Dialog.Root open={isEditBudgetDialogOpen} onOpenChange={setIsEditBudgetDialogOpen}>
                <Box asChild width="80px" height="40px">
                  <Button size="3" variant="soft" radius="medium" onClick={() => setIsEditBudgetDialogOpen(true)}>
                    Edit
                  </Button>
                </Box>
                <Dialog.Content size="3" maxWidth="600px">
                  <Box asChild p="10px" pb="20px">
                    <Dialog.Title>Edit Budget Plan</Dialog.Title>
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
                          value={editingBudgetPlan.title || ""} // Default to an empty string
                          onChange={updateEditingBudgetPlan}>
                          <Box asChild height="40px">
                            <TextField.Root>
                              <TextField.Slot />
                              <TextField.Slot >
                                <Text size="1" color="gray" mr="4px">
                                  {editingBudgetPlan?.title?.length} / 100
                                </Text>
                              </TextField.Slot>
                            </TextField.Root>
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
                    <Button
                      size="3"
                      variant="solid"
                      onClick={handleSaveBudgetPlan}
                      className={editingBudgetPlan.title === "" && "no-click"}
                      disabled={editingBudgetPlan.title === ""}>
                      Save
                    </Button>
                  </Flex>
                </Dialog.Content>
              </Dialog.Root>

            </Flex>

          </Flex>

          <Flex direction="row" gap="20px" align="center">
            <Icons.Calendar />
            <Text size="4">{budgetPlan.date || "-"}</Text>
            <Box width="30px" />
          </Flex>

          <Flex direction="column" gap="20px" align="start">
            <Text size="5">
              Total Balance ($):
            </Text>
            <Text size="8" color={budgetPlan.totalBalance > 0 ? "green" : "red"} weight="medium">
              {budgetPlan.totalBalance}
            </Text>
          </Flex>

          <Grid flow="column" gap="40px" columns={3}>

            <Flex direction="column" gap="16px" align="start">
              <Text size="3">
                Total Income ($):
              </Text>
              <Text size="6">
                {budgetPlan.totalIncome}
              </Text>
            </Flex>

            <Flex direction="row" gap="16px" align="center">
              <Text size="6">
                -
              </Text>
            </Flex>

            <Flex direction="column" gap="16px" align="start">
              <Text size="3">
                Total Expense ($):
              </Text>
              <Text size="6">
                {budgetPlan.totalExpense}
              </Text>
            </Flex>

          </Grid>

          <Box height="0px" />

          {/* Budget Entry List */}

          <Tabs.Root defaultValue="expenses">

            <Flex direction="row" align="center" justify="between">

              <Tabs.List>
                <Tabs.Trigger value="expenses">
                  <Text size="3">Expenses</Text>
                </Tabs.Trigger>
                <Tabs.Trigger value="incomes">
                  <Text size="3">Incomes</Text>
                </Tabs.Trigger>
                </Tabs.List>

              <Dialog.Root open={isNewEntryDialogOpen} onOpenChange={setIsNewEntryDialogOpen}>

                <Dialog.Trigger asChild>
                  <Button variant="soft" radius="medium" size="3">
                    <Flex direction="row" gap="8px" align="center" justify="center">
                      <Icons.Plus />
                      <Text size="3" weight="medium">Add Entry</Text>
                    </Flex>
                  </Button>
                </Dialog.Trigger>

                <Dialog.Content size="3" maxWidth="600px">
                  <Box asChild p="10px" pb="20px">
                    <Dialog.Title>Add Entry</Dialog.Title>
                  </Box>
                  <Dialog.Description></Dialog.Description>
                  <Form.Root className="FormRoot">
                    <Flex direction="column" gap="20px" px="10px">

                      <Form.Field>
                        <Form.Label asChild>
                          <Box asChild mb="6px">
                            <Text size="2" weight="medium">Entry Type</Text>
                          </Box>
                        </Form.Label>
                        <SegmentedControl.Root
                          name="entryType"
                          variant="classic"
                          defaultValue="expenses"
                          onValueChange={(value) => {
                            setNewEntry({
                              ...newEntry,
                              entryType: value,
                            });
                          }}>
                          <SegmentedControl.Item value="expenses">Expenses</SegmentedControl.Item>
                          <SegmentedControl.Item value="incomes" >Incomes</SegmentedControl.Item>
                        </SegmentedControl.Root>
                      </Form.Field>

                      <Form.Field name="title">
                        <Form.Label asChild>
                          <Box asChild mb="6px" >
                            <Text size="2" weight="medium">Title</Text>
                          </Box>
                        </Form.Label>
                        <Form.Control
                          asChild
                          type="text"
                          value={newEntry.title || ""} // Default to an empty string
                          onChange={updateNewEntry}>
                          <Box asChild height="40px">
                            <TextField.Root>
                              <TextField.Slot />
                              <TextField.Slot >
                                <Text size="1" color="gray" mr="4px">
                                  {newEntry.title?.length} / 100
                                </Text>
                              </TextField.Slot>
                            </TextField.Root>
                          </Box>
                        </Form.Control>
                      </Form.Field>

                      <Grid flow="column" gap="20px" columns={1}>
                        <Form.Field name="date">
                          <Form.Label asChild>
                            <Box asChild mb="6px" >
                              <Text size="2" weight="medium">Date</Text>
                            </Box>
                          </Form.Label>
                          <Form.Control
                            asChild
                            type="date"
                            onChange={updateNewEntry}>
                            <Box asChild height="40px">
                              <TextField.Root>
                                <TextField.Slot />
                                <TextField.Slot />
                              </TextField.Root>
                            </Box>
                          </Form.Control>
                        </Form.Field>
                      </Grid>

                      <Form.Field name="amount">
                        <Form.Label asChild>
                          <Box asChild mb="6px" >
                            <Text size="2" weight="medium">Amount</Text>
                          </Box>
                        </Form.Label>
                        <Form.Control
                          asChild
                          type="number"
                          value={newEntry.amount || ""} // Default to an empty string
                          onChange={updateNewEntry}>
                          <Box asChild height="40px">
                            <TextField.Root>
                              <TextField.Slot />
                              <TextField.Slot >
                                <Text size="1" color="gray" mr="4px">
                                  {newEntry.amount?.length} / 100
                                </Text>
                              </TextField.Slot>
                            </TextField.Root>
                          </Box>
                        </Form.Control>
                      </Form.Field>

                      <Form.Field name="description">
                        <Form.Label asChild>
                          <Box asChild mb="6px" >
                            <Text size="2" weight="medium">Description</Text>
                          </Box>
                        </Form.Label>
                        <Form.Control
                          asChild
                          type="text"
                          value={newEntry.description}
                          onChange={updateNewEntry}>
                          <Box asChild height="100px" p="2px">
                            <TextArea size="2" />
                          </Box>
                        </Form.Control>
                      </Form.Field>

                      <Form.Field name="categories">
                        <Form.Label asChild>
                          <Box asChild mb="6px" >
                            <Text size="2" weight="medium">Tag</Text>
                          </Box>
                        </Form.Label>
                        <Box asChild height="40px">
                          <Select.Root
                            defaultValue="no-tag"
                            onValueChange={(value) => {
                              setNewEntry({
                                ...newEntry,
                                categories: value,
                              });
                            }}>
                            <Select.Trigger radius="medium" />
                            <Select.Content>
                              {incomeTags.map((tag) => (
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
                        onClick={handleNewEntry}
                        className={newEntry.title === "" && "no-click"}
                        disabled={newEntry.title === ""}>
                        Add
                      </Button>
                    </Flex>
                  </Form.Root>

                </Dialog.Content>
              </Dialog.Root>

            </Flex>

            <Tabs.Content value="expenses">
              <Box height="40px" />
              {budgetPlan?.expenses?.length === 0 ? (
                <Box asChild width={"100%"} mt="60px" mb="100px">
                  <Text size="5" weight="regular">
                    <i>No budget plans available.</i>
                  </Text>
                </Box>
              ) : (
                <AgGridReact
                  theme={expensesGridTheme}
                  rowData={budgetPlan?.expenses}
                  columnDefs={colDefs}
                  domLayout="autoHeight"
                />
              )}
            </Tabs.Content>

            <Tabs.Content value="incomes">
              <Box height="40px" />
              {budgetPlan?.incomes?.length === 0 ? (
                <Box asChild width={"100%"} mt="60px" mb="100px">
                  <Text size="5" weight="regular">
                    <i>No budget plans available.</i>
                  </Text>
                </Box>
              ) : (
                <AgGridReact
                  theme={incomesGridTheme}
                  rowData={budgetPlan?.incomes}
                  columnDefs={colDefs}
                  domLayout="autoHeight"
                />
              )}
            </Tabs.Content>

          </Tabs.Root>

        </Flex>
      </Box>
    </Panel>
  );
}

export default BudgetPlanner;