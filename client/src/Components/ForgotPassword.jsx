// import React, { useState } from "react";
// import "../App.css";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");

//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     axios
//       .post("http://localhost:8000/auth/forgot-password", {
       
//         email,
        
//       })
//       .then((response) => {
//         if (response.data.status) {
//             alert("check your email !")
//           navigate("/login");
//         }
        
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   return (
//     <div className="sign-up-container">
//       <form className="sign-up-form" onSubmit={handleSubmit}>
//         <h2>Forgot Password</h2>

//         <label htmlFor="email">Email:</label>
//         <input
//           //   id="email"
//           type="email"
//           autoComplete="off"
//           placeholder="Email"
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <button type="submit">Send Code</button>
    
//       </form>
//     </div>
//   );
// };

// export default ForgotPassword;


import React, { useState } from "react";
import "../App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/auth/forgot-password", { email });

      if (response.data.status) {
        alert("Check your email for the OTP!");
        navigate("/verify-otp");
      } else {
        setError(response.data.message || "An error occurred");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="sign-up-container">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          autoComplete="off"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Send Code</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
