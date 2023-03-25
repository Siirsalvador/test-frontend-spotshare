import React, { useState, useEffect } from 'react';
import '../styles/DateInput.css'
import { analytics } from './firebase';
import {logEvent} from 'firebase/analytics';

function DateTimeRangeInput(props) {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [hasInternetConnection, setHasInternetConnection] = useState(true);

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
    setFromDate(event.target.value);
    logEvent(analytics, "From date changed");
  };

  const handleToDateChange = (event) => {
    setToDate(event.target.value);
    logEvent(analytics, "To date changed");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // logEvent(analytics, "Submitted query");
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
      .then(data => props.onDataReceived(fromDate, toDate,data))
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
        />
        <br/><br/>
        <button type="submit" disabled={!hasInternetConnection}>Submit</button>
      </form>
    </div>
  );
}

export default DateTimeRangeInput;
