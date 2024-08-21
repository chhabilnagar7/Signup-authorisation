// import React, { useState } from "react";
// import "../App.css";
// import axios from "axios";
// import { Link, useNavigate, useParams } from "react-router-dom";

// const ResetPassword = () => {
//   const [password, setPassword] = useState("");

//   const {token} = useParams()

//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     axios
//       .post(`http://localhost:8000/auth/reset-password/${token}`, {
       
//         password,
        
//       })
//       .then((response) => {
//         if (response.data.status) {

//           navigate("/login");
//         }
//         console.log(response.data)
//       })
//       .catch((err) => {
//         console.log(err);
//       });

//     // .then((response) => {
//     //     if (response.data.status) {
//     //       console.log("Navigating to /login"); // Check if this is logged
//     //       navigate("/login");
//     //     }
//     //     console.log(response.data);
//     //   })
      
//   };

//   return (
//     <div className="sign-up-container">
//       <form className="sign-up-form" onSubmit={handleSubmit}>
//         <h2>Reset Password</h2>

        


//         <label htmlFor="password">New Password:</label>
//         <input
      
//           id="password"
//           type="password"
//           placeholder="*********"
//           onChange={(e) => setPassword(e.target.value)}
//           autoComplete="new-password" 
//         />
//         <button type="submit">Reset</button>
    
//       </form>
//     </div>
//   );
// };

// export default ResetPassword;


import React, { useState } from "react";
import "../App.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`http://localhost:8000/auth/reset-password/${token}`, { password });

      if (response.data.status) {
        navigate("/login");
      } else {
        setError(response.data.message || "Error resetting password");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
