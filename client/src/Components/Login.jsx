import React, { useState } from "react";
import "../App.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate()

  // to access cookie
  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8000/auth/login", {
        
        email,
        password,
      })
      .then((response) => {
        if(response.data.status){
            navigate('/')
        }
        
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="sign-up-container">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        

        <label htmlFor="email">Email:</label>
        <input
          //   id="email"
          type="email"
          autoComplete="off"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password:</label>
        <input
      
          id="password"
          type="password"
          placeholder="*********"
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password" 
        />

        <button type="submit">Login</button>
        <Link to="/forgotPassword">Forgot Password?</Link>
        <p>Don't Have Account?<Link to="/signup">Sign Up</Link></p> 
      </form>
    </div>
  );
};

export default Login
