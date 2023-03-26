import React, { useState, useEffect } from 'react';
import '../styles/DateInput.css'
import { analytics } from './firebase';
import {logEvent} from 'firebase/analytics';

function DateTimeRangeInput(props) {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [hasInternetConnection, setHasInternetConnection] = useState(true);
  const [minToDate, setMinToDate] = useState('');

  useEffect(() => {
    const handleConnectionChange = () => {
      setHasInternetConnection(navigator.onLine);
    };

    window.addEventListener("online", handleConnectionChange);
    window.addEventListener("offline", handleConnectionChange);

    return () => {
      window.removeEventListener("online", handleConnectionChange);
      window.removeEventListener("offline", handleConnectionChange);
    };
  }, []);
  
  const handleFromDateChange = (event) => {
    const newFromDate = event.target.value;
    setFromDate(newFromDate);
    setMinToDate(newFromDate);
  };

  const handleToDateChange = (event) => {
    setToDate(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    logEvent(analytics, "Submitted query");
    fetch('https://spot-share.herokuapp.com/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS',
        'Access-Control-Allow-Headers' : 'Content-Type, Authorization, X-Requested-With'
      },
      body: JSON.stringify({ fromDate:fromDate, toDate:toDate })
    })
      .then(response => response.json())
      .then(data => {
        props.onDataReceived(fromDate, toDate, data);
        logEvent(analytics, "Data retrieved");
        })
      .catch(error => console.error(error));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <br/>
        <label htmlFor="from-date-input">From Date:</label>
        <br/>
        <input 
          type="datetime-local" 
          id="from-date-input" 
          name="from-date-input" 
          value={fromDate} 
          onChange={handleFromDateChange} 
          min="2023-03-24T00:00:00"
        />
        <br/><br/>
        <label htmlFor="to-date-input">To Date:</label>
        <br/>
        <input 
          type="datetime-local" 
          id="to-date-input" 
          name="to-date-input" 
          value={toDate} 
          onChange={handleToDateChange}
          min={minToDate}
        />
        <br/><br/>
        <button type="submit" disabled={!hasInternetConnection}>Submit</button>
      </form>
    </div>
  );
}

export default DateTimeRangeInput;
