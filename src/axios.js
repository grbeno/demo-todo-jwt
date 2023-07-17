import axios from 'axios';
import { expirationTime } from './utils';


const baseURL = 'http://localhost:8000';

const axiosInstance = axios.create({
	baseURL: baseURL,
	timeout: 5000,
	headers: {
		Authorization: localStorage.getItem('access_token')
			? 'JWT ' + localStorage.getItem('access_token')
			: null,
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	}, 
});

// token flags
const tokenFlags = {
    isRefreshing: false,
    refreshFailed: false,
};

 // remove tokens
 const removeTokens = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    delete axiosInstance.defaults.headers['Authorization'];
    window.location.reload();
};

// refresh token
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        const originalRequest = error.config;

        // Prevent infinite loops
        if (error.response.status === 401 && originalRequest.url === baseURL + '/api/token/refresh/') {
            console.log('error 401');
            return Promise.reject(error);
        }

        if (error.response.data.code === "token_not_valid" && error.response.status === 401 && error.response.statusText === "Unauthorized") {
            
            const refreshToken = localStorage.getItem('refresh_token') ? localStorage.getItem('refresh_token') : null;

            if (refreshToken) {

                const body = {
                    refresh: refreshToken
                };

                if (!tokenFlags.isRefreshing && !tokenFlags.refreshFailed) {
                    tokenFlags.isRefreshing = true;

                    console.log('Access token expired. Attempting to refresh token ...');
                    console.log('access_token_expired_@: ' + expirationTime('access_token'));
                    
                    return axiosInstance.post('/api/token/refresh/', body)
                    .then((response) => {
                        localStorage.setItem('access_token', response.data.access);
                        localStorage.setItem('refresh_token', response.data.refresh);  // renew refresh token - authenticated while the user is active!

                        axiosInstance.defaults.headers['Authorization'] = 
                            'JWT ' + response.data.access;
                        originalRequest.headers['Authorization'] = 
                            'JWT ' + response.data.access;

                        tokenFlags.isRefreshing = false;
                        console.log('refreshToken activated!');
                        
                        return axiosInstance(originalRequest);
                    })
                    .catch(err => {
                        console.log(err);
                        tokenFlags.refreshFailed = true;
                    });
                }
                else {
                    console.log("Refresh token expired.");
                    console.log('refresh_token_expired_@: ' + expirationTime('refresh_token'));
                    removeTokens();
                }
            }
            else {
                console.log("Refresh token not available.");
            }
        } 
        else {
            return Promise.reject(error);
        }
});

export default axiosInstance;