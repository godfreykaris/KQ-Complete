import React, { useState } from 'react';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try 
    {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('access_token', data.access_token);
        // Determine the role (admin or HRM) based on your backend's response
        const userRole = data.role; // Replace 'role' with the actual key that holds the role
        if (userRole === 'admin') {
          //navigate('/admin'); // Redirect to admin frontend
        } else if (userRole === 'hrm') {
          //navigate('/hrm'); // Redirect to HRM frontend
        }
      } else {
        console.log('Authentication failed.');
      }
    } catch (error) {
      console.log('Error signing in:', error);
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSignIn}>
        <div>
          <label>Email:</label>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;
