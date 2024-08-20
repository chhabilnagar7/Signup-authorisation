import React, { useState } from "react";
import "../App.css";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");

  const {token} = useParams()

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:8000/auth/reset-password/${token}`, {
       
        password,
        
      })
      .then((response) => {
        if (response.data.status) {

          navigate("/login");
        }
        console.log(response.data)
      })
      .catch((err) => {
        console.log(err);
      });

    // .then((response) => {
    //     if (response.data.status) {
    //       console.log("Navigating to /login"); // Check if this is logged
    //       navigate("/login");
    //     }
    //     console.log(response.data);
    //   })
      
  };

  return (
    <div className="sign-up-container">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>

        


        <label htmlFor="password">New Password:</label>
        <input
      
          id="password"
          type="password"
          placeholder="*********"
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password" 
        />
        <button type="submit">Reset</button>
    
      </form>
    </div>
  );
};

export default ResetPassword;
