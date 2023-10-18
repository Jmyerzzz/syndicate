import React, { useState } from 'react';
import { startOfWeek, addDays, format } from 'date-fns';
import { Dispatch, SetStateAction } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from "@fortawesome/free-solid-svg-icons";

const WeekSelector = ( props: {setSelectedStartOfWeek: Dispatch<SetStateAction<Date>>} ) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const goToPreviousWeek = () => {
    setSelectedDate((prevDate) => {
      const date = addDays(prevDate, -7);
      props.setSelectedStartOfWeek(startOfWeek(date, { weekStartsOn: 1 }));
      return date;
    });
    
  };

  const goToNextWeek = () => {
    setSelectedDate((prevDate) => {
      const date = addDays(prevDate, 7);
      props.setSelectedStartOfWeek(startOfWeek(date, { weekStartsOn: 1 }));
      return date;
    });
  };

  const startOfWeekDate = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const endOfWeekDate = addDays(startOfWeekDate, 6);

  return (
    <div className="flex justify-center items-center mt-3 text-gray-500">
      <button
        className="px-3 mr-1 rounded text-gray-100 hover:text-blue-400"
        onClick={goToPreviousWeek}
      >
        <FontAwesomeIcon icon={faChevronLeft} size={"lg"} />
      </button>
      <div className="text-xs md:text-lg font-bold text-gray-100 rounded">
        Week of {format(startOfWeekDate, 'MMMM d, yyyy')} -{' '}
        {format(endOfWeekDate, 'MMMM d, yyyy')}
      </div>
      <button
        className="px-3 ml-1 rounded text-gray-100 hover:text-blue-400"
        onClick={goToNextWeek}
      >
        <FontAwesomeIcon icon={faChevronRight} size={"lg"} />
      </button>
    </div>
  );
};

export default WeekSelector;