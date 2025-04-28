// client/src/components/DeliveryTracking.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../utils/fetchapi';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { 
  initSocket,
  getSocket, 
  joinDeliveryTracking, 
  leaveDeliveryTracking,
  onDeliveryLocationUpdate,
  offDeliveryLocationUpdate
} from '../utils/socketService';

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const restaurantIcon = new L.Icon({
  iconUrl: '/restaurant.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

const customerIcon = new L.Icon({
  iconUrl: '/customer.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

const riderIcon = new L.Icon({
  iconUrl: '/delivery.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

// Component to recenter map
function MapCenterSetter({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

const DeliveryTracking = () => {
  const { deliveryId } = useParams();
  const [delivery, setDelivery] = useState(null);
  const [riderLocation, setRiderLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([7.8731, 80.7718]); // Default to Sri Lanka center
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [routeToDestination, setRouteToDestination] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [estimatedDistance, setEstimatedDistance] = useState(null);

  // Initialize socket and fetch delivery data
  useEffect(() => {
    console.log('Initializing socket and fetching delivery data for ID:', deliveryId);
    // Initialize socket connection
    initSocket();
    
    // Fetch delivery details
    const fetchDelivery = async () => {
      try {
        console.log('Fetching delivery details for deliveryId:', deliveryId);
        const data = await api.trackDelivery(deliveryId);
        console.log('Received delivery data:', data);
        setDelivery(data);
        
        // Set map center to restaurant location initially
        if (data.restaurant_location) {
          setMapCenter([data.restaurant_location.latitude, data.restaurant_location.longitude]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching delivery details:', err);
        setError('Failed to load delivery details');
        setLoading(false);
      }
    };
    
    fetchDelivery();
    
    return () => {
      // Clean up socket listeners
      offDeliveryLocationUpdate();
    };
  }, [deliveryId]);

  // Join delivery tracking room and listen for updates
  useEffect(() => {
    if (delivery) {
      console.log(`Joining delivery tracking room for delivery: ${deliveryId}`);
      // Join the delivery tracking room
      joinDeliveryTracking(deliveryId);
      
      // Set up listener for location updates
      onDeliveryLocationUpdate((data) => {
        console.log('Received location update:', data);
        if (data.deliveryId === deliveryId) {
          const updatedLocation = {
            latitude: data.location.latitude,
            longitude: data.location.longitude
          };
          
          setRiderLocation(updatedLocation);
          
          // Update route
          if (delivery.status === 'accepted' || delivery.status === 'collected') {
            const destination = delivery.status === 'accepted' 
              ? delivery.restaurant_location 
              : delivery.customer_location;
            
            updateRouteToDestination(updatedLocation, destination);
          }
        }
      });
      
      // Set up listener for status updates
      const socket = getSocket();
      
      socket.on('delivery:status_updated', (data) => {
        console.log('Received status update:', data);
        if (data.deliveryId === deliveryId) {
          console.log(`Updating delivery status to: ${data.status}`);
          setDelivery(prev => ({
            ...prev,
            status: data.status,
            updated_at: data.timestamp
          }));
          
          // Update map center based on new status
          if (data.status === 'accepted' && delivery.restaurant_location) {
            setMapCenter([delivery.restaurant_location.latitude, delivery.restaurant_location.longitude]);
          } else if (data.status === 'collected' && delivery.customer_location) {
            setMapCenter([delivery.customer_location.latitude, delivery.customer_location.longitude]);
          }
        }
      });
      
      return () => {
        // Leave the delivery tracking room when component unmounts
        console.log(`Leaving delivery tracking room for delivery: ${deliveryId}`);
        leaveDeliveryTracking(deliveryId);
        offDeliveryLocationUpdate();
        socket.off('delivery:status_updated');
      };
    }
  }, [delivery, deliveryId]);

  // Function to update the route
  const updateRouteToDestination = (origin, destination) => {
    try {
      // For simplicity, we'll just draw a straight line
      const routePoints = [
        [origin.latitude, origin.longitude],
        [destination.latitude, destination.longitude]
      ];
      
      setRouteToDestination(routePoints);
      
      // Calculate estimated time and distance
      const distance = calculateDistance(
        origin.latitude, 
        origin.longitude, 
        destination.latitude, 
        destination.longitude
      );
      
      setEstimatedDistance(distance);
      
      // Rough estimate: assume 30 km/h average speed
      const timeInHours = distance / 30;
      const timeInMinutes = Math.round(timeInHours * 60);
      setEstimatedTime(timeInMinutes);
      
    } catch (err) {
      console.error("Error updating route:", err);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {error}
    </div>;
  }

  if (!delivery) {
    return <div className="text-center py-8">
      <p className="text-gray-600">Delivery not found.</p>
    </div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Delivery Tracking</h2>
        <p className="text-gray-600">Order ID: {delivery.order_id}</p>
        <p className="text-gray-600">Status: 
          <span className={`ml-2 font-semibold ${
            delivery.status === 'accepted' ? 'text-blue-600' : 
            delivery.status === 'collected' ? 'text-orange-600' : 
            delivery.status === 'delivered' ? 'text-green-600' :
            'text-gray-600'
          }`}>
            {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
          </span>
        </p>
        
        {estimatedDistance && (
          <p className="text-gray-600 mt-2">
            Distance: {estimatedDistance.toFixed(1)} km
          </p>
        )}
        
        {estimatedTime && (
          <p className="text-gray-600">
            Est. Time: {estimatedTime} min
          </p>
        )}
      </div>
      
      <div className="h-[400px]">
        <MapContainer 
          center={mapCenter} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Restaurant marker */}
          <Marker 
            position={[
              delivery.restaurant_location.latitude, 
              delivery.restaurant_location.longitude
            ]}
            icon={restaurantIcon}
          >
            <Popup>Restaurant Location</Popup>
          </Marker>
          
          {/* Customer marker */}
          <Marker 
            position={[
              delivery.customer_location.latitude, 
              delivery.customer_location.longitude
            ]}
            icon={customerIcon}
          >
            <Popup>Your Location</Popup>
          </Marker>
          
          {/* Rider marker */}
          {riderLocation && (
            <Marker 
              position={[riderLocation.latitude, riderLocation.longitude]}
              icon={riderIcon}
            >
              <Popup>Rider Location</Popup>
            </Marker>
          )}
          
          {/* Route line */}
          {routeToDestination && (
            <Polyline 
              positions={routeToDestination}
              color={delivery.status === 'accepted' ? 'blue' : 'green'}
              weight={4}
              opacity={0.7}
              dashArray={delivery.status === 'accepted' ? '10, 10' : ''}
            />
          )}
          
          <MapCenterSetter center={mapCenter} />
        </MapContainer>
      </div>
      
      <div className="p-4 bg-gray-50">
        <h3 className="font-medium text-gray-800 mb-2">Delivery Status</h3>
        <div className="flex items-center">
          <div className="relative">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              ['accepted', 'collected', 'delivered'].includes(delivery.status) 
                ? 'bg-green-500' : 'bg-gray-300'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
              </svg>
            </div>
            <div className="absolute top-0 left-8 h-1 w-16 bg-gray-300">
              <div className={`h-full ${
                ['collected', 'delivered'].includes(delivery.status) 
                  ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
            </div>
          </div>
          
          <div className="relative ml-16">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              ['collected', 'delivered'].includes(delivery.status) 
                ? 'bg-green-500' : 'bg-gray-300'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
              </svg>
            </div>
            <div className="absolute top-0 left-8 h-1 w-16 bg-gray-300">
            <div className={`h-full ${
                delivery.status === 'delivered' 
                  ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
            </div>
          </div>
          
          <div className="ml-16">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              delivery.status === 'delivered' 
                ? 'bg-green-500' : 'bg-gray-300'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex text-xs text-gray-500 mt-1">
          <span className="w-8 text-center">Accepted</span>
          <span className="w-24 text-center">Collected</span>
          <span className="w-24 text-center">Delivered</span>
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

export default DeliveryTracking;

