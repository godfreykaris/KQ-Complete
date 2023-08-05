import React, { useState } from 'react';
import {useNavigate} from "react-router-dom"

import apiBaseUrl from '../../config';
import LoadingComponent from '../Common/LoadingComponent';

const SignInComponent = () => {

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [responseMessage, setResponseMessage] = useState<string>('');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) 
      {
        const data = await response.json();
        sessionStorage.setItem('access_token', data.user.token);

        setIsLoading(false);
        // Determine the role (admin or HRM) based on your backend's response
        const userRole = data.role; // Replace 'role' with the actual key that holds the role
        if (userRole === 'admin') 
        {
          navigate('/admin'); // Redirect to admin frontend
        } 
        else if (userRole === 'hrm') 
        {
          navigate('/hrm'); // Redirect to HRM frontend
        }
        else
        {
            navigate('/admin'); // Redirect to admin frontend
        }
      } 
      else 
      {
        setIsLoading(false);
        setResponseStatus(0); // Error
        setResponseMessage(`Error: Incorrect Login Details.`);
        console.log('Authentication failed.');
      }
    } 
    catch (error) 
    {
      setIsLoading(false);
      setResponseStatus(0); // Error
      setResponseMessage(`Error signing. Contact ICT.`);
      console.log('Error signing in:', error);
    }
  };

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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card">
            <div className="card-header">
              <h2 className="text-center">Sign In</h2>
            </div>
            <div className="card-body">
              <p className={`response-message ${getResponseClass()} text-center`}>{responseMessage}</p>

              { isLoading ? (
                  <LoadingComponent/>
              ):
              (
                <form onSubmit={handleSignIn}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email:
                    </label>
                    <input
                      type="text"
                      id="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password:
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="text-center mt-3">
                    <button type="submit" className="btn btn-primary">
                      Sign In
                    </button>
                  </div>
                </form>
              )
              }
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInComponent;
