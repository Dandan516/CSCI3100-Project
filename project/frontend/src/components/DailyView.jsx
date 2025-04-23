import { useEffect, useState, createContext } from 'react';

import PropTypes from 'prop-types';

import { Box, Flex, Text, IconButton } from "@radix-ui/themes";
import * as Icons from "../assets/Icons";

const DailyViewContext = createContext();

function DailyView ({ children, startDate, endDate }) {
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [dateList, setDateList] = useState([]);

  const generateDateList = () => {
    const tempDateList = [];
    let currentDate = new Date(startDate);
    const endDateObj = new Date(endDate);

    while (currentDate <= endDateObj) {
      tempDateList.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setDateList(tempDateList);
  };

  useEffect(() => {
    if (startDate && endDate) {
      generateDateList(startDate, endDate);
    }
  }, [startDate, endDate]);

  const selectedDate = dateList[selectedDateIndex];

  const handlePreviousDay = () => {
    if (selectedDateIndex > 0) {
      setSelectedDateIndex(selectedDateIndex - 1);
    }
  };

  const handleNextDay = () => {
    if (selectedDateIndex < dateList.length - 1) {
      setSelectedDateIndex(selectedDateIndex + 1);
    }
  };

  return (
    <Flex direction="column" gap="40px" py="40px">
      <Flex direction="row" justify="center" align="center">
        <IconButton variant="soft" size="2" onClick={handlePreviousDay} disabled={selectedDateIndex === 0}>
          <Icons.ChevronLeft />
        </IconButton>
        <Box asChild width="300px">
          <Text size="4" weight="medium" align="center">
            {selectedDate && new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>
        </Box>
        <IconButton variant="soft" size="2" onClick={handleNextDay} disabled={selectedDateIndex === dateList.length - 1}>
          <Icons.ChevronRight />
        </IconButton>
      </Flex>
      <DailyViewContext.Provider value={{ selectedDate }}>
        {children(selectedDate)}
      </DailyViewContext.Provider>
    </Flex>
  );
}

DailyView.propTypes = {
  children: PropTypes.func,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
};
DailyView.defaultProps = {
  children: null,
};

export default DailyView;