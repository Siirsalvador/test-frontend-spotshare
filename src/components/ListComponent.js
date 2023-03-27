import "../styles/ListComponent.css";
import React from "react";
import {
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardHeader,
  MDBCardSubTitle,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
import moment from "moment";
import { analytics } from "./firebase";
import { logEvent } from "firebase/analytics";

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
    <div id="listComponent" className="container" ref={componentRef}>
      {queryData.data.length > 0 ? (
        <div>
          <br />
          <h1>Tracks:</h1>
          <ul className="tracks">
            <MDBRow className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {queryData.data.map((item, index) => (
                <li key={index}>
                  <ul>
                    <MDBCol>
                      <MDBCard className="mb-3 hover-shadow">
                        <MDBCardBody>
                          <MDBCardHeader>
                            <span>
                              {moment(item.played_at).format(
                                "dddd, MMMM Do, h:mm a"
                              )}
                            </span>
                          </MDBCardHeader>

                          <MDBCardTitle>
                            <span className="track-name">
                              <a
                                href={item.track_link}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {item.track_name}
                              </a>
                            </span>
                          </MDBCardTitle>
                          <MDBCardSubTitle>
                            Artist - <span>{item.track_artist}</span>
                          </MDBCardSubTitle>
                          <MDBCardSubTitle>
                            Album - <span>{item.track_album_name}</span>
                          </MDBCardSubTitle>
                        </MDBCardBody>
                      </MDBCard>
                    </MDBCol>
                  </ul>
                </li>
              ))}
            </MDBRow>
          </ul>
          <nav aria-label="Page navigation">
            <MDBPagination circle className="mb-0">
              <MDBPaginationItem active>
                <MDBPaginationLink tabIndex={-1}>
                  {queryData.curPage}
                </MDBPaginationLink>
              </MDBPaginationItem>
              <MDBPaginationItem>
                <MDBPaginationLink
                  onClick={handleClick}
                  disabled={queryData.data.length < 15 || !isOnline}
                  href="#"
                >
                  <span aria-hidden="true">»</span>
                </MDBPaginationLink>
              </MDBPaginationItem>
            </MDBPagination>
          </nav>
        </div>
      ) : (
        <p>No data received yet</p>
      )}
    </div>
  );
}
ListComponent.displayName = "ListComponent";

export default ListComponent;
