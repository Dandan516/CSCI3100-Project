import { Text, Flex, Box, Heading, Select, Switch, TextField, Table, Button } from "@radix-ui/themes";

import Panel from '../components/Panel';
import { useAuth } from "../hooks/AuthProvider";
import { useSettings } from "../hooks/SettingsProvider";

function Settings() {

  const auth = useAuth();
  const settings = useSettings();

  const handleMapProviderChange = (value) => {
    settings.setMapProvider(value);
    localStorage.setItem("mapProvider", value);
  }

  return (
    <Panel>
      <Flex direction="column" align="start" gap="80px" p="80px">

        <Box asChild width="80%">
          <Table.Root size="3" layout="fixed">
            <Table.Header>
              <Table.Row>
                <Box height="60px">
                  <Heading as="h2" weight="medium">Theme Settings</Heading>
                </Box>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.RowHeaderCell>Dark Mode (experimental)</Table.RowHeaderCell>
                <Table.Cell>
                  <Switch
                    checked={settings.themeAppearance === "dark"}
                    onCheckedChange={(checked) => settings.setThemeAppearance(checked ? "dark" : "light")}
                  />
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </Box>

        <Box asChild width="80%">
          <Table.Root size="3" layout="fixed">
            <Table.Header>
              <Table.Row>
                <Box height="60px">
                  <Heading as="h2" weight="medium">Location Search Settings</Heading>
                </Box>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.RowHeaderCell>Map Provider (only applicable to new URLs)</Table.RowHeaderCell>
                <Table.Cell>
                  <Select.Root
                    defaultValue={settings.mapProvider}
                    onValueChange={handleMapProviderChange}>
                    <Select.Trigger radius="medium" />
                    <Select.Content>
                      <Select.Item value="googlemaps">Google Maps</Select.Item>
                      <Select.Item value="applemaps">Apple Maps</Select.Item>
                      <Select.Item value="openstreetmap">OpenStreetMap</Select.Item>
                    </Select.Content>
                  </Select.Root>
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