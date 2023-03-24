import logo from './logo.svg';
import './styles/App.css';
import React, {useState} from 'react';
import DateInput from './components/DateInput';
import ListComponent from './components/ListComponent';


function App() {
  const [data, setData] = useState([]);

  const handleDataReceived = (data) => {
    console.log(data)
    setData(data);
  };

  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <h1>SpotShare - Beta</h1>
      <p>Enter a time range to search your play history(since - 24 Mar)</p>
      <DateInput onDataReceived={handleDataReceived}/>
      <ListComponent data = {data} onDataReceived={handleDataReceived}/>
    </div>
  );
}

export default App;
