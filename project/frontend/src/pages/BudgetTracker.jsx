import { useState, useEffect, useMemo } from 'react';
import { useParams } from "react-router-dom";

import axios from 'axios';
import { Text, Flex, Box, Button, TextField, Heading, Badge, Grid, Dialog, DropdownMenu, Select, Tabs, SegmentedControl, IconButton } from "@radix-ui/themes";
import { Form } from "radix-ui";
import { themeQuartz, colorSchemeDarkBlue, AllCommunityModule, ClientSideRowModelModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';

import { useAuth } from "../hooks/AuthProvider";
import Panel from '../components/Panel';
import * as Icons from "../assets/Icons";
import { incomeTags, expenseTags } from '../utils/budgetEntryTags';

ModuleRegistry.registerModules([AllCommunityModule, ClientSideRowModelModule]);

const matchBadgeColor = (entryType, category) => {
  if (entryType === "expenses") {
    return expenseTags.find((t) => t.value === category)?.color || "gray"
  } else if (entryType === "incomes") {
    return incomeTags.find((t) => t.value === category)?.color || "gray"
  }
  return "gray" // Default color if no match is found
};

const matchBadgeLabel = (entryType, category) => {
  if (entryType === "expenses") {
    return expenseTags.find((t) => t.value === category)?.label || "No category"
  } else if (entryType === "incomes") {
    return incomeTags.find((t) => t.value === category)?.label || "No category"
  }
  return "No category"; // Default label if no match is found
};

function BudgetEntryDialog({
  mode,
  entry,
  setEntry,
  isDialogOpen,
  setIsDialogOpen,
  handleSave,
}) {

  const dialogTitle = mode === "edit" ? "Edit Entry" : "New Entry";
  const updateEntry = (e) => {
    const { name, value } = e.target;
    if (name === "description" && value.length > 100) {
      return; // Prevent updating if the description exceeds 100 characters
    }
    setEntry({
      ...entry,
      [name]: value,
    });
  };

  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Dialog.Content size="3" maxWidth="600px">
        <Box asChild p="10px" pb="20px">
          <Dialog.Title>
            {dialogTitle}
          </Dialog.Title>
        </Box>

        <Dialog.Description></Dialog.Description>

        <Form.Root className="FormRoot">
          <Flex direction="column" gap="20px" px="10px">

            {mode === "new" &&
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
                    setEntry({
                      ...entry,
                      entryType: value,
                    });
                  }}>
                  <SegmentedControl.Item value="expenses">Expenses</SegmentedControl.Item>
                  <SegmentedControl.Item value="incomes" >Incomes</SegmentedControl.Item>
                </SegmentedControl.Root>
              </Form.Field>
            }

            <Form.Field name="description">
              <Form.Label asChild>
                <Box asChild mb="6px" >
                  <Text size="2" weight="medium">Description</Text>
                </Box>
              </Form.Label>
              <Form.Control
                asChild
                type="text"
                autoComplete="off"
                value={entry.description || ""} // Default to an empty string
                onChange={updateEntry}>
                <Box asChild height="40px">
                  <TextField.Root>
                    <TextField.Slot />
                    <TextField.Slot >
                      <Text size="1" color="gray" mr="4px">
                        {entry.description?.length} / 100
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
                  onChange={updateEntry}>
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
                autoComplete="off"
                step="0.01"
                value={entry.amount || ""} // Default to an empty string
                onChange={updateEntry}>
                <Box asChild height="40px">
                  <TextField.Root>
                    <TextField.Slot />
                  </TextField.Root>
                </Box>
              </Form.Control>
            </Form.Field>

            <Form.Field name="category">
              <Form.Label asChild>
                <Box asChild mb="6px" >
                  <Text size="2" weight="medium">Category</Text>
                </Box>
              </Form.Label>
              <Box asChild height="40px">
                <Select.Root
                  defaultValue={entry.category || "no-category"}
                  onValueChange={(value) => {
                    setEntry({
                      ...entry,
                      category: value,
                    });
                  }}>
                  <Select.Trigger radius="medium" />
                  <Select.Content>
                    {
                      (entry.entryType === "incomes") ? (
                        incomeTags.map((category) => (
                          <Select.Item key={category.value} value={category.value}>{category.label}</Select.Item>
                        ))
                      ) : (
                        expenseTags.map((category) => (
                          <Select.Item key={category.value} value={category.value}>{category.label}</Select.Item>
                        ))
                      )
                    }
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
          <Button
            size="3"
            variant="solid"
            onClick={handleSave}
            className={!entry.amount && "no-click"}
            disabled={!entry.amount}>
            Save
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}

function BudgetTracker() {

  const auth = useAuth();
  const params = useParams([]);

  const [isEditBudgetDialogOpen, setIsEditBudgetDialogOpen] = useState(false);
  const [isNewEntryDialogOpen, setIsNewEntryDialogOpen] = useState(false);
  const [isEditEntryDialogOpen, setIsEditEntryDialogOpen] = useState(false);
  const [isDeleteEntryDialogOpen, setIsDeleteEntryDialogOpen] = useState(false);

  const [budget, setBudget] = useState({
    id: 0,
    title: '',
    date: undefined,
    incomes: [],
    expenses: [],
    totalBalance: '',
    totalIncome: '',
    totalExpense: ''
  });

  const [editingBudget, setEditingBudget] = useState({
    title: ''
  });

  const [newEntry, setNewEntry] = useState({
    entryType: "expenses",
    budget: params.id,
    date: undefined,
    amount: "",
    description: "",
    category: "no-category"
  });

  const [editingEntry, setEditingEntry] = useState({
    entryType: "",
    budget: params.id,
    id: 0,
    date: undefined,
    amount: "",
    description: "",
    category: "no-category",
  });

  const handleOpenNewEntryDialog = () => {
    setIsNewEntryDialogOpen(true);
  };

  const handleOpenEditEntryDialog = (entry) => {
    if (!entry) {
      console.error("No entry data provided.");
      return;
    }
    setEditingEntry({
      ...entry,
      id: entry.id || 0, // Ensure id is set to 0 if undefined
      entryType: entry.entryType || "expenses", // Default to "expenses" if entryType is undefined
    });

    setIsEditEntryDialogOpen(true);
  };

  const handleOpenDeleteEntryDialog = (entry) => {
    if (!entry) {
      console.error("No entry data provided.");
      return;
    }
    setEditingEntry({
      ...entry,
      id: entry.id || 0, // Ensure id is set to 0 if undefined
      entryType: entry.entryType || "expenses", // Default to "expenses" if entryType is undefined
    });

    setIsDeleteEntryDialogOpen(true);
  };

  const getBudget = async () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}budget/${params.id}/`, {
        headers: { Authorization: `Token ${auth.token}` },
      })
      .then(response => {
        const data = response.data;
        setBudget({
          title: data.title,
          dateCreated: data.date,
          totalBalance: data.total_balance.toFixed(2),
          totalIncome: data.total_income.toFixed(2),
          totalExpense: data.total_expense.toFixed(2),
          expenses: data.expenses.map(
            (expense) => ({
              ...expense,
              entryType: "expenses",
            })
          ),
          incomes: data.incomes.map(
            (income) => ({
              ...income,
              entryType: "incomes",
            })
          ),
        });
        setEditingBudget({
          title: data.title,
        });
      })
      .catch((error) => {
        console.error("Error fetching budget plan:", error);
      });
  };

  const updateEditingBudget = (e) => {
    const { name, value } = e.target;

    // Enforce title length limit
    if (name === "title" && value.length > 100) {
      return;
    }

    setEditingBudget({
      ...editingBudget,
      [name]: value,
    });
  };

  const handleEditBudget = async () => {
    axios
      .patch(`${import.meta.env.VITE_API_URL}budget/${budget.id}/`, {
        title: editingBudget.title,
      }, {
        headers: { Authorization: `Token ${auth.token}` },
      })
      .then(() => {
        getBudget();
        setIsEditBudgetDialogOpen(false); // Close the dialog
      })
      .catch((error) => {
        console.error("Error updating budget plan:", error);
      });
  };

  const handleNewEntry = async () => {
    console.log("New entry:", newEntry);
    if (!newEntry.budget) {
      console.error("No budget ID provided.");
      return;
    }
    if (!newEntry.amount) {
      console.error("No amount provided.");
      return;
    };
    axios
      .post(
        `${import.meta.env.VITE_API_URL}budget/${params.id}/${newEntry.entryType}/`,
        {
          "budget": params.id,
          "date": newEntry.date,
          "amount": newEntry.amount,
          "description": newEntry.description,
          "category": newEntry.category,
        },
        {
          headers: {
            Authorization: `Token ${auth.token}`,
            'Content-Type': "application/json",
          },
        })
      .then(
        (response) => {
          setIsNewEntryDialogOpen(false);
          getBudget();
        }
      )
      .catch((error) => {
        alert("Error adding budget entry:", error);
      });
  };

  const handleEditEntry = async () => {
    axios
      .patch(
        `${import.meta.env.VITE_API_URL}budget/${editingEntry.budget}/${editingEntry.entryType}/${editingEntry.id}/`,
        {
          "description": editingEntry.description,
          "date": editingEntry.date,
          "amount": editingEntry.amount,
          "description": editingEntry.description,
          "category": editingEntry.category,
        },
        {
          headers: {
            Authorization: `Token ${auth.token}`,
          },
        }
      )
      .then(
        (response) => {
          setIsEditEntryDialogOpen(false);
          getBudget();
        }
      )
      .catch((error) => {
        alert("Error adding budget entry:", error);
      });
  };

  const handleDeleteEntry = async () => {
    axios
      .delete(
        `${import.meta.env.VITE_API_URL}budget/${params.id}/${editingEntry.entryType}/${editingEntry.id}/`,
        {
          headers: {
            Authorization: `Token ${auth.token}`,
            'Content-Type': "application/json",
          },
        }
      )
      .then(
        (response) => {
          setIsDeleteEntryDialogOpen(false);
          getBudget();
        }
      )
      .catch(
        (error) => {
          alert("Error deleting budget entry:", error);
        }
      );
  };

  const colDefs = useMemo(() => {
    return [
      {
        field: "description",
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
        field: "category",
        resizable: false,
        sortable: true,
        flex: 1,
        suppressMovable: true,
        cellRenderer: (params) => {
          const categoryColor = matchBadgeColor(params.data.entryType, params.data.category)
          const categoryLabel = matchBadgeLabel(params.data.entryType, params.data.category)
          return (
            <Badge color={categoryColor} variant="soft" radius="medium" size="2">
              {categoryLabel}
            </Badge>
          );
        }
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
                  <DropdownMenu.Item color="red" onClick={() => handleOpenDeleteEntryDialog(params.data)}>
                    <Icons.Trash />Delete
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
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
      height: `${budget?.expenses?.length * 50}px`,
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
      height: `${budget?.incomes?.length * 50}px`,
      cellHorizontalPadding: 30,
      cellVerticalPadding: 20,
    });

  useEffect(
    () => {
      getBudget();
    },
    [params.id]
  );

  return (
    <Panel>
      <Box asChild width="100%" p="80px">
        <Flex direction="column" gap="40px">

          {/* Budget Plan Details */}
          <Flex direction="row" justify="between">

            <Heading size="8" weight="medium">
              {budget?.title}
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
                          value={editingBudget.title || ""} // Default to an empty string
                          onChange={updateEditingBudget}>
                          <Box asChild height="40px">
                            <TextField.Root>
                              <TextField.Slot />
                              <TextField.Slot >
                                <Text size="1" color="gray" mr="4px">
                                  {editingBudget?.title?.length} / 100
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
                      onClick={handleEditBudget}
                      className={editingBudget.title === "" && "no-click"}
                      disabled={editingBudget.title === ""}>
                      Save
                    </Button>
                  </Flex>
                </Dialog.Content>
              </Dialog.Root>

            </Flex>

          </Flex>

          <Flex direction="row" gap="20px" align="center">
            <Icons.Calendar />
            <Text size="4">{budget.dateCreated || "-"}</Text>
            <Box width="30px" />
          </Flex>

          <Flex direction="column" gap="20px" align="start">
            <Text size="5">
              Total Balance ($):
            </Text>
            <Text size="8" color={budget.totalBalance > 0 ? "green" : "red"} weight="medium">
              {budget.totalBalance}
            </Text>
          </Flex>

          <Grid flow="column" gap="40px" columns={3}>

            <Flex direction="column" gap="16px" align="start">
              <Text size="3">
                Total Income ($):
              </Text>
              <Text size="6">
                {budget.totalIncome}
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
                {budget.totalExpense}
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

              <Button variant="soft" radius="medium" size="3" onClick={handleOpenNewEntryDialog}>
                <Flex direction="row" gap="8px" align="center" justify="center">
                  <Icons.Plus />
                  <Text size="3" weight="medium">Add Entry</Text>
                </Flex>
              </Button>

            </Flex>

            <Tabs.Content value="expenses">
              <Box height="40px" />
              {budget?.expenses?.length === 0 ? (
                <Box asChild width={"100%"} mt="60px" mb="100px">
                  <Text size="5" weight="regular">
                    <i>No expense entries available.</i>
                  </Text>
                </Box>
              ) : (
                <AgGridReact
                  theme={expensesGridTheme}
                  rowData={budget?.expenses}
                  columnDefs={colDefs}
                  domLayout="autoHeight"
                />
              )}
            </Tabs.Content>

            <Tabs.Content value="incomes">
              <Box height="40px" />
              {budget?.incomes?.length === 0 ? (
                <Box asChild width={"100%"} mt="60px" mb="100px">
                  <Text size="5" weight="regular">
                    <i>No income entries available.</i>
                  </Text>
                </Box>
              ) : (
                <AgGridReact
                  theme={incomesGridTheme}
                  rowData={budget?.incomes}
                  columnDefs={colDefs}
                  domLayout="autoHeight"
                />
              )}
            </Tabs.Content>

          </Tabs.Root>

          {/* Add entry dialog */}
          <BudgetEntryDialog
            mode="new"
            entry={newEntry}
            setEntry={setNewEntry}
            isDialogOpen={isNewEntryDialogOpen}
            setIsDialogOpen={setIsNewEntryDialogOpen}
            handleSave={handleNewEntry}
          />

          {/* Edit entry dialog */}
          <BudgetEntryDialog
            mode="edit"
            entry={editingEntry}
            setEntry={setEditingEntry}
            isDialogOpen={isEditEntryDialogOpen}
            setIsDialogOpen={setIsEditEntryDialogOpen}
            handleSave={handleEditEntry}
          />

          {/* Delete entry dialog */}
          < Dialog.Root open={isDeleteEntryDialogOpen} onOpenChange={setIsDeleteEntryDialogOpen} >
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
                <Button size="3" variant="solid" color="red" onClick={handleDeleteEntry}>
                  Delete
                </Button>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>

        </Flex>
      </Box>
    </Panel >
  );
}

export default BudgetTracker;