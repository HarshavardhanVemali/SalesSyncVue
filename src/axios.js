import axios from 'axios';

const api = axios.create({
    baseURL: 'https://6c43-2405-201-c026-70ef-69e4-42d1-4975-4792.ngrok-free.app',
    withCredentials:true, // this helps the browser to send cookies in the header
    headers: {
        'Content-Type': 'application/json',
    },
});


// Add a request interceptor to include the token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


// Response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
        try {
            const response = await axios.post('https://6c43-2405-201-c026-70ef-69e4-42d1-4975-4792.ngrok-free.app/api/token/refresh/', {
                refresh: refreshToken,
            });

            const newToken = response.data.access;
            localStorage.setItem('access_token', newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest); // Retry the original request with the new token
        } catch (refreshError) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/adminlogin'

            return Promise.reject(refreshError); // If refresh fails, log the user out and redirect them
        }
        } else {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
             window.location.href = '/adminlogin'

        }
    }
        return Promise.reject(error);
    }
);


export default api;