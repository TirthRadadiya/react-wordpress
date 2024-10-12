// https://ej2.syncfusion.com/react/demos/#/bootstrap5/schedule/overview
// https://central.wordcamp.org/wp-json/wp/v2/wordcamps?per_page=100&status=wcpt-scheduled

import React, { useState, useEffect } from "react";
import parse from "html-react-parser";

const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

const Calendar = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [days, setDays] = useState([]);

  useEffect(() => {
    generateCalendar(currentMonth, currentYear);
  }, [currentMonth, currentYear]);

  const generateCalendar = (month, year) => {
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);
    const daysArray = [];

    for (let i = 0; i < firstDay; i++) {
      daysArray.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }

    setDays(daysArray);
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isToday = (day) => {
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <>
      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={handlePreviousMonth}>&lt;</button>
          <h2>
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <button onClick={handleNextMonth}>&gt;</button>
        </div>

        <div className="calendar-grid">
          {weekdays.map((weekday, index) => (
            <div key={index} className="calendar-weekday">
              {weekday}
            </div>
          ))}

          {days.map((day, index) => (
            <div
              key={index}
              className={day && `calendar-day ${isToday(day) ? "today" : ""}`}
            >
              {day || ""}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Calendar;
