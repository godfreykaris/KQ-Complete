// useLogout.ts
import { useNavigate } from 'react-router-dom';
import apiBaseUrl from '../../config';

const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try 
    {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      if (!csrfToken) 
      {
        console.error('CSRF token not found.');

        navigate('/signin');
        return;
      }

      const accessToken = sessionStorage.getItem('access_token');
      if (!accessToken) {
        // Redirect to the sign-in page if the accessToken is not set
        navigate('/signin');
        return;
      }

      const response = await fetch(`${apiBaseUrl}/users/logout`, {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) 
      {
        // Logout successful
        sessionStorage.removeItem('access_token');
        // Redirect to the sign-in page after logout
        navigate('/signin');
      } 
      else 
      {
        // Logout successful
        sessionStorage.removeItem('access_token');
        // Redirect to the sign-in page after logout
        navigate('/signin');
      }
    } 
    catch (error) 
    {
      // Handle network or other errors
    }
  };

  return handleLogout;
};

export default useLogout;
