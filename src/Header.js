import React, {useContext} from 'react';
import './App.css';
import {Link} from 'react-router-dom';
import AuthContext from './AuthContext';


const Header = () => {

    const {logout} = useContext(AuthContext)
    const token = localStorage.getItem('access_token');

    const handleLogout = () => {
        logout();
    };

    return(
        <header>
            <nav className="navbar navbar-expand-md m-0 border-bottom shadow-sm">
                <a className="menu-link navbar-brand mr-auto px-4 text-success" href='/'><span data-toggle="tooltip" title="home"><i className="fa-solid fa-kiwi-bird fa-2x"></i></span></a>
                <>
                {token ? (
                    <a className="h5 m-4 text-light d-block" onClick={handleLogout}><span data-toggle="tooltip" title="logout"><i className="fa-solid fa-power-off fa-2x"></i></span></a>
                ) : (
                    <div>
                        <Link to="/login"><span className="h5 text-success"><i className="fa-solid fa-user mx-2 fa-2x"></i></span></Link>
                    </div>
                )}
                </>
                <a className="h5 m-4 text-light d-block" href="/admin/"><span data-toggle="tooltip" title="django-admin"><i className="fa-solid fa-id-card-clip fa-2x"></i></span></a>
            </nav>
        </header>
    )
}

export default Header