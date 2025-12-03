import React, { useEffect } from 'react';
import { useNavigate ,useLocation } from 'react-router-dom';
import axios from 'axios';

const Logout = ({ setUsername }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const csrfResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/get-csrf-token/`, { withCredentials: true });
        const csrfToken = csrfResponse.data.csrfToken;

        await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/api/Logout/`,
          {},
          {
            headers: {
              'X-CSRFToken': csrfToken,
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );
      } catch (error) {
        console.error('Logout error:', error);
      }

      // Clear sessionStorage
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('lastVisited');

      // Reset username state
      setUsername('');
      console.log(location.state?.from?.pathname);
    navigate(location.state?.from?.pathname || '/home');
    };

    handleLogout();
  }, [navigate, setUsername]);

  return (
    <div>
      <p>Logging out...</p>
    </div>
  );
};

export default Logout;
