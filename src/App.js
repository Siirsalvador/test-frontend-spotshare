import "./styles/App.css";
import React, {useEffect, useMemo, useRef, useState} from "react";
import DateInputComponent from "./components/DateInputComponent";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import ListComponent from "./components/ListComponent";
import CssBaseline from "@mui/material/CssBaseline";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const ColorModeContext = React.createContext({
    toggleColorMode: () => {
    }
});

function App() {
    const colorMode = React.useContext(ColorModeContext);
    const [mode, setMode] = React.useState("light");
    const [bundle, setToBundle] = useState({
        data: [[], 0],
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

    const theme = useMemo(() =>
        createTheme({
            palette: {
                mode,
            },
        }), [mode]);

    const handleDataReceived = (fromDate, toDate, data, page) => {
        setToBundle({
            data: data,
            fromDate: fromDate,
            toDate: toDate,
            curPage: page,
        });
    };


    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Container maxWidth={false}>
                    {!online ? (
                        <div className="sticky-nav red">
                            <Typography align="center">No internet connection</Typography>
                        </div>
                    ) : (
                        <div className="sticky-nav">
                            <Typography align="center" variant="body2" gutterBottom>
                                Enter a time range to search Ade's Spotify play history
                                <br/>
                                (data stored since - 24th Mar 2023)
                            </Typography>
                        </div>
                    )}
                    <Stack
                        direction="column"
                        justifyContent="space-evenly"
                        alignItems="center"
                        sx={{mb: "2rem"}}
                    >
                        <div style={{display: "flex"}}>
                            <Typography variant="h4" gutterBottom sx={{mt: "3rem"}} color={"#4e6bff"}>
                                SpotShare - Beta
                            </Typography>
                            <IconButton
                                sx={{ml: 1, mt: 4}}
                                onClick={() => setMode(mode === "light" ? "dark" : "light")}
                                color="inherit"
                            >
                                {theme.palette.mode === "dark" ? (
                                    <Brightness7Icon/>
                                ) : (
                                    <Brightness4Icon/>
                                )}
                            </IconButton>
                        </div>
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
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default App;
