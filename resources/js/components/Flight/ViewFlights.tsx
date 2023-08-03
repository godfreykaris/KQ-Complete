import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import apiBaseUrl from '../../config';

import LoadingComponent from '../LoadingComponent';


type Plane = {
    id: number;
    plane_id: string;
    name: string;
  };
  
type FlightStatus = {
  id: number;
  name: string;
};

type City = {
  id: number;
  name: string;
};

type Flight = {
  id: number;
  flight_number: string;
  plane: Plane;
  flight_status: FlightStatus;
  departure_time: Date;
  arrival_time: Date;
  return_time: Date;
  departure_city: City;
  arrival_city: City;
};

const ViewFlights: React.FC = () => {

  const [isLoading, setIsLoading] = useState(true);

  
  const [flights, setFlights] = useState<Flight[] | null>(null);

  const [filterValue, setFilterValue] = useState<string>('');

  const [responseMessage, setResponseMessage] = useState<string>('');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);

  useEffect(() => {
    fetchFlights();    
  }, []); // Empty dependency array ensures the effect runs only once on mount

  

  const fetchFlights = async () => {
    setIsLoading(true);

    try 
    {
      const response = await fetch(`${apiBaseUrl}/flights`);
      const data = await response.json();
      setFlights(data.flights);
      setIsLoading(false);

    }
    catch (error) 
    {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  
  const filteredData = flights
    ? flights.filter((item) =>
        item.flight_number.toLowerCase().includes(filterValue.toLowerCase())
      )
    : [];


  const getResponseClass = () => {
    
      if (responseStatus === 1) 
      {
        return 'text-success'; // Green color for success
      } 
      else if (responseStatus === 0) 
      {
        return 'text-danger'; // Red color for error
      } 
      else 
      {
        return ''; // No specific styles (default)
      }
  };

  return (
    <div className="form-container">
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-lg-12">
            <h2 className="text-center">View Flights</h2>
            {isLoading ? (
                /**Show loading */
                <LoadingComponent />
            ): (                
                <>
                    <p className={`response-message ${getResponseClass()} text-center`}>{responseMessage}</p>
                        
                    { flights && (
                     <>
                      <div>
                        <input
                          type="text"
                          value={filterValue}
                          onChange={(e) => setFilterValue(e.target.value)}
                          className="form-control mb-3 mt-3"
                          placeholder="Filter by flight number"
                        />

                        <div className="table-responsive">
                          {/* Display the data in a table */}
                          <table className="table">
                            <thead>
                              <tr>
                                <th>*</th>
                                <th>Flight Number</th>
                                <th>Plane ID</th>
                                <th>Status</th>
                                <th>Departure City</th>
                                <th>Arrival City</th>
                                <th>Departure Time</th>
                                <th>Arrival Time</th>
                                <th>Return Time</th>
                                <th>Edit</th>
                                <th>Delete</th>                                
                              </tr>
                            </thead>
                            <tbody>
                              {filteredData.map((item, index) => (  
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{item.flight_number}</td>
                                  <td>{item.plane.plane_id}</td>
                                  <td>{item.flight_status.name}</td>
                                  <td>{new Date(item.departure_time).toLocaleString()}</td>
                                  <td>{new Date(item.arrival_time).toLocaleString()}</td>
                                  <td>{new Date(item.return_time).toLocaleString()}</td>
                                  <td>{item.departure_city.name}</td>
                                  <td>{item.arrival_city.name}</td>  

                                  <td>
                                    <Link
                                      to={`/manage_flights/edit/${item.id}`} // Replace "edit-flight" with the actual URL for the EditFlightComponent
                                      className="btn btn-primary"
                                    >
                                      Edit
                                    </Link>
                                  </td>
                                  <td>
                                    <Link
                                      to={`/manage_flights/delete/flights/${item.id}`} // Replace "delete-flight" with the actual URL for the DeleteFlightComponent
                                      className="btn btn-danger"
                                    >
                                      Delete
                                    </Link>
                                  </td>                                                 
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      </>
                    )}
                    </>              

              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewFlights;
