import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import apiBaseUrl from '../../../config';

import LoadingComponent from '../../../components/Common/LoadingComponent';


type JobTitle = {
  id: number;
  name: string;
};

type Employee = {
    id:number,
    employee_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    address: '',
    job_title: JobTitle,
    qualifications: [],
    skills: [],
};

const ViewEmployees: React.FC = () => {

  const [isLoading, setIsLoading] = useState(true);

  
  const [employees, setEmployees] = useState<Employee[] | null>(null);

  const [filterValue, setFilterValue] = useState<string>('');

  const [responseMessage, setResponseMessage] = useState<string>('');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);

  useEffect(() => {
    fetchEmployees();    
  }, []); // Empty dependency array ensures the effect runs only once on mount

  

  const fetchEmployees = async () => {
    setIsLoading(true);

    try 
    {
      const response = await fetch(`${apiBaseUrl}/employees`);
      const data = await response.json();
      setEmployees(data.employees);
      setIsLoading(false);

    }
    catch (error) 
    {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  
  const filteredData = employees
    ? employees.filter((item) =>
        item.employee_id.toLowerCase().includes(filterValue.toLowerCase())
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
    <div className="form-container ">
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-lg-12">
            <h2 className="text-center">View Employees</h2>
            {isLoading ? (
                /**Show loading */
                <LoadingComponent />
            ): (                
                <>
                    <p className={`response-message ${getResponseClass()} text-center`}>{responseMessage}</p>
                        
                    { employees && (
                     <>
                      <div>
                        <input
                          type="text"
                          value={filterValue}
                          onChange={(e) => setFilterValue(e.target.value)}
                          className="form-control mb-3 mt-3"
                          placeholder="Filter by employee number"
                        />

                        <div className="table-responsive">
                          {/* Display the data in a table */}
                          <table className="table">
                            <thead>
                              <tr>
                                <th>*</th>
                                <th>Edit</th>
                                <th>Delete</th>     
                                <th>Employee ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Date of Birth</th>
                                <th>Address</th>
                                <th>Job Title</th>                                                           
                              </tr>
                            </thead>
                            <tbody>
                              {filteredData.map((item, index) => (  
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>
                                    <Link
                                      to={`/hrm/manage_employees/edit/${item.employee_id}`} // Replace "edit-employee" with the actual URL for the EditEmployeeComponent
                                      className="btn btn-primary"
                                    >
                                      Edit
                                    </Link>
                                  </td>
                                  <td>
                                    <Link
                                      to={`/hrm/manage_employees/delete/employees/${item.employee_id}`} // Replace "delete-employee" with the actual URL for the DeleteEmployeeComponent
                                      className="btn btn-danger"
                                    >
                                      Delete
                                    </Link>
                                  </td>
                                  <td>{item.employee_id}</td>
                                  <td>{item.first_name}</td>
                                  <td>{item.last_name}</td>
                                  <td>{item.email}</td>
                                  <td>{item.phone}</td>
                                  <td>{item.date_of_birth}</td>
                                  <td>{item.address}</td>
                                  <td>{item.job_title.name}</td>  
                                                                                   
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

export default ViewEmployees;
