import axios from 'axios';
import { expirationTime } from './utils';


// call base url from .env file
const baseURL = process.env.REACT_APP_BASE_URL;

// Function to get the CSRF token from Django
const getCSRFToken = () => {
    const csrfCookie = document.cookie.match(/csrftoken=([^;]*)/);
    return csrfCookie ? csrfCookie[1] : null;
};

const axiosInstance = axios.create({
	baseURL: baseURL,
	timeout: 5000,
	headers: {
		Authorization: localStorage.getItem('access_token')
			? 'JWT ' + localStorage.getItem('access_token')
			: null,
        'X-CSRFToken': getCSRFToken(),
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	}, 
});

 // remove tokens
 const removeTokens = (error) => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    delete axiosInstance.defaults.headers['Authorization'];
    window.location.href = '/login';
    return Promise.reject(error); 
};

// token flags
const tokenFlags = {
    isRefreshing: false,
    refreshFailed: false,
};

// refresh token
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        const originalRequest = error.config;
        // console.log('response ' + JSON.stringify(error.response));

        if (error.response.status === 401 && originalRequest.url === baseURL + '/api/token/refresh/') {
            console.log('prevent loop - error 401');
            window.location.href = '/login'; 
            return Promise.reject(error);  // Prevent infinite loops
        }

        if (error.response.status === 401) {  
            
            if (expirationTime('refresh_token', false) < Date.now() / 1000) {  // refresh token expired
                console.log("Refresh token expired.");
                console.log('refresh_token_expired_@: ' + expirationTime('refresh_token'));
                removeTokens(error);
            }
            
            const refreshToken = localStorage.getItem('refresh_token');
            
            if (refreshToken) {  // refresh token available

                if (!tokenFlags.isRefreshing && !tokenFlags.refreshFailed ) {         
                    tokenFlags.isRefreshing = true;
                    
                    console.log('Access token expired. Attempting to refresh token ...');
                    console.log('access_token_expired_@: ' + expirationTime('access_token'));
                    
                    return axiosInstance
                    .post('/api/token/refresh/', { refresh: refreshToken })
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
                        tokenFlags.refreshFailed = true;
                        console.log(err);
                    })
                    .finally (() => {
                        window.location.href = '/chat';
                    });   
                }
                else {
                    console.log("Access token expired.");
                    console.log('access_token_expired_@: ' + expirationTime('access_token'));
                }
            }
            else {
                console.log("Refresh token not available.");
            }
        } 
        else {
            console.log("not 401 error");
            return Promise.reject(error);   
        }    
});

export default axiosInstance;