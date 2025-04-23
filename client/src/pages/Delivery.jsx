import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../utils/fetchapi';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const restaurantIcon = new L.Icon({
  iconUrl: '/restaurant-marker.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const customerIcon = new L.Icon({
  iconUrl: '/customer-marker.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Component to recenter map
function MapCenterSetter({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

const Delivery = () => {
  const { currentUser } = useAuth();
  const [nearbyDeliveries, setNearbyDeliveries] = useState([]);
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([7.8731, 80.7718]); // Default to Sri Lanka center
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          setMapCenter([latitude, longitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Could not get your location. Please enable location services.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  // Fetch nearby deliveries
  useEffect(() => {
    const fetchNearbyDeliveries = async () => {
      if (!userLocation) return;
      
      try {
        setLoading(true);
        const deliveries = await api.getNearbyDeliveries(userLocation.longitude, userLocation.latitude);
        setNearbyDeliveries(deliveries);
      } catch (err) {
        console.error("Error fetching nearby deliveries:", err);
        setError("Failed to load nearby deliveries.");
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyDeliveries();
    
    // Poll for new deliveries every 30 seconds
    const interval = setInterval(fetchNearbyDeliveries, 30000);
    return () => clearInterval(interval);
  }, [userLocation]);

  // Fetch active delivery if rider has one
  useEffect(() => {
    const fetchActiveDelivery = async () => {
      if (!currentUser) return;
      
      try {
        const deliveries = await api.getRiderDeliveries(currentUser.user_id);
        const active = deliveries.find(d => 
          d.status === 'accepted' || d.status === 'collected'
        );
        
        if (active) {
          setActiveDelivery(active);
          // Center map on restaurant if collecting, customer if delivering
          if (active.status === 'accepted') {
            setMapCenter([active.restaurant_location.latitude, active.restaurant_location.longitude]);
          } else if (active.status === 'collected') {
            setMapCenter([active.customer_location.latitude, active.customer_location.longitude]);
          }
        }
      } catch (err) {
        console.error("Error fetching active delivery:", err);
      }
    };

    fetchActiveDelivery();
  }, [currentUser]);

  const handleAcceptDelivery = async (deliveryId) => {
    try {
      const result = await api.acceptDelivery(deliveryId, currentUser.user_id);
      setActiveDelivery(result);
      setNearbyDeliveries(nearbyDeliveries.filter(d => d.delivery_id !== deliveryId));
      setMapCenter([result.restaurant_location.latitude, result.restaurant_location.longitude]);
    } catch (err) {
      console.error("Error accepting delivery:", err);
      setError("Failed to accept delivery.");
    }
  };

  const handleUpdateStatus = async (status) => {
    try {
      const result = await api.updateDeliveryStatus(activeDelivery.delivery_id, status);
      setActiveDelivery(result);
      
      if (status === 'collected') {
        setMapCenter([result.customer_location.latitude, result.customer_location.longitude]);
      } else if (status === 'delivered') {
        setActiveDelivery(null);
      }
    } catch (err) {
      console.error(`Error updating status to ${status}:`, err);
      setError(`Failed to update delivery status to ${status}.`);
    }
  };

  if (!currentUser || currentUser.role !== 'rider') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p>You must be logged in as a rider to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Delivery Dashboard</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden h-[500px]">
            {userLocation ? (
              <MapContainer 
                center={mapCenter} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {/* User location marker */}
                <Marker position={[userLocation.latitude, userLocation.longitude]}>
                  <Popup>You are here</Popup>
                </Marker>
                
                {/* Active delivery markers */}
                {activeDelivery && (
                  <>
                    <Marker 
                      position={[
                        activeDelivery.restaurant_location.latitude, 
                        activeDelivery.restaurant_location.longitude
                      ]}
                      icon={restaurantIcon}
                    >
                      <Popup>Restaurant Location</Popup>
                    </Marker>
                    
                    <Marker 
                      position={[
                        activeDelivery.customer_location.latitude, 
                        activeDelivery.customer_location.longitude
                      ]}
                      icon={customerIcon}
                    >
                      <Popup>Customer Location</Popup>
                    </Marker>
                  </>
                )}
                
                <MapCenterSetter center={mapCenter} />
              </MapContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p>Loading map...</p>
              </div>
            )}
          </div>
          
          {/* Delivery Info Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {activeDelivery ? (
              <div>
                <h2 className="text-xl font-semibold mb-4">Active Delivery</h2>
                <div className="mb-4">
                  <p className="text-gray-600">Order ID: {activeDelivery.order_id}</p>
                  <p className="text-gray-600">Status: 
                    <span className={`ml-2 font-semibold ${
                      activeDelivery.status === 'accepted' ? 'text-blue-600' : 
                      activeDelivery.status === 'collected' ? 'text-orange-600' : 
                      'text-green-600'
                    }`}>
                      {activeDelivery.status.charAt(0).toUpperCase() + activeDelivery.status.slice(1)}
                    </span>
                  </p>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mb-4">
                  {activeDelivery.status === 'accepted' ? (
                    <div>
                      <h3 className="font-medium text-gray-800 mb-2">Restaurant Location</h3>
                      <p className="text-gray-600 mb-4">Navigate to the restaurant to collect the order.</p>
                      <button 
                        onClick={() => handleUpdateStatus('collected')}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
                      >
                        Mark as Collected
                      </button>
                    </div>
                  ) : activeDelivery.status === 'collected' ? (
                    <div>
                      <h3 className="font-medium text-gray-800 mb-2">Customer Location</h3>
                      <p className="text-gray-600 mb-4">Deliver the order to the customer.</p>
                      <button 
                        onClick={() => handleUpdateStatus('delivered')}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                      >
                        Mark as Delivered
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold mb-4">Available Deliveries</h2>
                {loading ? (
                  <p className="text-gray-600">Loading deliveries...</p>
                ) : nearbyDeliveries.length > 0 ? (
                  <div className="space-y-4">
                    {nearbyDeliveries.map((delivery) => (
                      <div key={delivery.delivery_id} className="border border-gray-200 rounded-lg p-4">
                        <p className="text-gray-600">Order ID: {delivery.order_id}</p>
                        <p className="text-gray-600 mb-2">
                          Distance: {calculateDistance(
                            userLocation.latitude,
                            userLocation.longitude,
                            delivery.restaurant_location.latitude,
                            delivery.restaurant_location.longitude
                          ).toFixed(1)} km
                        </p>
                        <button 
                          onClick={() => handleAcceptDelivery(delivery.delivery_id)}
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        >
                          Accept Delivery
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No deliveries available nearby.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

export default Delivery;

