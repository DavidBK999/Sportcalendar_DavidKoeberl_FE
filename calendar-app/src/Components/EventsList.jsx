import { useState, useEffect } from "react";
import sportData from "../data/sportData (10).json";
import { Link } from "react-router-dom";

// Log imported data to verify its structure
console.log(sportData);

const CalendarApp = () => {
  // Constants for rendering days and months
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

  // State management for event filter
  const currentDate = new Date();
  const [] = useState(currentDate.getMonth());
  const [currentYear] = useState(currentDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState(currentDate);

  // Event and popup states
  const [events, setEvents] = useState([]);
  const [showEventPopup, setShowEventPopup] = useState(false);
  const [showPastDatePopup, setShowPastDatePopup] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);

  // States for creating and editing events
  const [eventTime, setEventTime] = useState({ hours: "00", minutes: "00" });
  const [eventAwayTeam, setAwayTeam] = useState("");
  const [eventHomeTeam, setHomeTeam] = useState("");
  const [editingEvent, setEditingEvents] = useState(null);

  // States for interactive effects (hover & typing text)
  const [hoveredDayEvents, setHoveredDayEvents] = useState([]);
  const [hoveredEventDetail, setHoveredEventDetail] = useState(null);
  const [displayedText, setDisplayedText] = useState("");
  const [dynamicText, setDynamicText] = useState(
    "Select a day to explore upcoming games!"
  );
  const textVariants = [
    "For event details click the info button in the event list!",
    "Click on a date to simply create a new event!",
    "Hover over a day to see the event infos!",
  ];

  // Filter states
  const [searchText, setSearchText] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedSport, setSelectedSport] = useState("");

  // Typing effect: rotate through text variants every 3 seconds
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

  // Initialize events from imported sport data
  useEffect(() => {
    const initialEvents = sportData.data
      .filter((game) => game.awayTeam && game.homeTeam) // Only valid games
      .map((game) => ({
        id: game.id || Date.now() + Math.random(), // Generate unique IDs
        date: new Date(game.dateVenue),
        time: game.timeVenueUTC,
        text: game.awayTeam.name,
        text2: game.homeTeam.name,
        sport: game.sport || "Unknown",
      }));
    setEvents(initialEvents);
  }, []);

  // Utility: Check if two dates represent the same day
  const isSameDay = (date1, date2) =>
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();

  // Filter events based on selected filters (month, year, search text, sport)
  const filterEvents = () => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        (selectedMonth === null || selectedMonth === eventDate.getMonth()) &&
        (selectedYear === null || selectedYear === eventDate.getFullYear()) &&
        (event.text.toLowerCase().includes(searchText.toLowerCase()) ||
          event.text2.toLowerCase().includes(searchText.toLowerCase())) &&
        (selectedSport === "" || event.sport === selectedSport)
      );
    });
  };
  const uniqueSports = [
    ...new Set(sportData.data.map((event) => event.sport)), // Alle einzigartigen Sportarten extrahieren
  ];

  // Event creation or editing submission
  const handleEventSubmit = () => {
    const updatedEvents = editingEvent
      ? events.map((event) =>
          event.id === editingEvent.id
            ? {
                ...event,
                date: selectedDate,
                time: `${eventTime.hours}:${eventTime.minutes}`,
                text: eventAwayTeam,
                text2: eventHomeTeam,
              }
            : event
        )
      : [
          ...events,
          {
            id: Date.now(),
            date: selectedDate,
            time: `${eventTime.hours}:${eventTime.minutes}`,
            text: eventAwayTeam,
            text2: eventHomeTeam,
            sport: selectedSport || "General",
          },
        ];

    setEvents(updatedEvents);
    setShowEventPopup(false);
  };

  const handleEditEvent = (event) => {
    setSelectedDate(new Date(event.date));
    setEventTime({
      hours: event.time.split(":")[0],
      minutes: event.time.split(":")[1],
    });
    setAwayTeam(event.text);
    setHomeTeam(event.text2);
    setEditingEvents(event);
    setShowEventPopup(true);
  };

  const handleDeleteEvent = (eventId) => {
    const updatedEvents = events.filter((event) => event.id !== eventId);

    setEvents(updatedEvents);
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;

    setEventTime((prevTime) => ({
      ...prevTime,
      [name]: value.padStart(2, "0"),
    }));
  };

  return (
    <div className="calendar-app">
      <img src="./images/soccer-player.png" alt="" className="soccer-player" />
      <div className="events" id="events">
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
              onMouseEnter={() => setHoveredEventDetail(event.id)} // Will be shown when info button is hovered
              onMouseLeave={() => setHoveredEventDetail(null)} // Hides popup when leave hover
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
            placeholder="Enter Event Text (Maximum 60 Characters)"
            value={eventAwayTeam}
            onChange={(e) => {
              if (e.target.value.length <= 30) {
                setAwayTeam(e.target.value);
              }
            }}
          ></textarea>

          <h2>Home Team</h2>
          <textarea
            placeholder="Enter Event Text (Maximum 60 Characters)"
            value={eventHomeTeam}
            onChange={(e) => {
              if (e.target.value.length <= 30) {
                setHomeTeam(e.target.value);
              }
            }}
          ></textarea>

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
        <showPastDatePopup onClose={() => setShowPastDatePopup(false)} />
      )}
    </div>
  );
};

export default CalendarApp;
