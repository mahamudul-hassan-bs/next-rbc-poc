"use client";
import React from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  subMonths,
  addMonths,
  subWeeks,
  addWeeks,
} from "date-fns";
import { enUS } from "date-fns/locale";
import CustomizedMonthView from "./components/CustomizedMonthView";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 6 }),
  getDay,
  locales,
});

interface CalendarSchedulerProps {
  date: number | Date;
  resourceWithEvents: any;
  shiftCount: any;
  onDateChange?: (date: Date) => void;
}

const CalendarScheduler = ({
  date,
  resourceWithEvents,
  shiftCount,
  onDateChange,
}: CalendarSchedulerProps) => {
  const [currentDate, setCurrentDate] = React.useState(date);
  function MonthViewWrapper(props) {
    return (
      <CustomizedMonthView
        resourceWithEvents={props.resources}
        date={props.date}
        shiftCount={shiftCount}
      />
    );
  }

  Object.assign(MonthViewWrapper, {
    title: (date) => format(date, "MMMM yyyy"),
    navigate: (date, action) => {
      switch (action) {
        case "PREV":
          return subMonths(date, 1);
        case "NEXT":
          return addMonths(date, 1);
        default:
          return date;
      }
    },
  });
  const customizedViews = {
    month: MonthViewWrapper,
    // week: WeekViewWrapper,
  };
  return (
    <div className="bg-#f5ff7fa min-h-screen p-20">
      <Calendar
        localizer={localizer}
        resources={resourceWithEvents}
        // events={myEventsList}
        startAccessor="start"
        endAccessor="end"
        date={currentDate}
        views={customizedViews}
        onNavigate={(newDate) => {
          setCurrentDate(newDate);
          // Call parent callback when date changes
          if (onDateChange) {
            onDateChange(newDate);
          }
        }}
        style={{
          width: "100%",
        }}
        component
      />
    </div>
  );
};

export default CalendarScheduler;
