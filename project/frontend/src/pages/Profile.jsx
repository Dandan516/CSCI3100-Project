import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Text, Flex, Box, Avatar, AlertDialog, IconButton, TextField, Table, Button } from "@radix-ui/themes";

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
                  <Table.RowHeaderCell>Username</Table.RowHeaderCell>
                  <Table.Cell>{auth.user?.username || "-"}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.RowHeaderCell>Name</Table.RowHeaderCell>
                  <Table.Cell>{auth.user?.first_name || auth.user?.last_name ? `${auth.user.first_name} ${auth.user.last_name}` : "-"}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.RowHeaderCell>Birthday</Table.RowHeaderCell>
                  <Table.Cell>{auth.user?.birthday || "-"}</Table.Cell>
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