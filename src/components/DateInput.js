import React, { useState } from 'react';
import '../styles/DateInput.css'

function DateTimeRangeInput(props) {
  const [data, setData] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleFromDateChange = (event) => {
    setFromDate(event.target.value);
  };

  const handleToDateChange = (event) => {
    setToDate(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('https://spot-share.herokuapp.com/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS'
      },
      body: JSON.stringify({ fromDate:fromDate, toDate:toDate })
    })
      .then(response => response.json())
      .then(data => props.onDataReceived(data))
      .catch(error => console.error(error));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="from-date-input">From Date:</label>
        <input 
          type="datetime-local" 
          id="from-date-input" 
          name="from-date-input" 
          value={fromDate} 
          onChange={handleFromDateChange} 
        />
        <label htmlFor="to-date-input">To Date:</label>
        <input 
          type="datetime-local" 
          id="to-date-input" 
          name="to-date-input" 
          value={toDate} 
          onChange={handleToDateChange} 
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default DateTimeRangeInput;
