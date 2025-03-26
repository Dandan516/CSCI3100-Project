import React, { useState, useEffect } from 'react';

import { Flex, Box, IconButton, Separator, ScrollArea } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import PropTypes from 'prop-types';

import Sidebar from './Sidebar';
import * as Icons from '../assets/Icons';
import '../App.css';

function Panel({ pageElement, currentUser }) {

  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 800) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
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

          {isCollapsed ? null : <Sidebar currentUser={currentUser}/>}

          <Box asChild width="100vw" height="100vh" minWidth="800px">

            <Flex direction="column">

              <Box asChild width="40px" mx="18px" my="14px">
                <IconButton asChild highContrast variant="ghost" radius="medium" onClick={toggleSidebar}>
                  {/* {isCollapsed ? <Icons.LayoutSidebarLeftExpand /> : <Icons.LayoutSidebarLeftCollapseFilled />} */}
                  <Icons.Menu/>
                </IconButton>
              </Box>

              <Separator orientation="horizontal" size="4"/>

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
  currentUser: PropTypes.object.isRequired,
};

export default Panel