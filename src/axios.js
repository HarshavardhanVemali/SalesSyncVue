import axios from 'axios';
import router from './router' 

const api = axios.create({
    baseURL: 'https://salessyncpython.onrender.com',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});


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
    if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
        try {
            const response = await axios.post('https://salessyncpython.onrender.com/token/refresh/', {
                refresh: refreshToken,
            });

            const newToken = response.data.access;
            localStorage.setItem('access_token', newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest); // Retry the original request with the new token
        } catch (refreshError) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            router.push('/adminlogin');
            return Promise.reject(refreshError); // If refresh fails, log the user out and redirect them
        }
        } else {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            router.push('/adminlogin');
        }
    }
        return Promise.reject(error);
    }
);


export default api;