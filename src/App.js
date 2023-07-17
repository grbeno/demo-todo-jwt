import React, {useState, useEffect} from 'react';
import axiosInstance from './axios';
import jwt_decode from "jwt-decode";


export default function App() {
  
  // token and user
  const token = localStorage.getItem('access_token');
  const user = token ? jwt_decode(token) : 0;

  // states
  const [todos, setTodos] = useState([]);

  // axios call
  const getTodos = () => {
    axiosInstance.get('/api/').then(res => {
      setTodos(res.data);
    })
    .catch(err => {
      console.log(err);
    });
  }

  // call getTodos on component mount
  useEffect(() => {
    getTodos();
  }, []);

  return (
    <>
    {token ? (
      <div className='container p-4'>
        <h4 className="text-secondary">The todos below are created by user: <span className="text-success">{user.username}</span></h4>
        <hr />
        {todos.map(item => (
          <div key={item.id}>
            <h4>{item.title}</h4>
            <p>{item.body}</p>
            <hr />
          </div>
        ))}
      </div>
    ) : (
      <h4 className="d-flex p-4 justify-content-center">You are not logged in!</h4>
    )}
  </>
  );
}

