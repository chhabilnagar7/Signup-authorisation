import React, { useState } from "react";
import "../App.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8000/auth/signup", {
        username,
        email,
        password,
      })
      .then((response) => {
        if(response.data.status){
            navigate('/login')
        }
        
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="sign-up-container">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>

        <label htmlFor="username">Username:</label>
        <input
          // id="username"
          type="text"
          //   autoComplete="off"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

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

        <button type="submit">Sign Up</button>
        <p>Have an Account?<Link to="/login">Login</Link></p> 
      </form>
    </div>
  );
};

export default Signup;
