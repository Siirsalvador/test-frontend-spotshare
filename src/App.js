import "./styles/App.css";
import logo from "./logo.svg";
import React, { useState, useEffect, useRef } from "react";
import DateInputComponent from "./components/DateInputComponent";
import ListComponent from "./components/ListComponent";

function App() {
  const [bundle, setToBundle] = useState({
    data: [],
    fromDate: "",
    toDate: "",
    curPage: 0,
  });
  const [online, setOnline] = useState(navigator.onLine);
  const componentRef = useRef(null);

  useEffect(() => {
    window.addEventListener("online", () => setOnline(true));
    window.addEventListener("offline", () => setOnline(false));
    return () => {
      window.removeEventListener("online", () => setOnline(true));
      window.removeEventListener("offline", () => setOnline(false));
    };
  }, []);

  const handleDataReceived = (fromDate, toDate, data, page) => {
    setToBundle({
      data: data,
      fromDate: fromDate,
      toDate: toDate,
      curPage: page,
    });
  };

  return (
    <div className="App">
      {!online ? (
        <div className="sticky-nav red">
          <p className="header">No internet connection</p>
        </div>
      ) : (
        <div className="sticky-nav">
          <p className="header">
            Enter a time range to search Ade's Spotify play history (data stored
            since - 24th Mar 2023)
          </p>
        </div>
      )}
      {/* <img src={logo} className="App-logo" alt="logo" /> */}
      <div id="mainAppContainer">
        <h1>SpotShare - Beta</h1>
        <DateInputComponent
          isOnline={online}
          componentRef={componentRef}
          onDataReceived={handleDataReceived}
        />
        <ListComponent
          key={bundle.curPage}
          queryData={bundle}
          isOnline={online}
          componentRef={componentRef}
          onDataReceived={handleDataReceived}
        />
      </div>
    </div>
  );
}

export default App;
