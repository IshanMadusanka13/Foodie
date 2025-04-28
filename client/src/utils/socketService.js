// client/src/utils/socketService.js
import io from 'socket.io-client';

let socket = null;

export const initSocket = (url) => {
  if (!socket) {
    // Use the correct delivery service URL with socket.io path
    socket = io(import.meta.env.VITE_DELIVERY_SERVICE_URL || 'http://localhost:5005', {
      path: '/socket.io/',
      transports: ['websocket', 'polling'] // Ensure both transport methods are available
    });
    console.log('Socket initialized with URL:', import.meta.env.VITE_DELIVERY_SERVICE_URL || 'http://localhost:5005');
    
    // Set up global error handling for socket
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
    
    socket.on('connect', () => {
      console.log('Socket connected with ID:', socket.id);
    });
    
    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    initSocket(); // Auto-initialize if not already done
  }
  return socket;
};

export const joinDeliveryTracking = (deliveryId) => {
  if (!socket) {
    initSocket();
  }
  console.log(`Joining delivery tracking room for: ${deliveryId}`);
  socket.emit('join:delivery', deliveryId);
};

export const leaveDeliveryTracking = (deliveryId) => {
  if (!socket) return;
  console.log(`Leaving delivery tracking room for: ${deliveryId}`);
  socket.emit('leave:delivery', deliveryId);
};

export const updateRiderLocation = (deliveryId, latitude, longitude) => {
  if (!socket) {
    initSocket();
  }
  console.log(`Updating rider location for delivery: ${deliveryId}`, { latitude, longitude });
  socket.emit('rider:location', { deliveryId, latitude, longitude });
};

export const onDeliveryLocationUpdate = (callback) => {
  if (!socket) {
    initSocket();
  }
  console.log('Setting up listener for delivery:location events');
  socket.on('delivery:location', callback);
};

export const offDeliveryLocationUpdate = () => {
  if (!socket) return;
  console.log('Removing listener for delivery:location events');
  socket.off('delivery:location');
};

export const onDeliveryStatusUpdate = (callback) => {
  if (!socket) {
    initSocket();
  }
  console.log('Setting up listener for delivery:status_updated events');
  socket.on('delivery:status_updated', callback);
};

export const offDeliveryStatusUpdate = () => {
  if (!socket) return;
  console.log('Removing listener for delivery:status_updated events');
  socket.off('delivery:status_updated');
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Socket disconnected');
  }
};
