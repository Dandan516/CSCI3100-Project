import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Text, Flex, Box, Tabs, Grid, Button, Popover } from "@radix-ui/themes";

import Panel from '../components/Panel';
import { useAuth } from "../hooks/AuthProvider";

function Calendar() {
  const auth = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState([]);

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarDays = [];
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(null); // Empty slots for days before the first day of the month
    }
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push(i);
    }
    setDays(calendarDays);
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <Panel>
      <Flex width="100%" my="40px" direction="column" align="center" gap="40px">

        <Box asChild px="60px">
          <Flex justify="center" align="center" width="100%">
            <Button variant="soft" onClick={handlePrevMonth}>Previous</Button>
            <Flex width="200px" justify="center">
              <Text size="5" weight="medium">
                {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
              </Text>
            </Flex>
            <Button variant="soft" onClick={handleNextMonth}>Next</Button>
          </Flex>
        </Box>

        <Box asChild px="60px" width="100%">
          <Grid columns="7">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <Flex
                key={index}
                height="60px"
                justify="end"
                align="start"
                p="5px">
                <Text size="5" weight="medium">
                  {day}
                </Text>
              </Flex>
            ))}
            {days.map((day, index) => {
              const isToday =
                day &&
                currentDate.getFullYear() === new Date().getFullYear() &&
                currentDate.getMonth() === new Date().getMonth() &&
                day === new Date().getDate();

              return (
                <Flex
                  key={index}
                  direction="column"
                  height="100px"
                  align="end"
                  justify="start">
                  {isToday ? (
                    <Flex
                      asChild
                      width="24px"
                      height="24px"
                      align="center"
                      justify="center"
                      py="5px"
                      style={{ backgroundColor: 'white', borderRadius: '100%' }}>
                      <Text weight="medium" style={{ color: 'black', zIndex: '1'}}>
                        {day || ''}
                      </Text>
                    </Flex>
                  ) : (
                    <Box asChild px="5px">
                      <Text weight="medium">
                        {day || ''}
                      </Text>
                    </Box>
                  )}
                </Flex>
              );
            })}
          </Grid>
        </Box>
      </Flex>
    </Panel>
  );
}

export default Calendar;

Calendar.propTypes = {
  plans: PropTypes.array,
};