import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import App from './App';
import {AuthProvider} from './AuthContext';
import Login from './Login';
import Signup from './Signup';
import Header from './Header';


 const Provider = () => {
    return (
        <>
        <Router>
            <AuthProvider>
                <Header />
                    <Routes>
                        <Route path="/login" element={<Login />}/>
                        <Route path="/signup" element={<Signup />}/>
                    </Routes>
                <App />
            </AuthProvider>
        </Router>
        </>
    );
};

export default Provider;

