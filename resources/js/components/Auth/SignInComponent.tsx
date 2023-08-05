import React, { useState } from 'react';
import {useNavigate} from "react-router-dom"

import apiBaseUrl from '../../config';

const SignInComponent = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('access_token', data.user.token);

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
        console.log('Authentication failed.');
      }
    } catch (error) {
      console.log('Error signing in:', error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h2 className="text-center">Sign In</h2>
            </div>
            <div className="card-body">
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
                <button type="submit" className="btn btn-primary">
                  Sign In
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInComponent;
