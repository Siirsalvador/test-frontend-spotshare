import "../styles/ListComponent.css";
import React from "react";
import moment from "moment";
import { analytics } from "./firebase";
import { logEvent } from "firebase/analytics";
import { Card, CardContent, CardActionArea, Grid, Typography, Divider, Pagination, Chip } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2'; // Grid version 2

function ListComponent(props) {
  const { queryData, isOnline, onDataReceived, componentRef } = props;

  const handleClick = (event) => {
    logEvent(analytics, "Next page click");
    window.scrollTo({
      top: componentRef.current.offsetTop,
      behavior: "smooth",
    });
    event.preventDefault();
    fetch("https://spot-share.herokuapp.com/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fromDate: queryData.fromDate,
        toDate: queryData.toDate,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
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
      {queryData.data.length > 0 ? (
        <div>
          <br />
          <Grid2 container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
                cols={3}
                spacing={{ xs: 2, md: 3 }} 
                columns={{ xs: 4, sm: 8, md: 12 }}>
            {queryData.data.map((item, index) => {
              return (
                <Grid2 item xs={6} sm={4} md={4}>
                  <Card variant="outlined" key={index}>
                    <CardActionArea href={item.track_link} target="_blank">
                      <CardContent>
                        <Typography
                          className={"MuiTypography--heading"}
                          variant="h5">
                          {item.track_name}
                        </Typography>
                        <Typography variant="h5">
                          Artist - {item.track_artist}
                        </Typography>
                        <Typography variant="h5">
                          Album - <span>{item.track_album_name}</span>
                        </Typography>
                        <Divider role="presentation" textAlign="center" light><Chip label="Played At"/></Divider>
                        <Typography sx={{mt:"0.5rem"}} align="center" variant="body2">
                            {moment(item.played_at).format(
                              "dddd, MMMM Do, h:mm a"
                            )}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid2>
              );
            })}
          </Grid2>
          <nav style={{justifyContent:"center",
            display:'flex'}} aria-label="Page navigation">
            <Pagination
              size="large"
              onChange={handleClick}
              hidePrevButton
              variant="outlined" color="primary"
              disabled={queryData.data.length < 15 || !isOnline}
              page={queryData.page}
              count={queryData.page+1}
            />
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
