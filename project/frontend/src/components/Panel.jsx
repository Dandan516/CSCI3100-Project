import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Flex, Box, IconButton, Separator, ScrollArea, TextField, Text, Card, Avatar, Button, Tooltip, DropdownMenu } from "@radix-ui/themes";

import PropTypes from 'prop-types';

import NavigateButton from './NavigateButton';
import { useAuth } from "../hooks/AuthProvider";
import * as Icons from '../assets/Icons';

function Sidebar() {

  return (
    <Flex
      minHeight="100vh"
      direction="column"
      justify="between"
      p="40px"
      pt="60px"
      style={{
        boxShadow: "4px 0 10px rgba(0, 0, 0, 0.1)", // Shadow effect
        zIndex: 10, // Ensure it is above the main panel
        transition: "width 0.3s ease-in-out", // Smooth transition for width
        overflow: "hidden", // Prevent content overflow during collapse
      }}>

      <Flex direction="column" align="center" gap="20px" >
        <NavigateButton url="/dashboard" label="Dashboard" />
        <NavigateButton url="/travel" label="Travel Planner" />
        <NavigateButton url="/budget" label="Budget Tracker" />
        <NavigateButton url="/calendar" label="Calendar" />
      </Flex>

    </Flex>
  );
}

function Panel({ children }) {
  const auth = useAuth();
  const navigate = useNavigate();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Sidebar is collapsed by default
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const updateSearchQuery = (e) => setSearchQuery(e.target.value);

  useEffect(() => {
    // Remove the logic that auto-expands the sidebar based on window size
    const handleResize = () => {
      if (window.innerWidth < 800) {
        setIsSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Flex direction="column">
      <Flex direction="row" align="center">
        <Box
          style={{
            width: isSidebarCollapsed ? "0px" : "280px", // Adjust width dynamically
            transition: "width 0.3s ease-in-out", // Smooth transition for sidebar width
          }}
        >
          {isSidebarCollapsed ? null : <Sidebar />}
        </Box>

        <Flex width="100vw" height="100vh" minWidth="800px" direction="column">
          {/* Header */}
          <Flex justify="between" mx="20px" my="14px">
            <Flex width="100%" align="center" gap="20px">
              <IconButton highContrast variant="ghost" radius="medium" onClick={toggleSidebar}>
                <Icons.Menu width="40px" />
              </IconButton>
              <Box asChild minWidth="60%" minHeight="48px" px="6px">
                <TextField.Root
                  size="3"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={updateSearchQuery}
                >
                  <TextField.Slot>
                    <Icons.MagnifyingGlass />
                  </TextField.Slot>
                </TextField.Root>
              </Box>
            </Flex>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button style={{ all: 'unset', cursor: 'pointer' }}>
                  <Avatar
                    size="4"
                    src={auth.user?.avatarUrl}
                    radius="full"
                    fallback={auth.user.username?.charAt(0)}
                  />
                </Button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Content align="end">
                <Box asChild height="50px">
                  <DropdownMenu.Item disabled>
                    <Text size="3" weight="medium" truncate style={{ color: 'white', cursor: 'default' }}>
                      {auth.user.email}
                    </Text>
                  </DropdownMenu.Item>
                </Box>
                <DropdownMenu.Item onClick={() => navigate('/profile')}>
                  <Icons.Person />Profile
                </DropdownMenu.Item>
                <DropdownMenu.Item onClick={() => navigate('/settings')}>
                  <Icons.Gear />Settings
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item color="red" onClick={() => auth.logout()}>
                  <Icons.Exit />Sign out
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Flex>

          <Separator orientation="horizontal" size="4" />

          <ScrollArea type="always" scrollbars="vertical">
            <main>{children}</main>
          </ScrollArea>
        </Flex>
      </Flex>
    </Flex>
  );
}

Panel.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Panel