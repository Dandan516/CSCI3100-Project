import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Text, Flex, Box, Avatar, AlertDialog, IconButton, TextField, Table, Button } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import PropTypes from 'prop-types';

import Panel from '../components/Panel';
import { useAuth } from "../hooks/AuthProvider";

function Profile() {

  const auth = useAuth();

  return (
    <Panel>
      <Box asChild p="60px">
        <Flex direction="column" align="center" gap="40px">
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
                  <Table.RowHeaderCell>Name</Table.RowHeaderCell>
                  <Table.Cell>{auth.user?.name || "N/A"}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.RowHeaderCell>Email</Table.RowHeaderCell>
                  <Table.Cell>{auth.user?.email || "N/A"}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.RowHeaderCell>Role</Table.RowHeaderCell>
                  <Table.Cell>{auth.user?.role || "N/A"}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.RowHeaderCell>Joined</Table.RowHeaderCell>
                  <Table.Cell>{auth.user?.joinedDate || "N/A"}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
          </Box>

          <AlertDialog.Root>
            <AlertDialog.Trigger>
              <Box asChild>
                <Button size="3" color="red" variant="solid">
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
      </Box>
    </Panel>
  );

}

export default Profile