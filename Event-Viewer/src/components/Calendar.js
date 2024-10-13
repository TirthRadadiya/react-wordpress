// https://ej2.syncfusion.com/react/demos/#/bootstrap5/schedule/overview
// https://central.wordcamp.org/wp-json/wp/v2/wordcamps?per_page=100&status=wcpt-scheduled

import React, { useState, useEffect } from "react";

const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

const Calendar = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [startEvents, setStartEvents] = useState({});
  const [days, setDays] = useState([]);

  useEffect(() => {
    generateCalendar(currentMonth, currentYear);
  }, [currentMonth, currentYear]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://central.wordcamp.org/wp-json/wp/v2/wordcamps?per_page=100&status=wcpt-scheduled"
      );
      const data = await response.json();

      data.forEach((event) => {
        const { year, month, day } = convertTimestampToDateTime(
          event["Start Date (YYYY-mm-dd)"]
        );

        setStartEvents((prev) => {
          const prevObj = startEvents[`${day}-${month}-${year}`];
          let newObj;
          if (prevObj) {
            newObj = {
              [`${day}-${month}-${year}`]: [
                ...prevObj,
                { year, month, day, event },
              ],
            };
          } else {
            newObj = {
              [`${day}-${month}-${year}`]: [{ year, month, day, event }],
            };
          }
          return {
            ...prev,
            ...newObj,
          };
        });
      });
    };

    fetchData();
  }, []);

  function convertTimestampToDateTime(timestamp) {
    // Multiply by 1000 to convert seconds to milliseconds
    const date = new Date(timestamp * 1000);

    // Extract month, day, and year
    const year = date.getFullYear();
    let month = date.getMonth() + 1; // getMonth() is zero-based, so add 1
    const day = date.getDate();

    return { year, month, day };
  }

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
              {day &&
                startEvents[`${day}-${currentMonth + 1}-${currentYear}`] && (
                  <p className="tooltiptext">
                    {startEvents[
                      `${day}-${currentMonth + 1}-${currentYear}`
                    ]?.map((currentEvent, index) => (
                      <a href={currentEvent.event.link} key={index}>
                        <span>{currentEvent.event.title.rendered}</span>
                      </a>
                    ))}
                  </p>
                )}
              {day || ""}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Calendar;
