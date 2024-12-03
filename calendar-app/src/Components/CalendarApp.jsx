import { useState, useEffect } from "react";
import sportData from "../data/sportData (10).json";
import { Link } from "react-router-dom";

console.log(sportData); // Debugging: Log the imported sports data

const CalendarApp = () => {
  // Constants for weekdays and months
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthsOfYear = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Get the current date
  const currentDate = new Date();
  // State variables for calendar and events
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [showEventPopup, setShowEventPopup] = useState(false);
  const [events, setEvents] = useState([]); // List of events
  const [eventTime, setEventTime] = useState({ hours: "00", minutes: "00" });
  const [eventAwayTeam, setAwayTeam] = useState("");
  const [eventHomeTeam, setHomeTeam] = useState("");
  const [editingEvent, setEditingEvents] = useState(null); // Track event being edited
  const [showPastDatePopup, setShowPastDatePopup] = useState(false);
  const [electedDayEvents, setSelectedDayEvents] = useState([]);

  // Dynamic text effect on top of calendar

  const [dynamicText, setDynamicText] = useState(
    "Select a day to explore upcoming games!"
  );
  const [hoveredDayEvents, setHoveredDayEvents] = useState([]); // Events on hovered day
  const [hoveredEventDetail, setHoveredEventDetail] = useState(null); // Detail of hovered event

  // Text rotation options
  const textVariants = [
    "For event details click the info button in the event list!",
    "Click on a date to simply create a new event!",
    "Hover over a day to see the event infos!",
  ];

  // Effect to cycle through text variants every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setDynamicText((prevText) => {
        const currentIndex = textVariants.indexOf(prevText);
        const nextIndex = (currentIndex + 1) % textVariants.length;
        return textVariants[nextIndex];
      });
    }, 3000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Filter and search states
  const [searchText, setSearchText] = useState(""); // Text input for search
  const [selectedMonth, setSelectedMonth] = useState(null); // Month filter
  const [selectedYear, setSelectedYear] = useState(currentYear); // Year filter
  const [selectedSport, setSelectedSport] = useState(""); // Sport filter

  // Populate events from imported data on mount
  useEffect(() => {
    const initialEvents = sportData.data
      .filter((game) => game.awayTeam && game.homeTeam) // Include only events with valid teams
      .map((game) => ({
        id: game.id || Date.now() + Math.random(), // Generate unique ID if missing
        date: new Date(game.dateVenue),
        time: game.timeVenueUTC,
        text: game.awayTeam.name,
        text2: game.homeTeam.name,
        sport: game.sport || "Unknown",
      }));
    setEvents(initialEvents); // Set events in state
  }, []);

  // Handle hovering over a specific day
  const handleDayHover = (day) => {
    const hoveredDate = new Date(currentYear, currentMonth, day);
    setHoveredDayEvents(
      events.filter((event) => isSameDay(new Date(event.date), hoveredDate))
    );
  };

  // Utility function to check if two dates are on the same day
  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Filter events based on search and selected filters
  const filterEvents = () => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      const matchesMonth =
        selectedMonth === null || selectedMonth === eventDate.getMonth();
      const matchesYear =
        selectedYear === null || selectedYear === eventDate.getFullYear();
      const matchesSearch =
        event.text.toLowerCase().includes(searchText.toLowerCase()) ||
        event.text2.toLowerCase().includes(searchText.toLowerCase());
      const matchesSport =
        selectedSport === "" || event.sport === selectedSport;
      return matchesMonth && matchesYear && matchesSearch && matchesSport;
    });
  };

  // Extract unique sports from data
  const uniqueSports = [...new Set(sportData.data.map((event) => event.sport))];

  // Calculate number of days in the current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // Day of week for the 1st

  // Handlers for navigating between months
  const prevMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
    setCurrentYear((prevYear) =>
      currentMonth === 0 ? prevYear - 1 : prevYear
    );
  };

  const nextMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
    setCurrentYear((prevYear) =>
      currentMonth === 11 ? prevYear + 1 : prevYear
    );
  };
  const PastDatePopup = ({ onClose }) => (
    <div className="popup-overlay">
      <div className="popup">
        <p>Cannot create events for past dates!</p>{" "}
        {/* Display message for invalid past dates */}
        <button onClick={onClose}>OK</button> {/* Closes the popup */}
      </div>
    </div>
  );

  const handleDayClick = (day) => {
    const clickedDate = new Date(currentYear, currentMonth, day); // The clicked date.
    const today = new Date(); // Today's date.

    if (clickedDate >= today || isSameDay(clickedDate, today)) {
      // Checks if the clicked date is today or in the future.
      setSelectedDate(clickedDate); // Saves the clicked date.
      const filteredEvents = events.filter((event) =>
        isSameDay(new Date(event.date), clickedDate)
      );
      setSelectedDayEvents(filteredEvents); // Displays events for the selected date.
      setShowEventPopup(true); // Opens the event creation/edit popup.
      setEventTime({ hours: "00", minutes: "00" }); // Resets the time to 00:00.
      setAwayTeam(""); // Clears the away team name.
      setHomeTeam(""); // Clears the home team name.
      setEditingEvents(null); // Disables editing mode.
    } else {
      setShowPastDatePopup(true); // Displays a popup for invalid past dates.
    }
  };

  const getEventCountForDay = (day) => {
    const currentDate = new Date(currentYear, currentMonth, day); // Creates a date for the given day.
    return events.filter((event) =>
      isSameDay(new Date(event.date), currentDate)
    ).length; // Returns the number of events on this day.
  };

  const handleEventSubmit = () => {
    if (
      !eventAwayTeam ||
      !eventHomeTeam ||
      !eventTime.hours ||
      !eventTime.minutes ||
      !selectedSport // Check if sport exists
    ) {
      alert("Please fill in all the forms.");
      return; //
    }

    const newEvent = {
      id: Date.now(), // Unique ID
      date: selectedDate,
      time: `${eventTime.hours}:${eventTime.minutes}`,
      text: eventAwayTeam,
      text2: eventHomeTeam,
      sport: selectedSport || "General", // Default sport if not chosen
    };

    const updatedEvents = editingEvent
      ? events.map((event) =>
          event.id === editingEvent.id
            ? {
                ...event,
                date: selectedDate,
                time: `${eventTime.hours}:${eventTime.minutes}`,
                text: eventAwayTeam,
                text2: eventHomeTeam,
                sport: selectedSport || "General",
              }
            : event
        )
      : [newEvent, ...events]; // Inserts new event at the beginning of list

    setEvents(updatedEvents); // Sets status for new event
    setShowEventPopup(false); // Close popup
  };

  const handleEditEvent = (event) => {
    setSelectedDate(new Date(event.date)); // Sets the date of the event being edited.
    setEventTime({
      hours: event.time.split(":")[0], // Extracts the hours from the time.
      minutes: event.time.split(":")[1], // Extracts the minutes from the time.
    });
    setAwayTeam(event.text); // Sets the away team's name.
    setHomeTeam(event.text2); // Sets the home team's name.
    setEditingEvents(event); // Saves the event being edited.
    setShowEventPopup(true); // Opens the event popup.
  };

  const handleDeleteEvent = (eventId) => {
    const updatedEvents = events.filter((event) => event.id !== eventId); // Removes the event with the given ID.

    setEvents(updatedEvents); // Updates the event list.
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target; // Reads the name and value from the input field.

    setEventTime((prevTime) => ({
      ...prevTime, // Retain existing time values.
      [name]: value.padStart(2, "0"), // Pads the value with leading zeros (e.g., "5" → "05").
    }));
  };

  return (
    <div className="calendar-app">
      <img src="./images/soccer-player.png" alt="" className="soccer-player" />
      <div className="calendar">
        <div className="navigate-date">
          <h2 className="month">{monthsOfYear[currentMonth]},</h2>
          <h2 className="year">{currentYear}</h2>
          <div className="buttons">
            <i className="bx bx-chevron-left" onClick={prevMonth}></i>
            <i className="bx bx-chevron-right" onClick={nextMonth}></i>
          </div>
        </div>

        <div className="eventsOfDay">
          {hoveredDayEvents.length > 0 ? (
            <div>
              <h3>Events for hovered Date</h3>
              <ul>
                {hoveredDayEvents.map((event, index) => (
                  <li key={index} className="hoverList">
                    {event.time.split(":").slice(0, 2).join(":")} | |
                    <strong>{event.sport}</strong>: {event.text.toUpperCase(0)}{" "}
                    vs. {event.text2.toUpperCase(0)}
                    <br />
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <h3>{dynamicText}</h3>
          )}
        </div>
        <div className="weekdays">
          {daysOfWeek.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="days">
          {[...Array(firstDayOfMonth).keys()].map((_, index) => (
            <span key={`empty-${index}`} />
          ))}
          {[...Array(daysInMonth).keys()].map((day) => {
            const eventCount = getEventCountForDay(day + 1); // Number of events on that
            return (
              <span
                key={day + 1}
                className={` 
    ${
      isSameDay(new Date(currentYear, currentMonth, day + 1), currentDate)
        ? "current-day"
        : ""
    }
    ${eventCount > 0 ? "marked-day" : ""}
  `}
                onClick={() => handleDayClick(day + 1)}
                onMouseEnter={() => handleDayHover(day + 1)}
              >
                {day + 1}
                {eventCount > 0 && (
                  <div className="event-count">{eventCount}</div>
                )}
              </span>
            );
          })}
        </div>
      </div>

      <div className="events">
        <div className="filter">
          <input
            type="text"
            placeholder="Search by team"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <select
            value={selectedMonth}
            onChange={(e) =>
              setSelectedMonth(
                e.target.value === "" ? null : parseInt(e.target.value)
              )
            }
          >
            <option value="">All Months</option>
            {monthsOfYear.map((month, index) => (
              <option value={index} key={index}>
                {month}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) =>
              setSelectedYear(
                e.target.value === "" ? null : parseInt(e.target.value)
              )
            }
          >
            <option value="">All Years</option>
            <option value={2023}>2023</option>
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
          </select>
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
          >
            <option value="">All Sports</option>
            {uniqueSports.map((sport, index) => (
              <option key={index} value={sport}>
                {sport}
              </option>
            ))}
          </select>
        </div>

        {filterEvents().map((event, index) => (
          <div className="event" key={index}>
            <div className="event-date-wrapper">
              <div className="event-date">{`${
                monthsOfYear[event.date.getMonth()]
              } ${event.date.getDate()}, ${event.date.getFullYear()}`}</div>
              <div className="event-time">
                {event.time ? event.time.split(":").slice(0, 2).join(":") : ""}
              </div>
            </div>
            <div className="event-teams">
              <div className="event-team1">
                <div className="event-text">{event.text}</div>
                <img
                  src="../images/al-duhail-sc.svg"
                  alt=""
                  className="event-soccer-icon"
                />
              </div>
              <h2 className="event-versus">VS</h2>
              <div className="event-team2">
                <img
                  src="../images/al-duhail-sc.svg"
                  alt=""
                  className="event-soccer-icon"
                />
                <div className="event-text">{event.text2}</div>
              </div>
            </div>
            <div
              className="event-details"
              onMouseEnter={() => setHoveredEventDetail(event.id)} // Will be set when hovered
              onMouseLeave={() => setHoveredEventDetail(null)} // Hides popup
            >
              <Link to={`/event/${event.id}`}>
                <img src="../images/info.png" alt="" />
              </Link>
              {hoveredEventDetail === event.id && (
                <div className="hover-popup">
                  <p>
                    Details for {event.text} vs. {event.text2}
                  </p>

                  {}
                </div>
              )}
            </div>

            <div className="event-buttons">
              <i
                className="bx bxs-edit-alt"
                onClick={() => {
                  handleEditEvent(event);
                }}
              ></i>
              <i
                className="bx bxs-message-alt-x"
                onClick={() => handleDeleteEvent(event.id)}
              ></i>
            </div>
          </div>
        ))}
      </div>

      {showEventPopup && (
        // Inside popup for creating new event or updating it
        <div className="event-popup">
          <div className="time-input">
            <div className="event-popup-time">Time</div>
            <input
              type="number"
              name="hours"
              min={0}
              max={24}
              className="hours"
              value={eventTime.hours}
              onChange={handleTimeChange}
            />
            <input
              type="number"
              name="minutes"
              min={0}
              max={60}
              className="minutes"
              value={eventTime.minutes}
              onChange={handleTimeChange}
            />
          </div>

          <h2>Away Team</h2>
          <textarea
            placeholder="Enter Away Team"
            value={eventAwayTeam}
            onChange={(e) => {
              if (e.target.value.length <= 30) {
                setAwayTeam(e.target.value); // Maximum 30 chars
              }
            }}
          ></textarea>

          <h2>Home Team</h2>
          <textarea
            placeholder="Enter Home Team"
            value={eventHomeTeam}
            onChange={(e) => {
              if (e.target.value.length <= 30) {
                setHomeTeam(e.target.value); // Maximum 30 chars
              }
            }}
          ></textarea>

          {/* Dropdown for chosing sport */}
          <h2>Sport</h2>
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
          >
            <option value="">Select Sport</option>
            {uniqueSports.map((sport, index) => (
              <option key={index} value={sport}>
                {sport}
              </option>
            ))}
          </select>

          <button className="event-popup-btn" onClick={handleEventSubmit}>
            {editingEvent ? "Update Event" : "Add Event"}
          </button>
          <button
            className="close-event-popup"
            onClick={() => setShowEventPopup(false)}
          >
            <i className="bx bx-x"></i>
          </button>
        </div>
      )}
      {showPastDatePopup && (
        <PastDatePopup onClose={() => setShowPastDatePopup(false)} />
      )}
    </div>
  );
};

export default CalendarApp;
