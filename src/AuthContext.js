import React, { createContext } from 'react';
import './App.css';
import axiosInstance from './axios';


const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({children}) => {

    // login
    const login = (e, errorCallback) => {
        e.preventDefault();
        
        axiosInstance.post('/api/token/', {
            username: e.target.username.value,
            password: e.target.password.value 
        })
        .then((response) => {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            axiosInstance.defaults.headers['Authorization'] =
                'JWT ' + localStorage.getItem('access_token');
            // window.location.reload();  // localhost:3000
            window.location.href = '/';   // localhost:8000
        }).catch((error) => {
            errorCallback("Wrong username or password! Try again.");
            console.log('Possibly wrong username or password: ' + error);
        });
    };

    // logout
    const logout = () => {
        // blacklist token
        axiosInstance.post('/api/token/blacklist/', {
            "refresh_token": localStorage.getItem('refresh_token')
        })
        .then((response) => {
            console.log(response);
            // remove tokens
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            delete axiosInstance.defaults.headers['Authorization'];
            window.location.reload();
        }).catch((error) => {
            console.log(error);
        });
    };

    const contextData = {login, logout};
      
    return (
        <>
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
        </>
    );
}

