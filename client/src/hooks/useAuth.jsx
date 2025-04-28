import { useState, useEffect, useContext, createContext } from 'react';
import { api } from '../utils/fetchapi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({
    user_id: 'R002',
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
    const foodie_user = localStorage.getItem('foodie_user');
    
    if (foodie_user) {
      try {
        const parsedUser = JSON.parse(foodie_user);
        api.getCurrentUser(parsedUser.user_id)
          .then(user => {
            setCurrentUser(user);
          })
          .catch(err => {
            console.error('Failed to fetch user:', err);
            localStorage.removeItem('foodie_user');
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (err) {
        console.error('Failed to parse user data:', err);
        localStorage.removeItem('foodie_user');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const register = async (userData) => {
    try {
      setError(null);
      const response = await api.register(userData);
      return { success: true, data: response };
    } catch (err) {
      setError(err.message || 'Registration failed');
      return { success: false, error: err.message };
    }
  };
  
  const login = async (credentials) => {
    try {
      setError(null);
      const response = await api.login(credentials);
  
      localStorage.setItem('foodie_user', JSON.stringify({
        token: response.token,
        user_id: response.user_id,
        role: response.role
      }));
  
      const user = await api.getCurrentUser(response.user_id);
      setCurrentUser(user);
  
      return { success: true };
    } catch (err) {
      setError(err.message || 'Login failed');
      return { success: false, error: err.message };
    }
  };
  
  
  const logout = () => {
    localStorage.removeItem('foodie_user');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout
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