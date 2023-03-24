import logo from './logo.svg';
import './styles/App.css';
import React, {useState} from 'react';
import DateInput from './components/DateInput';
import ListComponent from './components/ListComponent';


function App() {
  const [bundle, setToBundle] = useState({});

  const handleDataReceived = (fromDate, toDate, data) => {
    setToBundle({data:data, fromDate:fromDate, toDate:toDate})
  };

  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <h1>SpotShare - Beta</h1>
      <p>Enter a time range to search your play history(since - 24 Mar)</p>
      <DateInput onDataReceived={handleDataReceived}/>
      <ListComponent data = {bundle} onDataReceived={handleDataReceived}/>
    </div>
  );
}

export default App;
