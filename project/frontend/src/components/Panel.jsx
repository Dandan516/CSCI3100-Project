import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Flex, Box, IconButton, Separator, ScrollArea, TextField, Text, Card, Avatar, Button } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import PropTypes from 'prop-types';

import NavigateButton from './NavigateButton';
import { useAuth } from "../hooks/AuthProvider";
import * as Icons from '../assets/Icons';
import axios from 'axios';

function Sidebar() {

  const auth = useAuth();
  const navigate = useNavigate();

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
        <NavigateButton url="/" label="Portal" />
        <NavigateButton url="/home" label="Home" />
        <NavigateButton url="/travel" label="Travel Planner" />
        <NavigateButton url="/budget" label="Budget Tracker" />
        <NavigateButton url="/calendar" label="Calendar" />
      </Flex>

      <Box asChild>
        <Card asChild size="1" variant="ghost">
          <Button variant="ghost" onClick={() => navigate("/profile")}>
            <Flex direction="row" gap="14px" align="center" justify="start" display="flex">
              <Avatar
                size="4"
                src={auth.user?.avatarUrl}
                radius="full"
                fallback="T"
              />
              <Box asChild maxWidth="140px">
                <Text size="2" weight="medium" highContrast truncate>
                  {auth.user?.email}
                </Text>
              </Box>
            </Flex>
          </Button>
        </Card>
      </Box>
    </Flex>
  );
}

function Panel({ children }) {

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  const [searchQuery, setSearchQuery] = useState('');
  const updateSearchQuery = (e) => setSearchQuery(e.target.value);

  useEffect(() => {

    const handleResize = () => {
      if (window.innerWidth < 800) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Flex direction="column">
      <Box asChild>
        <Flex direction="row" align="center">
          <Box
            style={{
              width: sidebarCollapsed ? "0px" : "280px", // Adjust width dynamically
              transition: "width 0.3s ease-in-out", // Smooth transition for sidebar width
            }}>
            {sidebarCollapsed ? null : <Sidebar />}
          </Box>
          <Box asChild width="100vw" height="100vh" minWidth="800px">
            <Flex direction="column">
              <Flex align="center" gap="20px" m="20px">
                <IconButton asChild highContrast variant="ghost" radius="medium" onClick={toggleSidebar}>
                  <Icons.Menu />
                </IconButton>
                <Box asChild width="60%" minHeight="48px" px="6px">
                  <TextField.Root
                    size="3"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={updateSearchQuery} >
                    <TextField.Slot>
                      <Icons.MagnifyingGlass />
                    </TextField.Slot>
                  </TextField.Root>
                </Box>
              </Flex>

              <Separator orientation="horizontal" size="4" />

              <ScrollArea type="always" scrollbars="vertical">
                <main>
                  {children}
                </main>
              </ScrollArea>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );

}

Panel.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Panel