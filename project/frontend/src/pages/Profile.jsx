import { useState } from 'react';

import { Text, Flex, Box, Avatar, AlertDialog, IconButton, TextField, Table, Button, Dialog } from "@radix-ui/themes";
import axios from 'axios';

import Panel from '../components/Panel';
import { useAuth } from "../hooks/AuthProvider";
import * as Icons from '../assets/Icons';

function Profile() {

  const auth = useAuth();

  const [isEditUsernameDialogOpen, setIsEditUsernameDialogOpen] = useState(false);
  const [isEditNameDialogOpen, setIsEditNameDialogOpen] = useState(false);
  const [isEditBirthdayDialogOpen, setIsEditBirthdayDialogOpen] = useState(false);
  const [isEditeAvatarDialogOpen, setIsEditAvatarDialogOpen] = useState(false);

  const [editingProfile, setEditingProfile] = useState({
    username: auth.user?.username || "",
    first_name: auth.user?.first_name || "",
    last_name: auth.user?.last_name || "",
    birthday: auth.user?.birthday || null,
  });

  const updateEditingUserInfo = (e) => {
    const { name, value } = e.target;
    setEditingProfile({
      ...editingProfile,
      [name]: value
    });
  };

  const handleEditProfile = (e) => {
    e.preventDefault();
    axios
      .patch(`${import.meta.env.VITE_API_URL}userinfo/${auth.user?.id}/`, {
        ...editingProfile,
        username: editingProfile.username,
        first_name: editingProfile.first_name,
        last_name: editingProfile.last_name,
        birthday: editingProfile.birthday,
      }, {
        headers: {
          Authorization: `Token ${auth.token}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        setIsEditUsernameDialogOpen(false);
        setIsEditNameDialogOpen(false);
        setIsEditBirthdayDialogOpen(false);
        setIsEditAvatarDialogOpen(false);
        auth.getUserInfo(); // Refresh user info
      })
      .catch((error) => {
        console.error('Error updating user info', error);
      });
  }

  return (
    <Panel>
      <Flex direction="column" align="center" gap="40px" p="60px">

        <Avatar
          size="8"
          src={auth.user?.avatarUrl}
          radius="full"
          fallback="T"
        />
        <Text size="6" weight="medium">{auth.user?.email}</Text>

        <Box asChild minWidth="80%" mt="40px">
          <Table.Root size="3">
            <Table.Body>
              <Table.Row>
                <Table.RowHeaderCell>Username</Table.RowHeaderCell>
                <Table.Cell>
                  <Flex direction="row" gap="20px" align="center">
                    {auth.user?.username || "-"}
                    <IconButton
                      variant="ghost"
                      onClick={() => setIsEditUsernameDialogOpen(true)}>
                      <Icons.Pencil />
                    </IconButton>
                  </Flex>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.RowHeaderCell>Name</Table.RowHeaderCell>
                <Table.Cell>
                  <Flex direction="row" gap="20px" align="center">
                    {auth.user?.first_name || auth.user?.last_name ? `${auth.user.first_name} ${auth.user.last_name}` : "-"}
                    <IconButton
                      variant="ghost"
                      onClick={() => setIsEditNameDialogOpen(true)}>
                      <Icons.Pencil />
                    </IconButton>
                  </Flex>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.RowHeaderCell>Birthday</Table.RowHeaderCell>
                <Table.Cell>
                  <Flex direction="row" gap="20px" align="center">
                    {auth.user?.birthday || "-"}
                    <IconButton
                      variant="ghost"
                      onClick={() => setIsEditBirthdayDialogOpen(true)}>
                      <Icons.Pencil />
                    </IconButton>
                  </Flex>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.RowHeaderCell>Joined</Table.RowHeaderCell>
                <Table.Cell>{auth.user?.date_joined ? new Date(auth.user.date_joined).toISOString().split('T')[0] : "-"}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.RowHeaderCell>Last Login</Table.RowHeaderCell>
                <Table.Cell>{auth.user?.last_login || "-"}</Table.Cell>
              </Table.Row>

            </Table.Body>
          </Table.Root>
        </Box>

        <Dialog.Root open={isEditUsernameDialogOpen} onOpenChange={setIsEditUsernameDialogOpen}>
          <Flex asChild direction="column" gap="10px">

            <Dialog.Content size="3" maxWidth="600px">
              <Box asChild p="10px" pb="0px">
                <Dialog.Title>Edit Username</Dialog.Title>
              </Box>

              <Dialog.Description></Dialog.Description>

              <Box asChild height="40px">
                <TextField.Root name="username" placeholder="New username" onChange={updateEditingUserInfo} >
                  <TextField.Slot />
                </TextField.Root>
              </Box>

              <Flex gap="16px" mt="20px" justify="end">
                <Dialog.Close>
                  <Button size="3" variant="soft" color="gray">
                    Cancel
                  </Button>
                </Dialog.Close>
                <Button size="3" variant="solid" onClick={handleEditProfile}>
                  Save
                </Button>
              </Flex>
            </Dialog.Content>
          </Flex>
        </Dialog.Root>

        <Dialog.Root open={isEditNameDialogOpen} onOpenChange={setIsEditNameDialogOpen}>
          <Flex asChild direction="column" gap="10px">

            <Dialog.Content size="3" maxWidth="450px">
              <Box asChild p="10px" pb="0px">
                <Dialog.Title>Edit Name</Dialog.Title>
              </Box>

              <Dialog.Description></Dialog.Description>

              <Box asChild height="40px">
                <TextField.Root name="first_name" placeholder="First name" onChange={updateEditingUserInfo} >
                  <TextField.Slot />
                </TextField.Root>
              </Box>
              <Box asChild height="40px">
                <TextField.Root name="last_name" placeholder="Last name" onChange={updateEditingUserInfo} >
                  <TextField.Slot />
                </TextField.Root>
              </Box>

              <Flex gap="16px" mt="20px" justify="end">
                <Dialog.Close>
                  <Button size="3" variant="soft" color="gray">
                    Cancel
                  </Button>
                </Dialog.Close>
                <Button size="3" variant="solid" onClick={handleEditProfile}>
                  Save
                </Button>
              </Flex>
            </Dialog.Content>
          </Flex>
        </Dialog.Root>

        <Dialog.Root open={isEditBirthdayDialogOpen} onOpenChange={setIsEditBirthdayDialogOpen}>
          <Flex asChild direction="column" gap="10px">

            <Dialog.Content size="3" maxWidth="300px">
              <Box asChild p="10px" pb="0px">
                <Dialog.Title>Edit Birthday</Dialog.Title>
              </Box>

              <Dialog.Description></Dialog.Description>

              <Box asChild height="40px" style={{ width: 'fit-content' }}>
                <TextField.Root name="birthday" type="date" placeholder="Your birthday" onChange={updateEditingUserInfo} >
                  <TextField.Slot />
                  <TextField.Slot />
                </TextField.Root>
              </Box>

              <Flex gap="16px" mt="20px" justify="end">
                <Dialog.Close>
                  <Button size="3" variant="soft" color="gray">
                    Cancel
                  </Button>
                </Dialog.Close>
                <Button size="3" variant="solid" onClick={handleEditProfile}>
                  Save
                </Button>
              </Flex>
            </Dialog.Content>
          </Flex>
        </Dialog.Root>

        <AlertDialog.Root>
          <AlertDialog.Trigger>
            <Box asChild>
              <Button size="3" variant="soft" color="red">
                Sign out
              </Button>
            </Box>
          </AlertDialog.Trigger>
          <AlertDialog.Content maxWidth="450px">
            <AlertDialog.Title>
              Sign out
            </AlertDialog.Title>
            <AlertDialog.Description size="2">
              Are you sure you want to sign out?
            </AlertDialog.Description>

            <Flex gap="3" mt="4" justify="end">
              <AlertDialog.Cancel>
                <Box asChild px="20px">
                  <Button size="3" variant="soft" highContrast>
                    No
                  </Button>
                </Box>
              </AlertDialog.Cancel>
              <AlertDialog.Action>
                <Box asChild px="20px">
                  <Button size="3" variant="solid" color="red" onClick={() => auth.logout()}>
                    Yes
                  </Button>
                </Box>
              </AlertDialog.Action>
            </Flex>
          </AlertDialog.Content>
        </AlertDialog.Root>

      </Flex>
    </Panel>
  );

}

export default Profile