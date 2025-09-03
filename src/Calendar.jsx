import React, { useState } from "react";

const months = [
  "January","February","March",
  "April","May","June",
  "July","August","September",
  "October","November","December"
];

export default function Calendar({ year }) {
  const [selectedDays, setSelectedDays] = useState({});

  const toggleDay = (month, day) => {
    const key = `${year}-${month}-${day}`;
    setSelectedDays((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderMonth = (monthIndex) => {
    const date = new Date(year, monthIndex + 1, 0);
    const daysInMonth = date.getDate();
    const firstDay = new Date(year, monthIndex, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="day"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${year}-${monthIndex}-${d}`;
      days.push(
        <div
          key={key}
          className={`day ${selectedDays[key] ? "selected" : ""}`}
          onClick={() => toggleDay(monthIndex, d)}
        >
          {d}
        </div>
      );
    }

    return (
      <div className="month" key={monthIndex}>
        <h3>{months[monthIndex]} {year}</h3>
        <div className="days">{days}</div>
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <div className="month-grid">
        {months.map((_, idx) => renderMonth(idx))}
      </div>
      <div className="legend">
        <p><span style={{ background: "#ffcc00", padding: "5px" }}>Selected</span> = Event</p>
        <button onClick={() => window.print()}>Print Calendar</button>
      </div>
    </div>
  );
}
