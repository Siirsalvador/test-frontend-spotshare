import React, { useState, useEffect } from 'react';
import '../styles/ListComponent.css';
function ListComponent(props) {
    const [data, setData] = useState([]);

    useEffect(() => {
        setData(props.data);
        handleDataReceived(props.data);
      }, [props.data]);

    const handleDataReceived = (updatedData) => {
        setData(updatedData);
      };

        return (
            <div className='container'>
            {data.length > 0 ? (
                <div>
                <h1>Tracks:</h1>
                <ol>
                    {data.map((item, index) => (
                    <li key={index}>
                        <ul>
                            <li>Played at: <span>{item.played_at}</span></li>
                            <li>Track name: <span><a href={item.track_link}>{item.track_name}</a></span></li>
                            <li>Artist: <span>{item.track_artist}</span></li>
                            <li>Album name: <span>{item.track_album_name}</span></li>
                        </ul>       
                    </li>
                    ))}
                </ol>
                </div>
            ) : (
                <p>No data received yet</p>
            )}
            </div>
        );
}

export default ListComponent;