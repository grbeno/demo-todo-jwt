import React, {useContext, useState} from 'react'
import AuthContext from "./AuthContext";


const Login = () => {

    const {login} = useContext(AuthContext);
    const [error, setError] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        login(e, (errorMessage) => {
            setError(errorMessage);
        });
    };

    return (
        <div className="container">
            <form onSubmit={handleLogin}>
                <input type="text" name="username"/>
                <input type="password" name="password"/>
                <input type="submit" value="Login" />
            </form>
            {error && <p className="mt-1 text-danger">{error}</p>} {/* Display the error message if it exists */}
        </div>
    );
}

export default Login