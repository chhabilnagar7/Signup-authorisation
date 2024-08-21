import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifyOtpPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      console.log('Sending OTP request:', { email, otp });
  
      const response = await axios.post("http://localhost:8000/auth/verify-otp", { email, otp });
  
      console.log('Responnse from server:', response.data);
  
      if (response.data.status) {
        navigate("/"); // redirecting to home page if successfully verified
      } else {
        setError(response.data.message || "Invalid OTP or OTP expired");
      }
    } catch (err) {
      console.error('Error during OTP verification:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="verify-otp-container">
      <form className="verify-otp-form" onSubmit={handleSubmit}>
        <h2>Verify OTP</h2>

        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="otp">OTP:</label>
        <input
          id="otp"
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
};

export default VerifyOtpPage;
