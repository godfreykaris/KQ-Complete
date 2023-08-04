import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import apiBaseUrl from '../../../config';

import LoadingComponent from '../../../components/Common/LoadingComponent';

interface Plane {
    id: number;
    plane_id: string;
    name: string;
}

type Seat = {
    plane_id: number;
    seat_number: string;
    price: number;
    is_available: boolean;
    location_id: number;
    flight_class_id:number;
};

const ViewSeats: React.FC = () => {

  const [isLoading, setIsLoading] = useState(true);

  const [planes, setPlanes] = useState<Plane[]>([]);
  const [selectedPlane, setSelectedPlane] = useState<string>('');

  const [seats, setSeats] = useState<Seat[] | null>(null);

  const [filterValue, setFilterValue] = useState<string>('');

  const [responseMessage, setResponseMessage] = useState<string>('');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);

  useEffect(() => {
    fetchPlanes();
    if(selectedPlane) 
    {
        fetchSeats(selectedPlane);
    }
  }, [selectedPlane]); // Empty dependency array ensures the effect runs only once on mount

  const fetchPlanes = async () => {
    setIsLoading(true);
    try 
    {
      const response = await fetch(`${apiBaseUrl}/planes`);
      const data = await response.json();
      setPlanes(data.planes);
      setIsLoading(false);
    } 
    catch (error: any) 
    {
      setIsLoading(false); 
      setResponseStatus(0); // Error
      setResponseMessage(`Error fetching planes:${error.message}`);
      console.error('Error fetching planes:', error);
    }
  };


  const fetchSeats = async (planeId: string) => {
    setIsLoading(true);

    try 
    {
      const response = await fetch(`${apiBaseUrl}/seats/${planeId}`);
      const data = await response.json();
      setSeats(data.seats);
      setIsLoading(false);

    }
    catch (error) 
    {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  const handlePlaneChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlane(event.target.value);
    setSeats(null);
    setFilterValue('');
  };
  
  const planesMap = useMemo(() => {
    const planeMap: { [key: number]: string } = {};
    planes.forEach((plane) => {
      planeMap[plane.id] = plane.plane_id;
    });
    return planeMap;
  }, [planes]);

  const getPlaneID = (id: number) => {
    return planesMap[id] || '';
  };

  const filteredData = seats
    ? seats.filter((item) =>
        item.seat_number.toLowerCase().includes(filterValue.toLowerCase())
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
          <div className="col-sm-12 col-md-9 col-lg-6">
            <h2 className="text-center">View Seats</h2>
            {isLoading || (selectedPlane && !seats) ? (
                /**Show loading */
                <LoadingComponent />
            ): (                
                <>
                    <p className={`response-message ${getResponseClass()} text-center`}>{responseMessage}</p>

                    <div className="form-group">
                      <label htmlFor="selectPlane" className="form-label">
                        Select Plane
                      </label>         

                      <select
                        id="selectPlane"
                        className="form-control"
                        value={selectedPlane}
                        onChange={handlePlaneChange}
                      >
                        <option value="">Select an Item</option>
                        {planes.map((plane) => (
                          <option key={plane.id} value={plane.id}>
                            {plane.name}
                          </option>
                        ))}
                      </select>
                    </div>
                        
                    { seats && (
                     <>
                      <div>
                        <input
                          type="text"
                          value={filterValue}
                          onChange={(e) => setFilterValue(e.target.value)}
                          className="form-control mb-3 mt-3"
                          placeholder="Filter by seat number"
                        />

                        <div className="table-responsive">
                          {/* Display the data in a table */}
                          <table className="table">
                            <thead>
                              <tr>
                                <th>*</th>
                                <th>Number</th>
                                <th>Location</th>
                                <th>Price</th>
                                <th>Edit</th>
                                <th>Delete</th>                                
                              </tr>
                            </thead>
                            <tbody>
                              {filteredData.map((item, index) => (  
                                <tr key={index}>
                                  <td>{index + 1}</td>                          
                                  <td>{item.seat_number}</td>
                                  <td>{item.location_id}</td>
                                  <td>{item.price}</td>  
                                  <td>
                                    <Link
                                      to={`/plane_seats/edit/${item.plane_id}/${item.flight_class_id}/${item.location_id}/${item.price}/${item.seat_number}`} // Replace "edit-seat" with the actual URL for the EditSeatComponent
                                      className="btn btn-primary"
                                    >
                                      Edit
                                    </Link>
                                  </td>
                                  <td>
                                    <Link
                                      to={`/plane_seats/delete/seats/${getPlaneID(item.plane_id)}/${item.seat_number}/${item.plane_id}`} // Replace "delete-seat" with the actual URL for the DeleteSeatComponent
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

export default ViewSeats;
