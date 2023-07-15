import React, { useState } from 'react';


const Data: React.FC = () => {
  const [data, setData] = useState([]);

  const fetchFlights = () => {
    fetch('http://127.0.0.1:8000/flights')
      .then(response => response.json())
      .then((data) => setData(data))
      .catch(error => console.error(error));
  };

  const fetchTicket = () => {
    fetch('http://127.0.0.1:8000/ticket/1')
      .then(response => response.json())
      .then((data) => setData(data))
      .catch(error => console.error(error));
  };

  return (
    <div>
      <button onClick={fetchFlights}>Fetch Flights</button>
      <button onClick={fetchTicket}>Fetch Ticket</button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default Data;
