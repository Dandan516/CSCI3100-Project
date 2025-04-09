import { useState } from 'react';

import { Text, Flex, Box, Heading, SegmentedControl, Switch, TextField, Table, Button } from "@radix-ui/themes";

import Panel from '../components/Panel';
import { useAuth } from "../hooks/AuthProvider";
import { useTheme } from "../hooks/ThemeProvider";

function Settings() {

  const auth = useAuth();
  const theme = useTheme();

  return (
    <Panel>
      <Flex direction="column" align="start" gap="80px" p="80px">
        <Heading weight="medium">Settings</Heading>

        <Box asChild minWidth="80%">
          <Table.Root size="3">
            <Table.Body>
              <Table.Row>
                <Table.RowHeaderCell>Dark Mode</Table.RowHeaderCell>
                <Table.Cell>
                  <Switch
                    checked={theme.appearance === "dark"}
                    onCheckedChange={(checked) => theme.setAppearance(checked ? "dark" : "light")}
                  />
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </Box>

        {/* Add any additional settings fields here */}
      </Flex>
    </Panel>
  );
}

export default Settings;