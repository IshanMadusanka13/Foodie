// client/src/utils/socketService.js
import io from 'socket.io-client';

let socket = null;

export const initSocket = (url) => {
  if (!socket) {
    // Use the correct delivery service URL with socket.io path
    socket = io(import.meta.env.VITE_DELIVERY_SERVICE_URL || 'http://localhost:5005', {
      path: '/socket.io/'
    });
    console.log('Socket initialized with URL:', import.meta.env.VITE_DELIVERY_SERVICE_URL || 'http://localhost:5005');
  }
  return socket;
};


export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized. Call initSocket first.');
  }
  return socket;
};

export const joinDeliveryTracking = (deliveryId) => {
  if (!socket) return;
  socket.emit('join:delivery', deliveryId);
};

export const leaveDeliveryTracking = (deliveryId) => {
  if (!socket) return;
  socket.emit('leave:delivery', deliveryId);
};

export const updateRiderLocation = (deliveryId, latitude, longitude) => {
  if (!socket) return;
  socket.emit('rider:location', { deliveryId, latitude, longitude });
};

export const onDeliveryLocationUpdate = (callback) => {
  if (!socket) return;
  socket.on('delivery:location', callback);
};

export const offDeliveryLocationUpdate = () => {
  if (!socket) return;
  socket.off('delivery:location');
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Socket disconnected');
  }
};
