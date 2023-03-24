import React, { useState, useEffect, useRef } from 'react';
import '../styles/ListComponent.css';

function ListComponent(props) {
    const [bundle, setBundle] = useState({data:[], fromDate:'', toDate:''});
    const componentRef = useRef(null);

    useEffect(() => {
        setBundle(props.data);
        handleDataReceived(props.data);
      }, [props.data]);

      useEffect(() => {
        setBundle(bundle);
        handleDataReceived(bundle);
      }, [bundle]);

    const handleDataReceived = (updatedData) => {
        setBundle(updatedData);
        console.log(updatedData);
      };

      const handleClick = (event) => {
        // prevent the default behavior of the link
        event.preventDefault();
        fetch('https://spot-share.herokuapp.com/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS',
                'Access-Control-Allow-Headers' : 'Content-Type, Authorization, X-Requested-With'
            },
            body: JSON.stringify({ fromDate:bundle.fromDate, toDate:bundle.toDate })
        })
        .then(response => response.json())
        .then(data => handleDataReceived({data:data, fromDate:bundle.fromDate, toDate:bundle.toDate}))
        .catch(error => console.error(error));
        window.scrollTo({
            top: componentRef.current.offsetTop,
            behavior: 'smooth'
          });
        };

        return (
            <div className='container' ref={componentRef}>
            {bundle.data.length > 0 ? (
                <div>
                <h1>Tracks:</h1>
                <ol>
                    {bundle.data.map((item, index) => (
                    <li key={index}>
                        <ul>
                            <li>Played at: <span>{item.played_at}</span></li>
                            <li>Track name: <span><a href={item.track_link} target="_blank" rel="noopener noreferrer">{item.track_name}</a></span></li>
                            <li>Artist: <span>{item.track_artist}</span></li>
                            <li>Album name: <span>{item.track_album_name}</span></li>
                        </ul>       
                    </li>
                    ))}
                </ol>
                <span><button onClick={handleClick} disabled={bundle.data.length < 15}>Next Page</button></span>
                </div>
            ) : (
                <p>No data received yet</p>
            )}
            </div>
        );
}

export default ListComponent;