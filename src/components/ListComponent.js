import React from "react";
import moment from "moment";
import {analytics} from "../helpers/firebase";
import {logEvent} from "firebase/analytics";
import {Card, CardActionArea, CardContent, Chip, Divider, Fab, Pagination, Typography,} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2"; // Grid version 2
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {createTheme, responsiveFontSizes, ThemeProvider} from '@mui/material/styles';

let theme = createTheme();
theme = responsiveFontSizes(theme);


function ListComponent(props) {
    const {queryData, isOnline, onDataReceived, componentRef} = props;

    const handleClick = (event) => {
        logEvent(analytics, "Next page click");
        window.scrollTo({
            top: componentRef.current.offsetTop,
            behavior: "smooth",
        });
        event.preventDefault();
        fetch("/query", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fromDate: queryData.fromDate.toISOString(),
                toDate: queryData.toDate.toISOString(),
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(queryData.curPage)
                onDataReceived(
                    queryData.fromDate,
                    queryData.toDate,
                    data,
                    queryData.curPage + 1
                );
            })
            .catch((error) => console.error(error));
    };

    return (
        <div ref={componentRef}>
            {queryData.data[0].length > 0 ? (
                <div>
                    <br/>
                    <Grid2
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-start"
                        cols={3}
                        spacing={{xs: 2, md: 3}}
                        columns={{xs: 4, sm: 8, md: 12}}
                    >
                        {queryData.data[0].map((item, index) => {
                            return (
                                <Grid2 item xs={6} sm={4} md={4}>
                                    <Card variant="outlined" key={index}>
                                        <CardActionArea href={item.track_link} target="_blank">
                                            <CardContent>
                                                <ThemeProvider theme={theme}>
                                                    <Typography
                                                        className={"MuiTypography--heading"}
                                                        variant="h5"
                                                        color={"#1976d2"}
                                                    >
                                                        {item.track_name}
                                                    </Typography>
                                                    <Typography variant="h6">
                                                        Artist - {item.track_artist}
                                                    </Typography>
                                                    <Typography variant="h6" label={"album"}>
                                                        Album - <span>{item.track_album_name}</span>
                                                    </Typography>
                                                    <Divider role="presentation" textAlign="center">
                                                        <Chip label="played at"/>
                                                    </Divider>
                                                    <Typography
                                                        sx={{mt: "0.5rem"}}
                                                        align="center"
                                                        variant="body2"
                                                    >
                                                        {moment(item.played_at).format(
                                                            "dddd, MMMM Do, h:mm a"
                                                        )}
                                                    </Typography>
                                                </ThemeProvider>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid2>
                            );
                        })}
                    </Grid2>
                    <nav
                        style={{justifyContent: "center", display: "flex"}}
                        aria-label="Page navigation">

                        <Pagination
                            sx={{mt: "1.2rem"}}
                            onChange={handleClick}
                            hidePrevButton
                            variant="outlined"
                            color="primary"
                            disabled={queryData.data[0].length < 16 || !isOnline}
                            page={queryData.curPage}
                            count={queryData.data[1] < 16 ? 1 : (Math.ceil(queryData.data[1] / 16))}
                        />

                        <div style={{display: "flex", justifyContent: "flex-end"}}>
                            <Fab color="transparent" onClick={() => {
                                window.scrollTo({
                                    top: (0, 0),
                                    behavior: "smooth",
                                });
                            }}
                                 sx={{
                                     position: "fixed",
                                     bottom: (theme) => theme.spacing(4),
                                     right: (theme) => theme.spacing(2),
                                 }}
                                 size="small"
                                 aria-label="scroll back to top"
                            >
                                <KeyboardArrowUpIcon/>
                            </Fab>
                        </div>
                    </nav>
                </div>
            ) : (
                <Typography variant="body2">No data received yet</Typography>
            )}
        </div>
    );
}

ListComponent.displayName = "ListComponent";

export default ListComponent;
