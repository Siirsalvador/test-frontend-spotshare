import "../styles/DateInput.css";
import React, { useState } from "react";
import { MDBBtn, MDBSpinner } from "mdb-react-ui-kit";
import { analytics } from "./firebase";
import { logEvent } from "firebase/analytics";

function DateTimeRangeInput(props) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [minToDate, setMinToDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { isOnline, onDataReceived, componentRef } = props;

  const handleFromDateChange = (event) => {
    const newFromDate = event.target.value;
    setFromDate(newFromDate);
    setMinToDate(newFromDate);
  };

  const handleToDateChange = (event) => {
    const newToDate = event.target.value;
    setToDate(newToDate);
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
        window.scrollTo({
          top: componentRef.current.offsetTop,
          behavior: "smooth",
        });
      })
      .catch((error) => console.error(error));
  };

  return (
    <div id="dateInputComponent">
      <form onSubmit={handleSubmit}>
        <br />
        <label htmlFor="from-date-input">From Date</label>
        <br />
        <input
          type="datetime-local"
          id="from-date-input"
          name="from-date-input"
          value={fromDate}
          onChange={handleFromDateChange}
          min="2023-03-24T00:00:00"
        />
        <br />
        <br />
        <label htmlFor="to-date-input">To Date</label>
        <br />
        <input
          type="datetime-local"
          id="to-date-input"
          name="to-date-input"
          value={toDate}
          onChange={handleToDateChange}
          min={minToDate}
        />
        <br />
        <br />
        {isLoading ? (
          <MDBSpinner grow color="primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </MDBSpinner>
        ) : (
          <MDBBtn rounded className="mx-2" type="submit" disabled={!isOnline}>
            Submit
          </MDBBtn>
        )}
      </form>
    </div>
  );
}

export default DateTimeRangeInput;
