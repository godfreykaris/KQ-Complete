import React, { useState } from 'react';


const Data: React.FC = () => {
  const [data, setData] = useState([]);

  const fetchPlanes = () => {
    fetch('http://127.0.0.1:8000/planes')
      .then(response => response.json())
      .then((data) => setData(data))
      .catch(error => console.error(error));
  };

  const fetchSeats = () => {
    fetch('http://127.0.0.1:8000/seats')
      .then(response => response.json())
      .then((data) => setData(data))
      .catch(error => console.error(error));
  };

  return (
    <div>
      <button onClick={fetchPlanes}>Fetch Planes</button>
      <button onClick={fetchSeats}>Fetch Seats</button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default Data;
