const USER_SERVICE_API_URL = 'http://localhost:5000/api';
const RESTAURANT_SERVICE_API_URL = 'http://localhost:4000/api/restaurant';
const MENU_ITEM_API_URL = 'http://localhost:4000/api/menu-items';
const PAYMENT_SERVICE_API_URL = 'http://localhost:5002/api';
const ORDER_SERVICE_API_URL = 'http://localhost:5003/api';
const NOTIFICATION_SERVICE_API_URL = 'http://localhost:5004/api';
const DELIVERY_SERVICE_API_URL = 'http://localhost:5005/api';
;

const fetchApi = async (endpoint, options = {}) => {
    const isFormData = options.body instanceof FormData;
    const token = localStorage.getItem('token');

    const headers = {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(`${endpoint}`, config);
        //console.log('API Request:', { endpoint, options });
        // console.log('API Response:', response);

        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return null;
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const text = await response.text();
            const data = text ? JSON.parse(text) : {};

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            return data;
        } else {
            if (!response.ok) {
                throw new Error('Something went wrong');
            }

            return { success: true };
        }
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const api = {
    // User
    login: (credentials) =>
        fetchApi(USER_SERVICE_API_URL + '/users/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        }),

    register: (userData) =>
        fetchApi(USER_SERVICE_API_URL + '/users', {
            method: 'POST',
            body: JSON.stringify(userData)
        }),

    getCurrentUser: (user_id) =>
        fetchApi(USER_SERVICE_API_URL + '/users/' + user_id, {
            method: 'GET'
        }),

    editProfile: (userData, user_id) =>
        fetchApi(USER_SERVICE_API_URL + '/users/' + user_id, {
            method: 'PUT',
            body: JSON.stringify(userData)
        }),

    updateProfileImage: (userData, user_id) =>
        fetchApi(USER_SERVICE_API_URL + '/users/pic/' + user_id, {
            method: 'PUT',
            body: JSON.stringify(userData)
        }),


    //Order
    createOrder: (orderDetails) =>
        fetchApi(ORDER_SERVICE_API_URL + '/order/', {
            method: 'POST',
            body: JSON.stringify(orderDetails)
        }),

    getOrderByUser: (user_id) =>
        fetchApi(ORDER_SERVICE_API_URL + '/order/user/' + user_id, {
            method: 'GET'
        }),
    getCurrentUser: (email) =>
        fetchApi(`${USER_SERVICE_API_URL}/users/${email}`),

    // Delivery
    getNearbyDeliveries: (longitude, latitude, maxDistance = 10000) =>
        fetchApi(`${DELIVERY_SERVICE_API_URL}/deliveries/nearby?longitude=${longitude}&latitude=${latitude}&maxDistance=${maxDistance}`),

    getRiderDeliveries: (riderId) =>
        fetchApi(`${DELIVERY_SERVICE_API_URL}/deliveries/rider/${riderId}`),

    getDeliveryById: (deliveryId) =>
        fetchApi(`${DELIVERY_SERVICE_API_URL}/deliveries/${deliveryId}`),

    acceptDelivery: (deliveryId, riderId) =>
        fetchApi(`${DELIVERY_SERVICE_API_URL}/deliveries/${deliveryId}/accept`, {
            method: 'PUT',
            body: JSON.stringify({ riderId })
        }),

    updateDeliveryStatus: (deliveryId, status) =>
        fetchApi(`${DELIVERY_SERVICE_API_URL}/deliveries/${deliveryId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        }),

    getDeliverIdByOrder: (orderId,) =>
        fetchApi(`${DELIVERY_SERVICE_API_URL}/deliveries/order/${orderId}`, {
            method: 'GET'
        }),

    getDeliveriesByRider: (riderId,) =>
        fetchApi(`${DELIVERY_SERVICE_API_URL}/deliveries/rider/${riderId}`, {
            method: 'GET'
        }),

    updateRiderLocation: (deliveryId, latitude, longitude) =>
        fetchApi(`${DELIVERY_SERVICE_API_URL}/deliveries/${deliveryId}/location`, {
            method: 'PUT',
            body: JSON.stringify({ latitude, longitude })
        }),

    getActiveDelivery: (riderId) =>
        fetchApi(`${DELIVERY_SERVICE_API_URL}/deliveries/rider/${riderId}/active`),

    trackDelivery: (deliveryId) =>
        fetchApi(`${DELIVERY_SERVICE_API_URL}/deliveries/${deliveryId}/track`),

    getDeliveryByOrderId: (orderId) =>
        fetchApi(`${DELIVERY_SERVICE_API_URL}/deliveries/order/${orderId}`),

    // --- Restaurant APIs ---
    createRestaurant: (restaurantData, token) =>
        fetchApi(RESTAURANT_SERVICE_API_URL, {
            method: 'POST',
            // headers: {
            //     Authorization: `Bearer ${token}`,
            // },
            body: JSON.stringify(restaurantData),
        }),

    getAllRestaurants: () =>
        fetchApi(RESTAURANT_SERVICE_API_URL + '/', {
            method: 'GET',
        }),

    getRestaurantById: (id) =>
        fetchApi(`${RESTAURANT_SERVICE_API_URL}/${id}`, {
            method: 'GET',
        }),

    getRestaurantsByOwner: (ownerId) =>
        fetchApi(`${RESTAURANT_SERVICE_API_URL}/owner/${ownerId}`, {
            method: 'GET'
            }),

    updateRestaurant: (id, formData) =>
        fetchApi(`${RESTAURANT_SERVICE_API_URL}/${id}`, {
            method: 'PUT',
            // headers: {
            //     Authorization: `Bearer ${token}`,
            // },
            body: formData, 
        }),

    deleteRestaurant: (id, token) =>
        fetchApi(`${RESTAURANT_SERVICE_API_URL}/${id}`, {
            method: 'DELETE',
            // headers: {
            //     Authorization: `Bearer ${token}`,
            // },
        }),

    // --- Menu Item APIs ---
    createMenuItem: (formData) =>
        fetchApi(MENU_ITEM_API_URL + '/', {
            method: 'POST',
            // headers: {
            //     Authorization: `Bearer ${token}`,
            // },
            body: formData,
        }),

    getMenuItemsByRestaurant: (restaurantId) =>
        fetchApi(`${MENU_ITEM_API_URL}/restaurant/${restaurantId}`, {
            method: 'GET',
        }),

    getMenuItemById: (id) =>
        fetchApi(`${MENU_ITEM_API_URL}/${id}`, {
            method: 'GET',
        }),

    getMenuItemsByCategory: (category) =>
        fetchApi(`${MENU_ITEM_API_URL}/category?category=${encodeURIComponent(category)}`, {
            method: 'GET',
        }),

    getPaginatedMenuItems: (restaurantId, page = 1, limit = 10) =>
        fetchApi(`${MENU_ITEM_API_URL}/restaurant/${restaurantId}/paginated?page=${page}&limit=${limit}`, {
            method: 'GET',
        }),

    updateMenuItem: (id, formData) =>
        fetchApi(`${MENU_ITEM_API_URL}/${id}`, {
            method: 'PUT',
            // headers: {
            //     Authorization: `Bearer ${token}`,
            // },
            body: formData,
        }),

    deleteMenuItem: (id) =>
        fetchApi(`${MENU_ITEM_API_URL}/${id}`, {
            method: 'DELETE',
        }),

    uploadMultipleMenuItemImages: (formData) =>
        fetchApi(`${MENU_ITEM_API_URL}/upload-multiple`, {
            method: 'POST',
            // headers: {
            //     Authorization: `Bearer ${token}`,
            // },
            body: formData,
        }),

    getAllMenuItems: () =>
        fetchApi(`${MENU_ITEM_API_URL}/all`, {
            method: 'GET',
        }),

};

export default api;
