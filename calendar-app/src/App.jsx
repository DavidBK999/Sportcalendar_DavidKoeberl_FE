import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Importiere React Router
import CalendarApp from "./Components/CalendarApp";
import "./Components/CalendarApp.css";
import Header from "./Components/Header";
import "./Components/Header.css";
import EventDetail from "./Components/EventDetail";
import "./Components/EventDetail.css";
import EventsList from "./Components/EventsList";
import "./Components/EventsList.css";
import sportData from "./data/sportData (10).json";

const App = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const initialEvents = sportData.data.map((game) => ({
      id: game.id || Date.now() + Math.random(),
      date: new Date(game.dateVenue),
      time: game.timeVenueUTC,
      text: game.awayTeam?.name || "", // Optional Chaining, falls awayTeam nicht existiert, bleibt leer
      text2: game.homeTeam?.name || "", // Optional Chaining, falls homeTeam nicht existiert, bleibt leer
      sport: game.sport || "Unknown", // Falls sport nicht vorhanden, Standardwert "Unknown"
    }));
    setEvents(initialEvents);
  }, []);

  const filterEvents = (events) => {
    // Hier kannst du die Filter-Logik einfügen, z. B. nach Monat, Jahr, Team, etc.
    return events; // Zurzeit keine Filter
  };

  return (
    <Router>
      {" "}
      {/* Füge den Router um die gesamte App */}
      <Header />
      <div className="container">
        <Routes>
          <Route
            path="/"
            element={<CalendarApp events={events} setEvents={setEvents} />}
          />
          <Route path="/" element={<CalendarApp events={events} />} />
          <Route
            path="/events"
            element={<EventsList events={events} filterEvents={filterEvents} />}
          />
          <Route
            path="/event/:eventId"
            element={<EventDetail events={events} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
