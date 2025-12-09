"use client";
import { useState, useCallback, useEffect } from "react";
// import CustomizedMonthView from "./component/calendar/components/CustomizedMonthView";

import staffDataWithEvents from "@/data/staffMemberWithEvent.json";
import totalShiftData from "@/data/totalShiftData.json";
import CalendarScheduler from "./component/calendar/CalendarScheduler";

export default function Home() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [resourceData, setResourceData] = useState(staffDataWithEvents);
  const [shiftData, setShiftData] = useState(totalShiftData);

  const fetchDataForMonth = useCallback(() => {
    setResourceData(staffDataWithEvents);
    setShiftData(totalShiftData);
  }, []);

  // Fetch initial data on mount
  useEffect(() => {
    async function load() {
      await fetchDataForMonth();
    }

    load();
  }, [currentDate]);

  const handleDateChange = useCallback(
    (newDate: Date) => {
      console.log("Date changed to:", newDate);
      setCurrentDate(newDate);
      fetchDataForMonth();
    },
    [fetchDataForMonth]
  );

  return (
    <div>
      <main>
        <CalendarScheduler
          resourceWithEvents={resourceData}
          date={currentDate}
          shiftCount={shiftData}
          onDateChange={handleDateChange}
        />
      </main>
    </div>
  );
}
