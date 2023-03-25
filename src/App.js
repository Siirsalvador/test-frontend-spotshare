import logo from './logo.svg';
import './styles/App.css';
import React, {useState, useEffect} from 'react';
import DateInputComponent from './components/DateInputComponent';
import ListComponent from './components/ListComponent';

function App() {
  const [bundle, setToBundle] = useState({});
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    window.addEventListener("online", () => setOnline(true));
    window.addEventListener("offline", () => setOnline(false));
    return () => {
      window.removeEventListener("online", () => setOnline(true));
      window.removeEventListener("offline", () => setOnline(false));
    };
  }, []);

  const handleDataReceived = (fromDate, toDate, data) => {
    setToBundle({data:data, fromDate:fromDate, toDate:toDate});
  };

  return (
    <div className="App">
      {!online && <div className="sticky-nav">No internet connection</div>}
      <img src={logo} className="App-logo" alt="logo" />
      <h1>SpotShare - Beta</h1>
      <p>Enter a time range to search Ade's Spotify play history (since - 24th Mar 2023)</p>
      <DateInputComponent onDataReceived={handleDataReceived}/>
      <ListComponent data = {bundle} onDataReceived={handleDataReceived}/>
    </div>
  );
}

export default App;
