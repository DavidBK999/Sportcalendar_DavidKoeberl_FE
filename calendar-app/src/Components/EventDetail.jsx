import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

// Material-UI und framer-motion is used just for this component as a demonstration

import {
  CircularProgress, // Loading spinner from Material-UI
  Box, // Container element from Material-UI
  Typography, // Text element with various styles
  Tabs, // Tab container
  Tab, // Individual tab
  Divider, // Horizontal line for separating content
  Card, // Card container for content
} from "@mui/material";
import { motion } from "framer-motion";
import {
  SportsSoccer,
  EmojiEvents,
  CalendarToday,
  Stadium,
  Home,
  Flag,
} from "@mui/icons-material"; // Material-UI icons for enhancing UI
import sportData from "../data/sportData (10).json";
import "./EventDetail.css";

const EventDetail = () => {
  const { eventId } = useParams(); // Extract the `eventId` parameter from the URL
  const [eventData, setEventData] = useState(null); // State to store event data
  const [loading, setLoading] = useState(true); // State for the loading indicator
  const [error, setError] = useState(null); // State to handle errors
  const [tabValue, setTabValue] = useState(0); // State to manage the selected tab

  // Fetch the event data based on the `eventId` parameter
  useEffect(() => {
    try {
      // Find the event in the data based on the `eventId`
      const selectedEvent = sportData.data.find(
        (event) => event.id === parseInt(eventId)
      );
      if (!selectedEvent) throw new Error("Event not found"); // Handle case where event is not found
      setEventData(selectedEvent); // Update state with event data
    } catch (err) {
      setError(err.message); // Set the error message if something goes wrong
    } finally {
      setLoading(false); // Set loading to false after data processing
    }
  }, [eventId]); // Re-run this effect when `eventId` changes

  // Display a loading spinner while data is being fetched
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Display an error message if there is an error
  if (error) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h4" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  // Handle tab selection changes
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue); // Update the selected tab index
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} // Initial animation state (hidden and shifted down)
      animate={{ opacity: 1, y: 0 }} // Final animation state (fully visible and in position)
      exit={{ opacity: 0, y: 50 }} // Exit animation state (hidden and shifted down)
      transition={{ duration: 0.5 }} // Animation duration in seconds
    >
      <div className="event-detail-container">
        {/* Header Section */}
        <div className="event-detail-header">
          <Typography variant="h3" gutterBottom>
            {eventData.originCompetitionName} {/* Event competition name */}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <CalendarToday sx={{ fontSize: 20, verticalAlign: "middle" }} />{" "}
            {eventData.dateVenue} | {eventData.timeVenueUTC} UTC{" "}
            {/* Date and time */}
          </Typography>
          <Typography variant="body2">
            <Stadium sx={{ fontSize: 20, verticalAlign: "middle" }} />{" "}
            {eventData.stadium} {/* Venue information */}
          </Typography>
        </div>

        {/* Tab Navigation */}
        <Tabs
          value={tabValue} // Active tab index
          onChange={handleTabChange} // Function to handle tab changes
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Overview" icon={<EmojiEvents />} />
          <Tab label="Teams" icon={<SportsSoccer />} />
          <Tab label="Results" icon={<Flag />} />
          <Tab label="Stage Info" icon={<Home />} />
        </Tabs>

        {/* Conditional Rendering for Tab Content */}
        {tabValue === 0 && (
          <div className="event-info">
            {/* Overview Section */}
            <Card className="info-card">
              <Typography variant="h6">Season</Typography>
              <Typography variant="body1">{eventData.season}</Typography>
            </Card>
            <Card className="info-card">
              <Typography variant="h6">Status</Typography>
              <Typography variant="body1">{eventData.status}</Typography>
            </Card>
          </div>
        )}

        {tabValue === 1 && (
          <div className="teams">
            {/* Teams Section */}
            {/* Home Team Information */}
            <div className="team-card">
              <Typography variant="h6">🏠 Home Team</Typography>
              <Typography variant="body1">
                {eventData.homeTeam.officialName}
              </Typography>
              <Typography variant="body2">
                Country Code: {eventData.homeTeam.teamCountryCode}
              </Typography>
            </div>

            {/* Away Team Information */}
            <div className="team-card">
              <Typography variant="h6">🚩 Away Team</Typography>
              <Typography variant="body1">
                {eventData.awayTeam.officialName}
              </Typography>
              <Typography variant="body2">
                Country Code: {eventData.awayTeam.teamCountryCode}
              </Typography>
            </div>
          </div>
        )}

        {tabValue === 2 && (
          <div className="result">
            {/* Results Section */}
            <Typography variant="h4">Result</Typography>
            <Typography variant="h6">
              {eventData.homeTeam.name} {eventData.result.homeGoals} -{" "}
              {eventData.awayTeam.name} {eventData.result.awayGoals}
            </Typography>
            {eventData.result.winner && (
              <Typography variant="body1">
                Winner: {eventData.result.winner}
              </Typography>
            )}
            <Divider />
            {eventData.result.goals.length > 0 && (
              <Typography variant="body2">
                Goals: {eventData.result.goals.join(", ")}
              </Typography>
            )}
          </div>
        )}

        {tabValue === 3 && (
          <div className="stage-info">
            {/* Stage Info Section */}
            <Typography variant="h6">Stage Info</Typography>
            <Typography variant="body1">
              Stage: {eventData.stage.name}
            </Typography>
            <Typography variant="body2">
              Stage ID: {eventData.stage.id}
            </Typography>
            <Typography variant="body2">
              Stage Ordering: {eventData.stage.ordering}
            </Typography>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EventDetail;
