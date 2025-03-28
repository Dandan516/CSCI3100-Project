import React, { useState, useEffect } from 'react';

import { Flex, Box, IconButton, Separator, ScrollArea, TextField } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import PropTypes from 'prop-types';

import Sidebar from './Sidebar';
import * as Icons from '../assets/Icons';
import '../App.css';

function Panel({ pageElement}) {

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
        <Flex direction="row" align="center" >

          {sidebarCollapsed ? null : <Sidebar />}

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
                  {pageElement}
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
  pageElement: PropTypes.element.isRequired,
};

export default Panel