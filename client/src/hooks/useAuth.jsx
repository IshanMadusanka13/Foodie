import { useState, useEffect, useContext, createContext } from 'react';
import { api } from '../utils/fetchapi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({
    user_id: 'R001',
    name: 'John Rider',
    email: 'john.rider@example.com',
    phone: '+94 77 123 4567',
    role: 'rider',
    profile_image: 'https://randomuser.me/api/portraits/men/32.jpg',
    vehicle_type: 'motorcycle',
    vehicle_number: 'ABC-1234',
    rating: 4.8,
    active: true,
    created_at: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("Current User:", currentUser);
  useEffect(() => {

    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    if (token) {
      api.getCurrentUser(email)
        .then(user => {
          setCurrentUser(user);

        })
        .catch(err => {
          console.error('Failed to fetch user:', err);
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const value = {
    currentUser,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};