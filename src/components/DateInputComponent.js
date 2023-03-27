import "../styles/DateInput.css";
import React, { useState } from "react";
import moment from "moment";
import { analytics } from "./firebase";
import { logEvent } from "firebase/analytics";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { CircularProgress, Stack, Button } from "@mui/material";

function DateTimeRangeInput(props) {
  const [fromDate, setFromDate] = useState(moment("2023-03-24T00:00:00"));
  const [toDate, setToDate] = useState(moment.utc());
  const [minToDate, setMinToDate] = useState(fromDate);
  const [isLoading, setIsLoading] = useState(false);

  const { isOnline, onDataReceived } = props;

  const handleFromDateChange = (value) => {
    const newFromDate = value;
    setFromDate(newFromDate);
    setMinToDate(newFromDate);
    console.log(value);
  };

  const handleToDateChange = (value) => {
    const newToDate = value;
    setToDate(newToDate);
    console.log(value);
  };

  const handleSubmit = (event) => {
    logEvent(analytics, "Submitted query");
    setIsLoading(true);
    event.preventDefault();
    fetch("https://spot-share.herokuapp.com/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST,PATCH,OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-Requested-With",
      },
      body: JSON.stringify({ fromDate: fromDate, toDate: toDate }),
    })
      .then((response) => response.json())
      .then((data) => {
        logEvent(analytics, "Data retrieved");
        const page = 1;
        onDataReceived(fromDate, toDate, data, page);
        setIsLoading(false);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <form onSubmit={handleSubmit}>
          <Stack alignItems="center" fullwidth sx={{ mb: "2rem" }}>
            <br />
            <DateTimePicker
              fullwidth={true}
              label="From Date"
              value={fromDate}
              onChange={(newValue) => handleFromDateChange(newValue)}
              minDateTime={moment("2023-03-24T00:00:00")}
            />
            <br />
            <DateTimePicker
              label="To Date"
              value={toDate}
              onChange={(newValue) => handleToDateChange(newValue)}
              minDateTime={moment(minToDate)}
            />
            <br />
            {isLoading ? (
              <CircularProgress />
            ) : (
              <Button variant="contained" type="submit" disabled={!isOnline}>
                Submit
              </Button>
            )}
          </Stack>
        </form>
      </LocalizationProvider>
    </div>
  );
}

export default DateTimeRangeInput;
