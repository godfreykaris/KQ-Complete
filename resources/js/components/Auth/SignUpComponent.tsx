import React, { useState } from 'react';
import LoadingComponent from '../Common/LoadingComponent';
import apiBaseUrl from '../../config';
import { useNavigate } from 'react-router-dom';


const SignUpComponent = () => {

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [responseMessage, setResponseMessage] = useState<string>('');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    
    setIsLoading(true);

    e.preventDefault();

    try 
    {
      if (formData.password !== formData.password_confirmation) 
      {
        setIsLoading(false);

        // Handle password mismatch
        console.error('Password and Confirm Password do not match.');
        return;
      }

      const response = await fetch(`${apiBaseUrl}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
        }),
      });

      if (response.ok) 
      {
        setIsLoading(false);
        // Registration successful
        alert("User registered successfully");
        // Redirect to sign in
        navigate('/signin'); 
      } 
      else 
      {
        setIsLoading(false);
        setResponseStatus(0); // Error
        setResponseMessage(`Error: An error occurred Please try again later or contact support.`);
      }
    } 
    catch (error) 
    {
      setIsLoading(false);
      setResponseStatus(0); // Error
      setResponseMessage(`Error: An error occurred Please try again later or contact support.`);
      console.log(`Error subminting data: ${error}`);
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
              <h2 className="text-center">Sign Up</h2>
            </div>
            <div className="card-body">
              <p className={`response-message ${getResponseClass()} text-center`}>{responseMessage}</p>

              { isLoading ? (
                  <LoadingComponent/>
              ):
              (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Name:
                    </label>
                    <input
                      type="text"
                      id="name"
                      name='name'
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                      maxLength={255}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email:
                    </label>
                    <input
                      type="text"
                      id="email"
                      name='email'
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
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
                      name='password'
                      className="form-control"
                      value={formData.password}
                      onChange={handleChange}
                      minLength={8}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password_confirmation" className="form-label">
                      Confirm Password:
                    </label>
                    <input
                      type="password"
                      id="password_confirmation"
                      name="password_confirmation"
                      className="form-control"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      minLength={8}
                      required
                    />
                  </div>
                  <div className="text-center mt-3">
                    <button type="submit" className="btn btn-primary">
                      Sign Up
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

export default SignUpComponent;
