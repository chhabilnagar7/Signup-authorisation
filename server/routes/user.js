import express from "express";
import bcrypt from "bcrypt";
import { User } from "../Models/User.js";
import { OTP } from "../Models/OTP.js"; // Import OTP model
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import generateOTP from "./generateOtp.js";


const router = express.Router();

// For handling Signup
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.json({ message: "User already exists" });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashPassword,
  });

  await newUser.save();
  return res.json({ status: true, message: "User registered" });
});

// For handling Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ message: "User not registered" });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.json({ message: "Password is incorrect" });
  }

  const token = jwt.sign({ username: user.username }, process.env.KEY, {
    expiresIn: "1h",
  });

  res.cookie("token", token, { httpOnly: true, maxAge: 5 * 60 * 1000 });
  return res.json({ status: true, message: "Login successful" });
});

// Generate OTP 
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "User not registered" });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

    // Save OTP to db
    await OTP.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const token = jwt.sign({ email }, process.env.KEY, { expiresIn: "5m" });

    // Sendign email with OTP and reset link
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      text: `To reset your password, please visit: http://localhost:5173/resetPassword/${token} \nYour OTP is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.json({ message: "Error sending email" });
      }
      return res.json({ status: true, message: "Email sent" });
    });
  } catch (err) {
    console.log(err);
    return res.json({ message: "Error processing request" });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Finding OTP record in db
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP or OTP expired' });
    }

    // deleting Otp afer verification 
    await OTP.deleteOne({ email, otp });

    
    res.json({ status: true, message: 'OTP verified successfully' });

  } catch (err) {
    console.error('Error in /verify-otp route:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Reset Password
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.KEY);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.json({ message: "User not found" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(user._id, { password: hashPassword });
    return res.json({ status: true, message: "Password updated" });
  } catch (err) {
    return res.json({ message: "Invalid or expired token" });
  }
});

// For protected routes
const verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ status: false, message: "No token provided" });
    }
    await jwt.verify(token, process.env.KEY);
    next();
  } catch (err) {
    return res.json({ status: false, message: "Unauthorized" });
  }
};

// Verify Route
router.get("/verify", verifyUser, (req, res) => {
  return res.json({ status: true, message: "Authorized" });
});

// For logout
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ status: true });
});

export { router as UserRouter };
