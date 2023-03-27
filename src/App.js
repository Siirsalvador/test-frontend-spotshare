import "./styles/App.css";
import logo from "./logo.svg";
import React, { useState, useEffect, useRef } from "react";
import DateInputComponent from "./components/DateInputComponent";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
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
    <Container maxWidth={false}>
      <Stack
        direction="column"
        justifyContent="space-evenly"
        alignItems="center"
        sx={{mb:"2rem"}}>
        {!online ? (
          <div className="sticky-nav red">
            <Typography align="center">No internet connection</Typography>
          </div>
        ) : (
          <div className="sticky-nav">
            <Typography align="center" variant="body2" gutterBottom>
              Enter a time range to search Ade's Spotify play history<br/>(data
              stored since - 24th Mar 2023)
            </Typography>
          </div>
        )}
        <img src={logo} className="App-logo" alt="logo" />
        <Typography
          variant="h4"
          gutterBottom
          sx={{ mt: "2rem" }}
        >
          SpotShare - Beta
        </Typography>
        <DateInputComponent
          isOnline={online}
          onDataReceived={handleDataReceived}
        />
        <ListComponent
          key={bundle.curPage}
          queryData={bundle}
          isOnline={online}
          componentRef={componentRef}
          onDataReceived={handleDataReceived}
        />
      </Stack>
    </Container>
  );
}

export default App;
